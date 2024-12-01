# IoT Unlock Management System

## Cấu trúc dự án

- `backend/`: Flask backend để lưu trữ và xử lý dữ liệu
- `esp32/`: Code ESP32 để giao tiếp cảm biến vân tay và RFID
- `frontend/`: Giao diện người dùng quản lý

## Cách chạy dự án

1. **Khởi động backend**:
   ```bash
   cd backend
   python -m venv env
   source env/bin/activate  # Trên Linux/MacOS
   env\Scripts\activate     # Trên Windows
   pip install -r requirements.txt
   python app.py
