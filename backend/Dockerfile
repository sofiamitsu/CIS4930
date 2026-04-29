FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8003
CMD ["python3", "-c", "import uvicorn; import sys; sys.path.insert(0, '.'); from main import app; uvicorn.run(app, host='0.0.0.0', port=8003)"]
