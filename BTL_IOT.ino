#include <WebSocketsClient.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#include <Wire.h>
#include <Keypad.h>

#include <Adafruit_Fingerprint.h>

#include <LiquidCrystal_I2C.h>

//RFID 
#define RC_SDA  5
#define RC_SCK	 18
#define RC_MOSI	 23
#define RC_MISO	 19
#define RC_RST	 4
//keypad
#define R1	 25
#define R2	 26
#define R3   27
#define	R4	 14
#define C1	 12
#define C2	 13
#define C3	 32
#define C4	 33
//AS608
#define AS_TXD	 16
#define AS_RXD	 17
//LCD
#define I2C_SDA	 21
#define I2C_SCL	 22
#define LED 15

const char* websockets_server_host = ""; // Địa chỉ IP server
const uint16_t websockets_server_port = 3000; // Cổng server

const char* ssid     = ""; // CHANGE HERE
const char* password = ""; // CHANGE HERE
LiquidCrystal_I2C lcd(0x27,16,2);
HardwareSerial FP(AS_RXD,AS_TXD);
Adafruit_Fingerprint finger=Adafruit_Fingerprint(&FP);//FINGERPRINT
WebSocketsClient client;
Adafruit_PN532 nfc(RC_SDA);//RFID
uint8_t id;

char  keys[4][4]={
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte pin_rows[4]={R1,R2,R3,R4};
byte pin_column[4]={C1,C2,C3,C4};
Keypad keypad =Keypad(makeKeymap(keys),pin_rows, pin_column, 4, 4);

esp_err_t init_wifi() {
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    client.onMessage(onMessageCallback);
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
    if (!connected) {
        Serial.println("WebSocket connection failed");
        return ESP_FAIL;
    }
    Serial.println("WebSocket connected");
    client.send("ESP32");
    return ESP_OK;
}

//giao tiếp server
void onMessageCallback(WebsocketsMessage message) {
    String msg = message.data();
    if (msg.startsWith("{")) {
        // Đây là JSON, parse command
        // 
    }
}

//xử lý websocket
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      client.sendTXT("ESP32");
      break;
    case WStype_TEXT:
      onMessageCallback(WebsocketsMessage(String((char*)payload)));
      break;
  }
}

//khởi động cảm biến vân tay
void initFinger(){

  FP.begin(57600);
  if (finger.begin()) {
    Serial.println("Cảm biến vân tay đã được khởi tạo thành công!");
  } else {
    Serial.println("Không thể khởi tạo cảm biến vân tay. Kiểm tra kết nối.");
  }
  uint8_t version = finger.getVersion();
  if (version == FINGERPRINT_OK) {
    Serial.print("Phiên bản cảm biến: ");
    Serial.println(version);
  } else {
    Serial.print("Lỗi khi lấy phiên bản: ");
    Serial.println(version);
  }
}

void createFingerprint() {
  Serial.println("Đặt ngón tay lên cảm biến");
  
  // Đọc hình ảnh vân tay
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) {
    Serial.print("Lỗi khi đọc vân tay: ");
    Serial.println(result);
    return;
  }

  // Chuyển đổi hình ảnh thành dữ liệu vân tay
  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) {
    Serial.print("Không thể tạo dữ liệu vân tay: ");
    Serial.println(result);
    return;
  }

  Serial.println("Bỏ tay khỏi cảm biến...");
  delay(2000); 

  Serial.println("Đặt lại ngón tay lên cảm biến...");
  
  // Đọc hình ảnh vân tay lần thứ hai
  result = finger.getImage();
  if (result != FINGERPRINT_OK) {
    Serial.print("Lỗi khi đọc vân tay: ");
    Serial.println(result);
    return;
  }

  // Chuyển đổi hình ảnh lần thứ hai thành dữ liệu vân tay
  result = finger.image2Tz(1);
  if (result != FINGERPRINT_OK) {
    Serial.print("Không thể tạo dữ liệu vân tay: ");
    Serial.println(result);
    return;
  }

  // Tạo mô hình vân tay
  result = finger.createModel();
  if (result != FINGERPRINT_OK) {
    Serial.print("Failed to create model: ");
    Serial.println(result);
    return;
  }

  //  Lưu mô hình vân tay vào bộ nhớ
  result = finger.storeModel(id); // id vân tay
  if (result != FINGERPRINT_OK) {
    Serial.print("Failed to store model: ");
    Serial.println(result);
    return;
  }
  Serial.println("Tạo thành công vân tay");
}

void verifyFingerprint() {
  Serial.println("Đạt ngón tay lên cảm biến...");

  //Đọc hình ảnh vân tay
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) {
    Serial.print("Không thể đọc vân tay: ");
    Serial.println(result);
    return;
  }

  //Chuyển đổi hình ảnh thành dữ liệu vân tay
  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) {
    Serial.print("Lỗi khi tạo dữ liệu vân tay: ");
    Serial.println(result);
    return;
  }

  //Tìm kiếm vân tay trong bộ nhớ
  result = finger.fingerSearch();
  if (result == FINGERPRINT_OK) {
    Serial.println("vân tay khớp!");
    Serial.print("ID: ");
    Serial.println(finger.fingerID); // 
  } else if (result == FINGERPRINT_NOTFOUND) {
    Serial.println("Không tìm thấy vân tay!");
  } else {
    Serial.print("Lỗi khi tìm vân tay: ");
    Serial.println(result);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Booting...");

  if (init_wifi() != ESP_OK) {
      Serial.println("WiFi initialization failed!");
  }
  initFinger();// Khởi tạo finger
  nfc.begin(); // Khởi tạo RFID
}

void loop() {
  client.poll();//giữ kết nối socket
  char key = keypad.getKey();//lấy ký tự từ bàn phím
  if (key) {
    Serial.println(key);
  }
if (nfc.inListPassiveTarget()) { // Kiểm tra xem có thẻ nào không
    // Đọc thông tin thẻ
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 }; // UID của thẻ
    uint8_t uidLength; // Chiều dài UID

    // Đọc UID từ thẻ
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
    if (success) {
        Serial.print("UID: ");
        for (uint8_t i=0; i < uidLength; i++) {
          Serial.print(uid[i], HEX);
          if (i < uidLength - 1) {
              Serial.print(":");
          }
        }
        Serial.println();

        // Xử lý và lưu dữ liệu thẻ
        String tag_id = "";
        for (uint8_t i = 0; i < uidLength; i++) {
            tag_id += String(uid[i], HEX);
        }
        // Lưu thời gian hiện tại
        String timestamp = String(millis()); // Hoặc sử dụng thời gian thực
      
    }
  }
}
