# backend/main.py

from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import fitz  # PyMuPDF
from transformers import pipeline

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

# Load the GPT-2 model using transformers pipeline
model_name = "gpt2"  # Using GPT-2 as an alternative
gpt2_pipeline = pipeline("text-generation", model=model_name)

@app.post("/chat")
async def chat(query: str = Form(...)):
    upload_dir = "C:\\temp"
    files = os.listdir(upload_dir)
    if not files:
        raise HTTPException(status_code=404, detail="No uploaded file found")
    
    # Assuming only one file is used for the session
    file_path = os.path.join(upload_dir, files[0])

    text = extract_text_from_pdf(file_path)
    
    # Generate response using GPT-2 model
    gpt2_response = gpt2_pipeline(query, max_length=100, num_return_sequences=1)[0]['generated_text']
    
    return {"response": gpt2_response}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    upload_dir = "C:\\temp"
    os.makedirs(upload_dir, exist_ok=True)  # Ensure the directory exists
    file_path = os.path.join(upload_dir, file.filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
