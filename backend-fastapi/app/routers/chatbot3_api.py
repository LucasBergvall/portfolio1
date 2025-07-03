import os
import re
import difflib
import io
import subprocess
import pandas as pd
import torch
import whisper
from PIL import Image
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine
import difflib
import logging

# ───────────────────────────────────────────────
# 환경 설정 및 데이터 로드
# ───────────────────────────────────────────────
DATABASE_URL = "mysql+pymysql://id235:pw235@175.126.37.21:13306/db235"
engine = create_engine(DATABASE_URL)



logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


# 현재 파일이 app/routers 폴더에 있으므로 CSV는 models/data 폴더 내부에 있음.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
qa_csv_path = os.path.join(BASE_DIR, "..", "models", "data", "bookstore_chatbot_qa1_utf8.csv")
try:
    qa_df = pd.read_csv(qa_csv_path)
except Exception as e:
    raise Exception(f"CSV 파일 로드 실패: {str(e)}")

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

# ───────────────────────────────────────────────
# 유틸 함수
# ───────────────────────────────────────────────
def clean_text(text: str) -> str:
    """텍스트에서 불필요한 기호 제거"""
    return re.sub(r"[^가-힣a-zA-Z0-9\s.,!?~]", "", str(text))

def remove_particles(sentence: str) -> str:
    """한글 문장에서 조사를 제거하여 검색 정밀도 개선"""
    particles = ["이", "가", "은", "는", "을", "를", "에", "에서",
                 "에게", "께", "도", "만", "과", "와", "로", "으로",
                 "부터", "까지", "의", "에게서"]
    for p in particles:
        sentence = re.sub(rf"\b{p}\b", "", sentence)
    return sentence.strip()

def is_book_query(query: str) -> bool:
    """
    질문에 아래와 같은 단어가 포함되어 있으면 책 정보(DB) 조회로 판단합니다.
    """
    keywords = ["제목", "작가", "저자", "소설", "장르", "내용", "줄거리", "카테고리"]
    return any(k in query for k in keywords)




def find_qna_answer(query: str) -> str:
    """
    CSV의 '질문' 컬럼에 있는 모든 질문과의 유사도를 계산하여,
    가장 높은 유사도의 질문의 '답변'을 반환합니다.
    만약 최고 유사도 점수가 0.15 미만이면, 적절한 QnA 답변이 없다고 반환합니다.
    """
    questions = qa_df['질문'].tolist()
    query_lower = query.lower()
    
    best_match = None
    best_score = 0.0
    for q in questions:
        score = difflib.SequenceMatcher(None, query_lower, q.lower()).ratio()
        if score > best_score:
            best_score = score
            best_match = q

    print("DEBUG: Best QnA match =", best_match, "with score =", best_score)  # 디버그 출력, 필요 시 삭제

    if best_score < 0.15:
        return "적절한 QnA 답변을 찾지 못했습니다."
    else:
        # best_match가 None이 아닌 경우 (이 조건에 해당하므로 best_match는 존재)
        answer = qa_df.loc[qa_df['질문'].str.lower() == best_match.lower(), '답변'].iloc[0]
        return answer

def find_book_answer(query: str) -> str:
    """
    질문에 포함된 텍스트를 기준으로, DB의 책 정보를 조회합니다.
    입력 질문에 "작가"가 포함되어 있으면 책의 작가 정보를,
    "내용"이나 "줄거리"가 포함되어 있으면 책의 내용을 반환하도록 분기합니다.
    기본적으로는 책의 내용을 반환합니다.
    """
    # 먼저 모든 제목을 소문자로 변환하여 비교
    titles = [title.lower() for title in book_df['타이틀'].tolist()]
    query_lower = query.lower()
    title_matches = difflib.get_close_matches(query_lower, titles, n=1, cutoff=0.5)
    
    if title_matches:
        matched_title_lower = title_matches[0]
        # 실제 데이터를 찾을 때는 원래 대소문자를 그대로 사용
        row = book_df.loc[book_df['타이틀'].str.lower() == matched_title_lower]
        if not row.empty:
            row = row.iloc[0]
            # 기본은 책 내용을 반환
            field = "내용"
            info = row.get("내용", "등록된 내용이 없습니다")
            
            # 검색 쿼리에 "작가" 또는 "저자"라는 단어가 포함되어 있으면, 해당 필드로 전환
            if "작가" in query_lower or "저자" in query_lower:
                field = "작가"
                info = row.get("작가", "등록된 작가 정보가 없습니다")
            # "내용" 또는 "줄거리"가 포함된 경우 명시적으로 내용 사용
            elif "내용" in query_lower or "줄거리" in query_lower:
                field = "내용"
                info = row.get("내용", "등록된 내용이 없습니다")
            # "장르" 또는 "카테고리"가 포함된 경우
            elif "장르" in query_lower or "카테고리" in query_lower:
                field = "카테고리"
                info = row.get("카테고리", "등록된 장르 정보가 없습니다")
            
            return f"『{row.get('타이틀', matched_title_lower)}』의 {field}은(는) {info}입니다."
    
    return "해당 책 정보를 찾지 못했습니다."

# ───────────────────────────────────────────────
# Whisper 모델 로드 (음성 인식을 위함)
# ───────────────────────────────────────────────
whisper_model = whisper.load_model("base")

# ───────────────────────────────────────────────
# 이미지 유사도 및 OCR 관련 유틸
# ───────────────────────────────────────────────
from app.utils.image_utils import extract_text_from_image, find_similar_book_by_db_images

# ───────────────────────────────────────────────
# FastAPI Router 및 요청 모델
# ───────────────────────────────────────────────
router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

# ───────────────────────────────────────────────
# 텍스트 질문 엔드포인트 (보이스 입력도 텍스트와 동일 처리)
# ───────────────────────────────────────────────
# 127.0.0.1:8000/api3/chat    
# const body = {"question":"질문"}
@router.post("/chat")
def chat(request: QuestionRequest):
    raw_question = request.question
    query = remove_particles(clean_text(raw_question))
    print("DEBUG: 원본 질문 =", raw_question)
    print("DEBUG: 전처리된 질문 =", query)

    if is_book_query(query):
        answer = find_book_answer(query)
        print("DEBUG: 책 조회 모드 - answer =", answer)
    else:
        answer = find_qna_answer(query)
        print("DEBUG: QnA 조회 모드 - answer =", answer)

    return {"question": query, "answer": answer}

# ───────────────────────────────────────────────
# 보이스 질문 엔드포인트
# ───────────────────────────────────────────────
# 127.0.0.1:8000/api3/voice-chat
@router.post("/voice-chat")
async def voice_chat(file: UploadFile = File(...)):
    """
    업로드된 음성 파일의 앞 5초를 추출 후, Whisper로 텍스트 변환하여,  
    질문 유형에 따라 CSV(QnA) 또는 DB(Book)에서 답변을 반환합니다.
    """
    original_temp_path = f"temp_original_{file.filename}"
    trimmed_temp_path = f"temp_trimmed_{file.filename}"
    try:
        with open(original_temp_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"음성 파일 저장 중 오류: {str(e)}")
    try:
        subprocess.run(
            ["ffmpeg", "-i", original_temp_path, "-t", "5", "-y", trimmed_temp_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.STDOUT
        )
    except subprocess.CalledProcessError:
        if os.path.exists(original_temp_path):
            os.remove(original_temp_path)
        raise HTTPException(status_code=500, detail="ffmpeg로 음성 자르기 실패")
    try:
        transcribe_result = whisper_model.transcribe(trimmed_temp_path)
        transcribed_text = transcribe_result.get("text", "")
        query = remove_particles(clean_text(transcribed_text))
        if is_book_query(query):
            answer = find_book_answer(query)
        else:
            answer = find_qna_answer(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"음성 처리 중 오류 발생: {str(e)}")
    finally:
        if os.path.exists(original_temp_path):
            os.remove(original_temp_path)
        if os.path.exists(trimmed_temp_path):
            os.remove(trimmed_temp_path)
    return {"transcribed_text": transcribed_text, "answer": answer}

# ───────────────────────────────────────────────
# 이미지 질문 엔드포인트 (무조건 Book Query)
# ───────────────────────────────────────────────
# 127.0.0.1:8000/api3/image-search
# const 
@router.post("/image-search")
async def image_search(image: UploadFile = File(...)):
    """
    업로드된 이미지에서 먼저 이미지 유사도 분석을 수행하여 책 정보를 조회합니다.
    유사도 분석 결과가 없으면, OCR을 통해 텍스트를 추출한 후 책 정보를 조회합니다.
    """
    try:
        img_bytes = await image.read()
        logger.debug("이미지 파일 %s (%d bytes) 읽음", image.filename, len(img_bytes))
        uploaded_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        logger.exception("이미지 파일 열기 실패")
        raise HTTPException(status_code=400, detail="유효한 이미지 파일이 아닙니다.")
    
    # 우선, 이미지 유사도 분석을 시도합니다.
    logger.debug("이미지 유사도 분석 시도...")
    matched_book = find_similar_book_by_db_images(uploaded_img, book_df)
    query = ""
    if matched_book:
        if isinstance(matched_book, dict):
            query = matched_book.get("타이틀", "")
            logger.debug("유사도 분석 결과 (dict): %s", query)
        elif hasattr(matched_book, "__dict__"):
            query = matched_book.__dict__.get("타이틀", "")
            logger.debug("유사도 분석 결과 (__dict__): %s", query)
    else:
        logger.debug("유사도 분석 결과가 없습니다.")
    
    # 이미지 유사도 분석 결과가 없으면 OCR을 통한 텍스트 추출을 수행합니다.
    if not query:
        logger.debug("OCR을 통한 텍스트 추출 시도...")
        ocr_text = extract_text_from_image(uploaded_img)
        if ocr_text:
            logger.debug("OCR 결과: %s", ocr_text)
        else:
            logger.debug("OCR 결과가 없습니다.")
        query = remove_particles(clean_text(ocr_text)) if ocr_text else ""
    
    logger.debug("최종 검색 쿼리: %s", query)
    answer = find_book_answer(query)
    logger.debug("책 조회 결과: %s", answer)
    
    return {"extracted_text": query, "answer": answer}
