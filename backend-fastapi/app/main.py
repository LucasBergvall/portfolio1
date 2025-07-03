from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chatbot3_api  # chatbot_api.py를 import

app = FastAPI()

# ✅ 🔹 CORS 설정 (React에서 API 호출 가능하게)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React가 실행되는 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 🔹 FastAPI 챗봇 API 등록
app.include_router(chatbot3_api.router, prefix="/api3")

@app.get("/")
def read_root():
    return {"message": "FastAPI 챗봇 서버 실행 중!"}