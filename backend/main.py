# backend/main.py

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import fitz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

@app.post("/chat")
async def chat(file: UploadFile = File(...), query: str = ""):
    with open(f"/tmp/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = extract_text_from_pdf(f"/tmp/{file.filename}")
    
    # Here, you would integrate with LLaMA3
    response = f"Simulated response for query '{query}' on text '{text[:100]}'..."
    
    return {"response": response}
