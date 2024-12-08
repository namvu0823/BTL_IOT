ID là id người dùng trong database, uid là id thẻ từ

luồng tạo tài khoản: 
-   người dùng tạo tài khoản trên hệ thống gồm uid(thẻ từ) và password
    server gửi mesages Json tới esp32:
        {
        "action": "create new account",
        "uid": "a1b2c3d4e5f67890",
        "ID": 101
        }
    esp32 sẽ nhận mesages và tạo vân tay, sau đó gửi lại:
        {
        "response": "account_creation_success",
        "uid": "a1b2c3d4e5f67890",
        "fingerprint_id": "f67890"
        }
luồng truy cập:
-   người dùng quét thẻ uid
    esp32 gứi message tới server:
        {
        "action": "Yêu cầu truy cập",
        "uid": "a1b2c3d4e5f67890"
        }
    server xử lý, gửi lại message:
        {
        "response": "thông tin truy cập",
        "password": "123456",
        "fingerprint_id": "f12345"
        }
    esp32 xử lý, gửi lại mesage:
        {
        "ID": 1,
        "timestamp": 1638483657
        }

