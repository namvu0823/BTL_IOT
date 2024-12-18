UID là id thẻ từ

luồng tạo tài khoản: 
-   người dùng tạo tài khoản trên hệ thống gồm UID(thẻ từ) và password
    server gửi mesages Json tới esp32:
        {
        "header": "create new account",
        "UID": "a1b2c3d4e5f67890",
        "password": *******
        }
    esp32 sẽ nhận mesages và tạo vân tay, sau đó gửi lại:
        {
        "header": "response new account",
        "status":successfully
        "UID": "a1b2c3d4e5f67890",
        "finger_id": "90"
        }
luồng truy cập:
-   người dùng quét thẻ uid
    esp32 gứi message tới server:
        {
        "header": "Check_in request",
        "UID": "a1b2c3d4e5f67890"
        }
    server xử lý, gửi lại message:
        {
        "header": "Check_in response",
        "password": "123456",
        "fingerprint_id": "45"
        }
    esp32 xử lý, gửi lại mesage:
        {
        "header": "Check_in successfully"
        "UID": "a1b2c3d4e5f67890",
        "time": 1638483657
        }

