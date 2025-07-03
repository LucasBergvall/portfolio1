import matplotlib.pyplot as plt

import torch
import os

import torch.nn as nn

from torch.utils.data import Dataset, DataLoader
from torch.nn.utils.rnn import pad_sequence

from 생성형_basic2_book import encoded_data, extract_question_info, book_info_response, generate_with_lstm


BASE_DIR = r"C:\HTMLHak\proj2\p2react\backend\fastapi\app\models"


word2idx = torch.load(os.path.join(BASE_DIR, "word2idx.pth"))
idx2word = {i: w for w, i in word2idx.items()}



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
        logits = self.fc(out)
        return logits

vocab_size = len(word2idx)  # 사전 크기
model = LSTMLanguageModel(vocab_size)
model.load_state_dict(torch.load(os.path.join(BASE_DIR, "chatbot_model.pth")))
model.eval()


class TextDataset(Dataset):
    def __init__(self, sequences, max_len=50):
        self.sequences = [s[:max_len] for s in sequences]

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        seq = self.sequences[idx]
        x = torch.tensor(seq[:-1], dtype=torch.long)
        y = torch.tensor(seq[1:], dtype=torch.long)
        return x, y

def collate_fn(batch):
    xs, ys = zip(*batch)
    xs = pad_sequence(xs, batch_first=True, padding_value=word2idx["<PAD>"])
    ys = pad_sequence(ys, batch_first=True, padding_value=word2idx["<PAD>"])
    return xs, ys

dataset = TextDataset(encoded_data)  # encoded_data: 인코딩된 문장 리스트
dataloader = DataLoader(dataset, batch_size=4, shuffle=True, collate_fn=collate_fn)



criterion = nn.CrossEntropyLoss()

def evaluate_model(model, dataloader, criterion, device='cpu'):
    model.eval()
    model.to(device)
    total_loss = 0
    total_tokens = 0

    with torch.no_grad():
        for x, y in dataloader:
            x, y = x.to(device), y.to(device)
            output = model(x)
            loss = criterion(output.view(-1, output.size(-1)), y.view(-1))
            total_loss += loss.item() * (y != word2idx["<PAD>"]).sum().item()
            total_tokens += (y != word2idx["<PAD>"]).sum().item()

    avg_loss = total_loss / total_tokens
    perplexity = torch.exp(torch.tensor(avg_loss))
    
    print(f"평균 Loss: {avg_loss:.4f}")
    print(f"Perplexity: {perplexity:.4f}")

    return avg_loss, perplexity.item()

# answer_question 함수는 extract_question_info, book_info_response, generate_with_lstm를 내부적으로 사용

def answer_question(model, question, max_len=50, device='cpu'):
    model.eval()
    model.to(device)

    title, author, genre, info_type, has_book_info = extract_question_info(question)

    if has_book_info:
        return book_info_response(title, author, genre, info_type)
    else:
        return generate_with_lstm(question)

def test_generation(model, questions, device='cpu'):
    model.eval()
    model.to(device)
    for q in questions:
        print(f"질문: {q}")
        answer = answer_question(model, q, device=device)
        print(f"답변: {answer}")
        print("-" * 40)



def evaluate_model_with_logging(model, dataloader, criterion, device='cpu'):
    model.eval()
    model.to(device)
    total_loss = 0
    total_tokens = 0
    losses = []  # 배치별 loss 기록용

    with torch.no_grad():
        for x, y in dataloader:
            x, y = x.to(device), y.to(device)
            output = model(x)
            loss = criterion(output.view(-1, output.size(-1)), y.view(-1))
            
            # 배치 내 패딩 아닌 토큰 개수
            n_tokens = (y != word2idx["<PAD>"]).sum().item()
            
            total_loss += loss.item() * n_tokens
            total_tokens += n_tokens
            
            losses.append(loss.item())

    avg_loss = total_loss / total_tokens
    perplexity = torch.exp(torch.tensor(avg_loss))

    print(f"평균 Loss: {avg_loss:.4f}")
    print(f"Perplexity: {perplexity:.4f}")

    # 그래프 그리기
    plt.plot(losses, label="Batch Loss")
    plt.xlabel("Batch")
    plt.ylabel("Loss")
    plt.title("Evaluation Batch Loss")
    plt.legend()
    plt.show()

    return avg_loss, perplexity.item()