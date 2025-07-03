import os
import torch
import whisper
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, CLIPProcessor, CLIPModel
from app.models.생성형_basic2_book import LSTMLanguageModel

# 디바이스 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === 경로 설정 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
word2idx_path = os.path.join(BASE_DIR, "word2idx.pth")
lstm_model_path = os.path.join(BASE_DIR, "chatbot_model.pth")

# === word2idx 및 idx2word ===
word2idx = torch.load(word2idx_path)
idx2word = {i: w for w, i in word2idx.items()}
vocab_size = len(word2idx)

# === LSTM 모델 로드 ===
def load_lstm_model():
    model = LSTMLanguageModel(vocab_size)
    model.load_state_dict(torch.load(lstm_model_path, map_location=device))
    model.eval()
    model.to(device)
    return model

# === Whisper 모델 로드 ===
def load_whisper_model():
    return whisper.load_model("base")

# === TrOCR 모델 및 프로세서 로드 ===
# def load_trocr():
#     processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-stage1")
#     model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-stage1").to(device)
#     return processor, model

# === CLIP 모델 및 프로세서 로드 ===
def load_clip():
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
    return processor, model
