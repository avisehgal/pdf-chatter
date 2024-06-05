# backend/main.py

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import fitz  # PyMuPDF

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

@app.post("/chat")
async def chat(file: UploadFile = File(...), query: str = ""):
    os.makedirs("C:\\temp", exist_ok=True)  # Ensure the directory exists
    file_path = os.path.join("C:\\temp", file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    
    # Simulate the response from LLaMA3
    response = f"Simulated response for query '{query}' on text '{text[:100]}'..."
    
    return {"response": response}
