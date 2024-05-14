# backend/Dockerfile

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./main.py /app/main.py
COPY ./requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
