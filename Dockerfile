# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Set environment variable
ENV PORT=8000

# Run the application
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
