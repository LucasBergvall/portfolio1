from transformers import TrOCRProcessor, VisionEncoderDecoderModel, CLIPProcessor, CLIPModel
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load TrOCR
trocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-stage1")
trocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-stage1").to(device)

# Load CLIP
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
