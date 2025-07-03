import os
import re
import difflib
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torch.nn.utils.rnn import pad_sequence
from torchvision import models
from sqlalchemy import create_engine
from PIL import Image

# ───────────────────────────────────────────────
# 🔧 환경 설정
# ───────────────────────────────────────────────
DATABASE_URL = "mysql+pymysql://root:1234@192.168.0.95:13306/db1"
engine = create_engine(DATABASE_URL)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dict_path = os.path.join(BASE_DIR, "word2idx.pth")
model_path = os.path.join(BASE_DIR, "query_classifier_model.pth")

# ───────────────────────────────────────────────
# 📊 데이터 전처리 유틸
# ───────────────────────────────────────────────
def clean_text(text):
    return re.sub(r"[^가-힣a-zA-Z0-9\s.,!?~]", "", str(text))

def remove_particles(sentence):
    particles = ["이", "가", "은", "는", "을", "를", "에", "에서",
                 "에게", "께", "도", "만", "과", "와", "로", "으로",
                 "부터", "까지", "의", "에게서"]
    for p in particles:
        sentence = re.sub(rf"\b{p}\b", "", sentence)
    return sentence.strip()

# ───────────────────────────────────────────────
# CSV(QnA)와 DB(책 정보)에서 학습 샘플 구성
# ───────────────────────────────────────────────
# CSV의 QnA 데이터 로드 (경로는 환경에 맞게 수정)
qa_csv_path = os.path.join(BASE_DIR, "data", "bookstore_chatbot_qa1_utf8.csv")
qa_df = pd.read_csv(qa_csv_path)

# DB의 책 정보를 로드 (책 제목을 쿼리로 사용)
def load_book_info():
    df = pd.read_sql("SELECT * FROM book_info", engine)
    df.rename(columns={
        "book_name_info": "타이틀",
        "writer_info": "작가",
        "book_detail_info": "내용",
        "publisher_info": "출판사",
        "price_info": "원본 가격",
        "genre_info": "카테고리",
        "book_img_info": "이미지 파일"
    }, inplace=True)
    return df

book_df = load_book_info()

# QnA 샘플: CSV의 '질문' 텍스트를 전처리한 후 사용 (클래스 0)
qna_samples = [remove_particles(clean_text(q)) for q in qa_df['질문'].tolist()]

# Book 샘플: DB의 책 정보에서 '타이틀' 또는 "제목"에 해당하는 텍스트 (클래스 1)
book_samples = [remove_particles(clean_text(title)) for title in book_df['타이틀'].tolist()]

# 각각의 샘플에 대해 라벨 지정
# QnA → 0 , Book → 1
all_samples = qna_samples + book_samples
labels = [0] * len(qna_samples) + [1] * len(book_samples)

# ───────────────────────────────────────────────
# 🔤 토크나이저 & 단어 사전 생성 (모든 입력 문장을 대상으로)
# ───────────────────────────────────────────────
def tokenize(sentence):
    return sentence.split()

def build_vocab(sentences):
    tokens = [word for s in sentences for word in tokenize(s)]
    base_vocab = ["<PAD>", "<BOS>", "<EOS>", "<UNK>"]
    vocab = base_vocab + list(set(tokens))
    word2idx = {w: i for i, w in enumerate(vocab)}
    idx2word = {i: w for w, i in word2idx.items()}
    return word2idx, idx2word, len(vocab)

word2idx, idx2word, vocab_size = build_vocab(all_samples)

def encode(sentence, word2idx):
    words = tokenize(sentence)
    words = [w if w in word2idx else "<UNK>" for w in words]
    return [word2idx["<BOS>"]] + [word2idx[w] for w in words] + [word2idx["<EOS>"]]

encoded_samples = [encode(s, word2idx) for s in all_samples]

# ───────────────────────────────────────────────
# 🧠 분류 모델 정의 (QueryClassifier)
# ───────────────────────────────────────────────
class QueryClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, num_classes=2):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, num_classes)
    
    def forward(self, x):
        x = self.embed(x)
        _, (h, _) = self.lstm(x)
        # h[-1] : 마지막 layer의 hidden state
        return self.fc(h[-1])

# ───────────────────────────────────────────────
# 🏋️‍♂️ 학습 데이터셋 및 DataLoader (분류용)
# ───────────────────────────────────────────────
class QueryDataset(Dataset):
    def __init__(self, sequences, labels):
        self.sequences = sequences
        self.labels = labels
    def __len__(self):
        return len(self.sequences)
    def __getitem__(self, index):
        return torch.tensor(self.sequences[index]), torch.tensor(self.labels[index])

def collate_fn(batch):
    xs, ys = zip(*batch)
    xs = pad_sequence(xs, batch_first=True, padding_value=word2idx["<PAD>"])
    ys = torch.stack(ys)
    return xs.to(device), ys.to(device)

dataset = QueryDataset(encoded_samples, labels)
dataloader = DataLoader(dataset, batch_size=16, shuffle=True, collate_fn=collate_fn)

# ───────────────────────────────────────────────
# 🏋️‍♂️ 분류 모델 학습 및 저장
# ───────────────────────────────────────────────
def train_and_save_classifier(model, dataloader, vocab_size, model_path, epochs=10, device='cpu'):
    model.to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()
    
    for epoch in range(1, epochs+1):
        model.train()
        total_loss = 0.0
        for x, y in dataloader:
            optimizer.zero_grad()
            logits = model(x)
            loss = criterion(logits, y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"[Epoch {epoch}] Loss: {total_loss:.4f}")
    
    torch.save(model.state_dict(), model_path)
    torch.save(word2idx, dict_path)
    print("✅ 분류 모델 및 단어 사전 저장 완료")

classifier_model = QueryClassifier(vocab_size)
train_and_save_classifier(classifier_model, dataloader, vocab_size, model_path, epochs=100, device=device)