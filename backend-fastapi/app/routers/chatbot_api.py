import torch
import torch.nn as nn
import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
import difflib
import pandas as pd
router = APIRouter()

# ✅ 조사 제거 함수
def remove_particles(sentence):
    particles = ["이", "가", "은", "는", "을", "를", "에", "에서", "에게", "께", "도", "만", "과", "와", "로", "으로", "부터", "까지", "의", "에게서"]
    for p in particles:
        sentence = re.sub(rf"\b{p}\b", "", sentence)
    return sentence.strip()

book_df = pd.read_csv(r"C:\HTMLHak\proj2\p2react\backend\fastapi\app\models\data\bestseller_data_cleaned.csv")

# ✅ 경로 설정 및 단어 사전 로드
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
word2idx = torch.load(os.path.join(BASE_DIR, "../models/word2idx.pth"))
idx2word = {i: w for w, i in word2idx.items()}
vocab_size = len(word2idx)

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
# ✅ LSTM 모델 정의
class LSTMLanguageModel(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, dropout=0.3):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x):
        x = self.embed(x)
        out, _ = self.lstm(x)
        out = self.dropout(out)
        return self.fc(out)

# ✅ 모델 로드
model = LSTMLanguageModel(vocab_size)
model.load_state_dict(torch.load(os.path.join(BASE_DIR, "../models/chatbot_model.pth")))
model.eval()

def book_info_response(title=None, author=None, genre=None, info_type=None):
    info = search_book_info(title=title, author=author, genre=genre, info_type=info_type)
    if info:
        base = title or author or genre
        return f"『{base}』에 대한 {info_type} 정보는 다음과 같습니다: {info}"
    else:
        return "해당 책에 대한 정보를 찾을 수 없습니다."

    
def generate_with_lstm(question, max_len=50, device='cpu', min_len=3):
    model.eval()
    model.to(device)

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

def answer_question(model, question, max_len=50, device='cpu'):
    model.eval()
    model.to(device)

    # 책 제목 및 요청 정보 추출 + 책 정보 존재 여부 확인
    title, author, genre, info_type, has_book_info = extract_question_info(question)

    if has_book_info:
        return book_info_response(title, author, genre, info_type)  #  책 정보 응답
    else:
        return generate_with_lstm(question)  #  일상 대화 응답


# ✅ FastAPI 요청 모델
class QuestionRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: QuestionRequest):
    clean_question = remove_particles(request.question)

    title, author, genre, info_type, has_book_info = extract_question_info(clean_question)

    if has_book_info:
        response = book_info_response(title, author, genre, info_type)
    else:
        response = generate_with_lstm(clean_question)
        if not response.strip():
            response = "⚠️ 적절한 답변을 찾지 못했습니다."

    return {"question": clean_question, "response": response}