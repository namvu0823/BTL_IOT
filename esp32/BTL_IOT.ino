#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <SPI.h>
#include <Adafruit_PN532.h>
#include <Wire.h>
#include <Keypad.h>
#include <Adafruit_Fingerprint.h>
#include <LiquidCrystal_I2C.h>


// WiFi
const char* ssid = "Your_SSID";         // Tên WiFi
const char* password = "Your_PASSWORD"; // Mật khẩu WiFi

// WebSocket 
const char* websockets_server_host = "192.168.1.100"; // Địa chỉ IP server Flask
const uint16_t websockets_server_port = 3000;         // Cổng server Flask

// LCD 
LiquidCrystal_I2C lcd(0x27, 16, 2);

// RFID 
#define RC_SDA  5
Adafruit_PN532 nfc(RC_SDA);

// Fingerprint 
#define AS_TXD  16
#define AS_RXD  17
HardwareSerial FP(1);

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&FP);

// Keypad 
#define R1 25
#define R2 26
#define R3 27
#define R4 14
#define C1 12
#define C2 13
#define C3 32
#define C4 33

#define LED 15

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte pin_rows[4] = {R1, R2, R3, R4};
byte pin_column[4] = {C1, C2, C3, C4};
Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, 4, 4);
WebSocketsClient client;

void initWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

String id_vantay_nhan;
String nhan_mk="";
String uid;

// WebSocket xử lý sự kiện
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      client.sendTXT("ESP32 Connected");
      break;
    case WStype_TEXT:
      String message=String((char*)payload);
      Serial.print("Nhận thông tin nguời dùng");

      DynamicJsonDocument doc(512); // Tạo đối tượng JSONDocument
      DeserializationError error = deserializeJson(doc, message);

      if (error) {
        Serial.println("không nhận được Json: " + String(error.c_str()));
        return;
      }

      // Kiểm tra và lấy thông tin từ JSON
      if(doc.containsKey("response")&&doc["response"]== "thông tin truy cập"){
        if (doc.containsKey("password")) {
          nhan_mk = doc["password"].as<String>();
        }
        if (doc.containsKey("fingerprint_id")) {
          id_vantay_nhan = doc["fingerprint_id"].as<String>();
        }
        // Kiểm tra mật khẩu
        xt_matkhau();
      }
      //mesage yêu cầu tạo tài khoản
      if(doc.containsKey("action")&&doc["action"]== "create new account"){
        if(doc.containsKey("uid")){
          String uid =doc["uid"].as<String>();
        }
        if(doc.containsKey("ID")){
          uint16_t ID =doc["ID"].as<uint16_t>();
          taotaikhoan(uid,ID);
        }
      }
      break;

  }
}

void taotaikhoan(String uid, uint16_t ID){
  lcd.clear();
  lcd.print("Quet the RFID");
  String scanned_uid = "";

   // Yêu cầu người dùng quét thẻ RFID
  while (scanned_uid != uid) {
    scanned_uid = readRFIDOnce();
    if (scanned_uid == "") {
      lcd.setCursor(0, 1);
      lcd.print("thẻ sai");
    } else if (scanned_uid == uid) {
      lcd.setCursor(0, 1);
      lcd.print("thẻ đúng!");
      delay(1000);
    }
  }

  // Yêu cầu người dùng tạo vân tay mới
  lcd.clear();
  lcd.print("Tao van tay");
  uint16_t id_vantay = createNewFingerprint(ID);

  if (id_vantay != 0) {
    lcd.clear();
    lcd.print("Hoan thanh");

    // Gửi dữ liệu UID và id vân tay về server
    DynamicJsonDocument doc(256);
    doc["action"] = "new_account";
    doc["uid"] = uid;
    doc["fingerprint_id"] = id_vantay;

    String payload;
    serializeJson(doc, payload);
    client.sendTXT(payload);

  } 
  else {
    lcd.clear();
    lcd.print("Tạo thất bại");
  }
}


void initFingerprint() {
  FP.begin(57600);
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("cảm biến vân tay khởi động thành công ");
  } else {
    Serial.println("cảm biến vân tay không khởi động");
  }
}

uint16_t createNewFingerprint(uint16_t ID) {
  Serial.println("Place your finger on the sensor");
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) return 0;

  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) return 0;

  delay(2000);
  Serial.println("Place the same finger again");
  result = finger.getImage();
  if (result != FINGERPRINT_OK) return 0;

  result = finger.image2Tz(1);
  if (result != FINGERPRINT_OK) return 0;

  result = finger.createModel();
  if (result != FINGERPRINT_OK) return 0;

  uint16_t finger_id = finger.storeModel(ID); // Lưu mẫu với ID
  return finger_id;  
}

// xác thực vân tay
void xt_vantay(String id_vantay_nhan ) {
  lcd.clear();
  lcd.print("Đặt ngón tay lên cảm biến");
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) {
    lcd.clear();
    lcd.println("Hãy đặt ngón tay lên cảm biến");
    return;
  }
  result = finger.image2Tz();

  result = finger.fingerSearch();//
  String result_id;

  if (result == FINGERPRINT_OK) {

    result_id=finger.fingerID;
    if(result_id==id_vantay_nhan){
      digitalWrite(LED, HIGH); // Bật LED
      delay(3000);
      digitalWrite(LED, LOW); 

      DynamicJsonDocument doc(256);
      doc["ID"] = 1; // id người dùng
      doc["timestamp"] = millis(); //  thời gian thực từ RTC/server

      String payload;
      serializeJson(doc, payload);
      client.sendTXT(payload);//gửi thông tin checkin của user
    }
    
    lcd.clear();
    lcd.print("Sai vân tay");
    delay(1000);
    return;
  } else {
    lcd.clear();
    lcd.print("Không tìm thấy vân tay");
    delay(2000);
    return;
  }
}

// RFID Setup
void initRFID() {
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("RFID initialization failed");
    while (1);
  }
  nfc.SAMConfig();
  Serial.println("RFID initialized");
}

// Đọc RFID để mở cửa
void readRFID() {
  uint8_t success;
  uint8_t uid[7] = {0}; // Buffer to store UID
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  if (success) {
    String card_uid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      card_uid += String(uid[i], HEX);
    }
    // Gửi UID tới server
    DynamicJsonDocument doc(256);
    
    doc["action"]="Yêu cầu truy cập";
    doc["uid"] = card_uid;

    String payload;
    serializeJson(doc, payload);
    client.sendTXT(payload);//gửi uid tới server
    delay(2000); 

    
  }
}

//đọc RFID cho luồng tạo tài khoản
String readRFIDOnce() {
  uint8_t success;
  uint8_t uid[7] = {0};
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  if (success) {
    String card_uid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      card_uid += String(uid[i], HEX);
    }
    return card_uid;
  }
  return "";
}


void xt_matkhau(){
  Serial.println("Nhập mật khẩu: ");
  String enter_pass = "";
  // Nhập mật khẩu từ bàn phím
  while (true) {
    char key = keypad.getKey();
    if (key) {
      if (key == '#') break; // Nhấn # để xác nhận
      enter_pass += String(key);
      lcd.setCursor(0, 1);
      lcd.print(enter_pass);
    }
  }

  if (enter_pass == nhan_mk) {
    lcd.clear();
    lcd.print("Mật khẩu đúng");
    delay(1000);
    xt_vantay(id_vantay_nhan); // Chuyển sang xác thực vân tay
  } else {
    
    lcd.clear();
    lcd.print("Sai mật khẩu");
    delay(2000);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW); // Đèn tắt ban đầu

  lcd.begin(16,2);
  lcd.print("Initializing...");
  
  initWiFi();
  FP.begin(57600, SERIAL_8N1, AS_RXD, AS_TXD);
  initFingerprint();
  initRFID();

  client.begin(websockets_server_host, websockets_server_port, "/");
  client.onEvent(webSocketEvent);
  lcd.clear();
  lcd.print("Ready");
}

void loop() {
  client.loop();
  readRFID();
}