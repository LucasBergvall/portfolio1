import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from collections import Counter
import re
from torch.nn.utils.rnn import pad_sequence
import torch.nn as nn
import difflib

from sqlalchemy import create_engine
import os




# 데이터베이스 연결 URL 수정: 사용자, 비밀번호, 호스트, 포트, DB명을 올바르게 넣으세요.
DATABASE_URL = "mysql+pymysql://root:1234@192.168.0.95:13306/db1"
engine = create_engine(DATABASE_URL)

# MySQL의 book_info 테이블을 DataFrame으로 읽기
book_df = pd.read_sql("SELECT * FROM book_info", engine)

# CSV 파일과 달리 데이터베이스의 컬럼명이 다를 경우 기존 CSV의 열과 매칭되도록 이름 변경
book_df.rename(columns={
    "book_name_info": "타이틀", 
    "writer_info": "작가",
    "book_detail_info": "내용",
    "publisher_info": "출판사",
    "price_info": "원본 가격",
    "genre_info": "카테고리",
    "img_name_info": "이미지 파일명"
}, inplace=True)


df = pd.read_csv(r"C:\HTMLHak\proj2\p2react\backend\fastapi\app\models\data\bookstore_chatbot_qa1_utf8.csv")
# 질문-답변 결합 및 정제
def clean_text(text):
    return re.sub(r"[^가-힣a-zA-Z0-9\s.,!?~]", "", str(text))


def extract_question_info(question):
    title, author, genre, requested_info = None, None, None, None

    if not any(k in question for k in ["제목", "작가", "소설", "장르", "내용", "줄거리", "카테고리"]):
        # 책 관련 키워드 없으면 아예 시도하지 않음
        return None, None, None, None, False
    

    # 책 제목 후보 찾기
    titles = book_df['타이틀'].tolist()
    title_matches = difflib.get_close_matches(question, titles, n=1, cutoff=0.7)
    if title_matches:
        title = title_matches[0]

    # 작가 후보 찾기
    authors = book_df['작가'].unique().tolist()
    author_matches = difflib.get_close_matches(question, authors, n=1, cutoff=0.8)
    if author_matches:
        author = author_matches[0]

    # 카테고리 후보 찾기
    genres = book_df['카테고리'].unique().tolist()
    genre_matches = difflib.get_close_matches(question, genres, n=1, cutoff=0.9)
    if genre_matches:
        genre = genre_matches[0]

    # 요청된 정보 판단
    # 중복 키워드 제거
    if any(k in question for k in ["작가", "저자"]):
        requested_info = "작가"
    elif any(k in question for k in ["카테고리", "장르"]):
        requested_info = "카테고리"
    elif any(k in question for k in ["설명", "내용", "줄거리"]):
        requested_info = "내용"
    else:
        requested_info = None


    has_book_info = any([title, author, genre])
    return title, author, genre, requested_info, has_book_info




def transform_metadata(title, author, genre, description):
    title = title or "알 수 없음"
    author = author or "알 수 없음"
    genre = genre or "알 수 없음"
    return f"책 제목: <TITLE>, 작가: <AUTHOR>, 카테고리: <GENRE>, 설명: <DESC>"\
        .replace("<TITLE>", title).replace("<AUTHOR>", author)\
        .replace("<GENRE>", genre).replace("<DESC>", description)


def remove_particles(sentence):
    # 자주 사용되는 조사 리스트
    particles = ["이", "가", "은", "는", "을", "를", "에", "에서", "에게", "께", "도", "만", "과", "와", "로", "으로", "부터", "까지", "의", "에게서"]
    for p in particles:
        sentence = re.sub(rf"\b{p}\b", "", sentence)  # 띄어쓰기 기준으로 조사 제거
    return sentence.strip()




# 책 제목을 검색하는 함수
def search_book(title):
    result = book_df[book_df["타이틀"].str.contains(title, na=False) | book_df["내용"].str.contains(title, na=False)]
    return result if not result.empty else None

def search_book_info(title=None, author=None, genre=None, info_type=None):
    # 우선 책 제목이 있다면 그걸 기준으로 검색
    if title is not None:
        row = book_df[book_df['타이틀'] == title]
        if not row.empty:
            row = row.iloc[0]
            if info_type == "작가":
                return row['작가']
            elif info_type == "카테고리":
                return row['카테고리']
            elif info_type == "내용":
                return row['내용']

            else:
                # 요청 정보가 없으면 기본적으로 책 제목 반환
                return title

    # 제목 없을 때 작가나 장르로 검색 (간단히 해당 작가/장르 목록 반환)
    if info_type == "작가" and author is not None:
        books = book_df[book_df['작가'] == author]['타이틀'].tolist()
        return f"{author} 작가의 책 목록: {', '.join(books)}" if books else None
    if info_type == "장르" and genre is not None:
        books = book_df[book_df['카테고리'] == genre]['타이틀'].tolist()
        return f"{genre} 장르의 책 목록: {', '.join(books)}" if books else None

    return None
# 질문-답변 데이터 변환
qna_sentences = [
    transform_metadata(
        title=row["타이틀"] if "책 제목" in row else "알 수 없음",
        author=row["작가"] if "작가" in row else "알 수 없음",
        genre=row["카테고리"] if "카테고리" in row else "알 수 없음",
        description=f"질문: {remove_particles(clean_text(row['질문']))} 답변: {clean_text(row['답변'])}"
    )
    for _, row in df.iterrows()
]

book_sentences = [
    f"<BOOK_INFO_BOOST> {transform_metadata(title, author, genre, desc)}"
    for title, author, genre, desc in zip(book_df["타이틀"], book_df["작가"], book_df["카테고리"], book_df["내용"])
]

# 데이터 통합
sentences = qna_sentences + book_sentences  # 일반 질문 + 책 데이터 통합

# 🔹 `<TITLE>`을 단어 사전에 확실히 포함
#book_titles = list(book_data["타이틀"])  # 책 제목 리스트

def tokenize(sentence):
    return re.findall(r"\w+|[.,!?]", sentence)

tokens = [word for s in sentences for word in s.split()]
vocab = ["<PAD>", "<BOS>", "<EOS>", "<UNK>", "<TITLE>", "<AUTHOR>", "<GENRE>", "<DESC>"] + list(set(tokens))

#vocab.extend(book_titles)  # 제목을 vocab에 추가


word2idx = {w: i for i, w in enumerate(vocab)}
idx2word = {i: w for w, i in word2idx.items()}
vocab_size = len(vocab)



# 시퀀스 변환
def encode(sentence):
    words = sentence.split()  # transform_metadata는 이미 적용됨
    words = [word if word in word2idx else "<UNK>" for word in words]
    
    return [word2idx.get("<BOS>")] + [word2idx[w] for w in words] + [word2idx.get("<EOS>")]

# 변환된 book_sentences와 qna_sentences를 사용하여 인코딩 진행
encoded_data = [encode(s) for s in sentences]




BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dict_path  = os.path.join(BASE_DIR, "word2idx.pth")
model_path = os.path.join(BASE_DIR, "chatbot_model.pth")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")



# app/models/생성형_basic2_book.py


# … (데이터 로드, clean_text, extract_question_info 등 유틸 정의) …

# ─── 모델 정의 ───
class LSTMLanguageModel(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, dropout=0.3):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm  = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.fc    = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x):
        x = self.embed(x)
        out, _ = self.lstm(x)
        out = self.dropout(out)
        return self.fc(out)


# ─── 학습 함수 정의 ───
def train_and_save(
    sequences,
    word2idx,
    vocab_size,
    model_path,
    dict_path,
    batch_size=4,
    max_len=50,
    epochs=1000,
    device='cpu'
):
    # 시퀀스 → Dataset → DataLoader
    class TextDataset(Dataset):
        def __init__(self, seqs):
            self.seqs = [s[:max_len] for s in seqs]
        def __len__(self): return len(self.seqs)
        def __getitem__(self, i):
            s = self.seqs[i]
            x = torch.tensor(s[:-1], dtype=torch.long)
            y = torch.tensor(s[1:],  dtype=torch.long)
            return x, y

    def collate_fn(batch):
        xs, ys = zip(*batch)
        return (
            pad_sequence(xs, batch_first=True, padding_value=word2idx["<PAD>"]),
            pad_sequence(ys, batch_first=True, padding_value=word2idx["<PAD>"])
        )

    dataset   = TextDataset(sequences)
    dataloader= DataLoader(dataset, batch_size=batch_size,
                          shuffle=True, collate_fn=collate_fn)

    # 모델·옵티마이저·손실함수 준비
    model     = LSTMLanguageModel(vocab_size).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()

    # 학습 루프
    for epoch in range(1, epochs+1):
        model.train()
        total_loss = 0
        for x, y in dataloader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            logits = model(x)
            loss   = criterion(logits.view(-1, vocab_size),
                               y.view(-1))
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch}/{epochs} \tLoss: {total_loss:.4f}")

    # 학습 완료 후 저장
    torch.save(model.state_dict(), model_path)
    torch.save(word2idx, dict_path)
    print("✅ 모델과 단어사전 저장 완료")




if __name__ == "__main__":

    train_and_save(
        sequences   = encoded_data,  # 위에서 만든 encoded_data 리스트
        word2idx    = word2idx,
        vocab_size  = vocab_size,
        model_path  = model_path,
        dict_path   = dict_path,
        epochs      = 1000,
        device      = device
    )
    exit()




model = LSTMLanguageModel(vocab_size).to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()




def book_info_response(title=None, author=None, genre=None, info_type=None):
    info = search_book_info(title=title, author=author, genre=genre, info_type=info_type)
    if info:
        base = title or author or genre
        return f"『{base}』에 대한 {info_type} 정보는 다음과 같습니다: {info}"
    else:
        return "해당 책에 대한 정보를 찾을 수 없습니다."

    
def generate_with_lstm(question, max_len=50):


    prompt = f"질문: {question} 답변:"
    input_ids = [word2idx.get("<BOS>")] + [word2idx.get(w, word2idx["<UNK>"]) for w in prompt.split()]
    input_tensor = torch.tensor([input_ids], dtype=torch.long).to(device)

    generated = input_ids.copy()
    for _ in range(max_len):
        with torch.no_grad():
            output = model(input_tensor)
        logits = output[0, -1]

        logits[word2idx["<UNK>"]] = -float('inf')
        logits[word2idx["<PAD>"]] = -float('inf')

        probs = torch.softmax(logits, dim=-1)
        next_token = torch.multinomial(probs, num_samples=1).item()

        generated.append(next_token)

        if next_token == word2idx["<EOS>"]:
            break

        input_tensor = torch.tensor([generated], dtype=torch.long).to(device)

    response_tokens = generated[len(input_ids):generated.index(word2idx["<EOS>"])] \
        if word2idx["<EOS>"] in generated else generated[len(input_ids):]

    response = " ".join([idx2word.get(idx, "") for idx in response_tokens])
    return response.strip()

def answer_question(question):


    # 책 제목 및 요청 정보 추출 + 책 정보 존재 여부 확인
    title, author, genre, info_type, has_book_info = extract_question_info(question)

    if has_book_info:
        return book_info_response(title, author, genre, info_type)  #  책 정보 응답
    else:
        return generate_with_lstm(question)  #  일상 대화 응답


