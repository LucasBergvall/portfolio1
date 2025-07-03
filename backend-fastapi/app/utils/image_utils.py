from PIL import Image
import torch
from torchvision import transforms
import os
import logging
from io import BytesIO
from app.models.data.mysql import get_connection
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, CLIPProcessor, CLIPModel

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

trocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-stage1")
trocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-stage1").to(device)

clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)


def extract_text_from_image(image):
    try:
        pixel_values = trocr_processor(images=image, return_tensors="pt").pixel_values.to(device)
        generated_ids = trocr_model.generate(pixel_values)
        return trocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
    except Exception as e:
        logging.error(f"OCR failed: {e}")
        return ""


def compute_clip_embedding(image):
    inputs = clip_processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        image_features = clip_model.get_image_features(**inputs)
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
    return image_features


def find_similar_book(uploaded_image, books, image_base_path):
    uploaded_emb = compute_clip_embedding(uploaded_image)

    best_score = -1
    best_match = None
    for book in books:
        try:
            img_path = os.path.join(image_base_path, book["이미지 파일"])
            if not os.path.exists(img_path):
                logging.warning(f"Image path not found: {img_path}")
                continue

            book_image = Image.open(img_path).convert("RGB")
            book_emb = compute_clip_embedding(book_image)

            score = torch.cosine_similarity(uploaded_emb, book_emb).item()
            if score > best_score:
                best_score = score
                best_match = book
        except Exception as e:
            logging.error(f"Error processing image {book.get('이미지 파일')}: {e}")
            continue
    return best_match


def find_similar_book_by_db_images(uploaded_image, db_images):
    uploaded_emb = compute_clip_embedding(uploaded_image)
    best_score = -1
    best_match = None

    # DataFrame의 각 행을 순회 (순회 시, row는 Series 형태)
    for idx, row in db_images.iterrows():
        # Series를 딕셔너리로 변환
        img_info = row.to_dict()
        try:
            # Key 수정: 'book_img_info' → '이미지 파일'
            img_data = img_info['이미지 파일']
            book_image = Image.open(BytesIO(img_data)).convert("RGB")
            
            book_emb = compute_clip_embedding(book_image)
            score = torch.cosine_similarity(uploaded_emb, book_emb).item()

            if score > best_score:
                best_score = score
                best_match = {
                    "타이틀": img_info["타이틀"],
                    "이미지": book_image
                }
        except Exception as e:
            book_name = img_info.get("타이틀", "미상")
            logging.error(f"Error processing DB image for book: {book_name}, error: {e}")
            continue

    return best_match




def get_all_book_images():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # book_info에서 이미지와 제목을 조회
    cursor.execute("SELECT book_name_info, book_img_info FROM book_info")
    results = cursor.fetchall()

    cursor.close()
    conn.close()
    return results
