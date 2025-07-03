import os
import re
import io
import difflib
import torch
import torch.nn as nn
import pandas as pd
import whisper
from PIL import Image
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from app.models.data.mysql import get_all_item_images, search_book

from app.utils.image_utils import extract_text_from_image, find_similar_book, find_similar_book_by_db_images


# DB 함수 임포트
from app.models.data.mysql import get_all_titles, get_all_authors, get_all_genres, search_book
# model_loader에서 필요한 것들 import
import os
import torch
import whisper
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, CLIPProcessor, CLIPModel
from app.models.생성형_basic2_book import LSTMLanguageModel

# 디바이스 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === 경로 설정 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
word2idx_path = os.path.join(BASE_DIR, "../models/word2idx.pth")  
lstm_model_path = os.path.join(BASE_DIR, "../models/chatbot_model.pth")

# === word2idx 및 idx2word 직접 로드 ===
word2idx = torch.load(word2idx_path)
idx2word = {i: w for w, i in word2idx.items()}
vocab_size = len(word2idx)

# === LSTM 모델 직접 로드 ===
def load_lstm_model():
    model = LSTMLanguageModel(vocab_size)
    model.load_state_dict(torch.load(lstm_model_path, map_location=device))
    model.eval()
    model.to(device)
    return model

# === Whisper 모델 직접 로드 ===
def load_whisper_model():
    return whisper.load_model("base")


router = APIRouter()

# 조사 제거 함수
def remove_particles(sentence):
    particles = ["이", "가", "은", "는", "을", "를", "에", "에서", "에게", "께", "도", "만", "과", "와", "로", "으로", "부터", "까지", "의", "에게서"]
    for p in particles:
        sentence = re.sub(rf"\b{p}\b", "", sentence)
    return sentence.strip()

# 경로 설정 및 단어 사전 로드
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# 모델 초기화 (API 시작 시 한 번만)
model = load_lstm_model()
whisper_model = load_whisper_model()
model.eval()

# 책 질문에서 제목/작가/장르, 요청정보 추출
def extract_question_info(question):
    title, author, genre, requested_info = None, None, None, None

    titles = get_all_titles()
    title_matches = difflib.get_close_matches(question, titles, n=1, cutoff=0.7)
    if title_matches:
        title = title_matches[0]

    authors = get_all_authors()
    author_matches = difflib.get_close_matches(question, authors, n=1, cutoff=0.8)
    if author_matches:
        author = author_matches[0]

    genres = get_all_genres()
    genre_matches = difflib.get_close_matches(question, genres, n=1, cutoff=0.9)
    if genre_matches:
        genre = genre_matches[0]

    if any(k in question for k in ["작가", "저자"]):
        requested_info = "author"
    elif any(k in question for k in ["카테고리", "장르"]):
        requested_info = "genre"
    elif any(k in question for k in ["설명", "내용", "줄거리"]):
        requested_info = "content"
    else:
        requested_info = None

    has_book_info = any([title, author, genre])
    return title, author, genre, requested_info, has_book_info

# 책 정보 검색
def search_book_info(title=None, author=None, genre=None, info_type=None):
    results = search_book(title=title, author=author, genre=genre)
    if not results:
        return None

    row = results[0]  # 첫 결과 사용

    if info_type == "author":
        return row.get('author', None)
    elif info_type == "genre":
        return row.get('genre', None)
    elif info_type == "content":
        return row.get('content', None)
    else:
        return row.get('title', None)

# LSTM 텍스트 생성 함수
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

    if word2idx["<EOS>"] in generated:
        end_idx = generated.index(word2idx["<EOS>"])
    else:
        end_idx = len(generated)

    response_tokens = generated[len(input_ids):end_idx]
    response = " ".join([idx2word.get(idx, "") for idx in response_tokens])
    return response.strip()

# 질문 응답 처리 함수
def answer_question(question):
    title, author, genre, info_type, has_book_info = extract_question_info(question)
    if has_book_info:
        info = search_book_info(title, author, genre, info_type)
        if info:
            base = title or author or genre
            # info_type 한글 변환 (간단히)
            info_type_map = {"author":"작가", "genre":"카테고리", "content":"내용"}
            info_kor = info_type_map.get(info_type, info_type)
            return f"『{base}』에 대한 {info_kor} 정보는 다음과 같습니다: {info}"
        else:
            return "해당 책에 대한 정보를 찾을 수 없습니다."
    else:
        return generate_with_lstm(question)

# FastAPI 요청 모델
class QuestionRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: QuestionRequest):
    clean_question = remove_particles(request.question)
    response = answer_question(clean_question)
    if not response.strip():
        response = "⚠️ 적절한 답변을 찾지 못했습니다."
    return {"question": clean_question, "response": response}

# 음성 인식 + 챗 기능
@router.post("/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    transcribed_text = whisper_model.transcribe(temp_path)["text"]
    clean_question = remove_particles(transcribed_text)
    response = answer_question(clean_question)

    os.remove(temp_path)
    return {"transcribed_text": transcribed_text, "response": response}



# 이미지 업로드 후 책 검색
@router.post("/image-search")
async def image_search(image: UploadFile = File(...)):
    uploaded_img = Image.open(io.BytesIO(await image.read())).convert("RGB")

    # 1) OCR 시도
    ocr_title = extract_text_from_image(uploaded_img)
    if ocr_title:
        results = search_book(title=ocr_title)
        if results:
            return {"method": "ocr", "match": True, "title": ocr_title, "book": results[0]}

    # 2) DB 이미지 불러오기
    db_images = get_all_item_images()

    # 3) 이미지 유사도 비교
    matched_book = find_similar_book_by_db_images(uploaded_img, db_images)

    if matched_book:
        return {"method": "clip", "match": True, "title": matched_book['book_name'], "book": matched_book}

    return {"match": False, "title": ocr_title}

#cd p2react\backend\fastapi
#uvicorn app.routers.chatbot2_api:router --reload --app-dir .