# Base image with Python
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy code
COPY . .

# Install system dependencies for Prophet
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpython3-dev \
    build-essential \
    libatlas-base-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python libraries
RUN pip install --no-cache-dir pandas prophet fastapi uvicorn pymongo python-multipart

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "forecast_runner:app", "--host", "0.0.0.0", "--port", "8000"]
