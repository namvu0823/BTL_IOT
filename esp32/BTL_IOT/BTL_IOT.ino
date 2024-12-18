#include <NTPClient.h>
#include <Key.h>
#include <Keypad.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
#include <MFRC522.h>
#include <MFRC522Extended.h>
#include <deprecated.h>
#include <require_cpp11.h>
#include <SPI.h>


#define AS_TXD 16
#define AS_RXD 17
#define SDA_PIN 21  
#define RST_PIN 22
#define R1 25
#define R2 26
#define R3 27
#define R4 14
#define C1 12
#define C2 13
#define C3 32
#define C4 33
#define LED 15

const char *ssid = "gianghomang";
const char *password = "07040904";
const char *websockets_server_host = "192.168.1.5";
const uint16_t websockets_server_port = 3001;

using namespace websockets;
WebsocketsClient client;

HardwareSerial mySerial(1); 
Adafruit_Fingerprint finger(&mySerial);
MFRC522 rfid(SDA_PIN, RST_PIN);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600, 60000); // GMT+7 (7*3600 giây)

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte pin_rows[4] = {R1, R2, R3, R4};
byte pin_column[4] = {C1, C2, C3, C4};
Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, 4, 4);

esp_err_t init_wifi()
{
  WiFi.begin(ssid, password);
  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20)
  {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("\nWiFi connection failed");
    return ESP_FAIL;
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  client.onMessage(onMessageCallback);
  bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
  if (!connected)
  {
    Serial.println("Kết nối WebSocket thất bại");
    return ESP_FAIL;
  }
  Serial.println("Kết nối WebSocket thành công");
  return ESP_OK;
}

void onMessageCallback(WebsocketsMessage mesage){
  Serial.println("Nhận message: " + mesage.data());
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, mesage.data());
  if (error) {
    Serial.print("JSON Parsing Failed: ");
    Serial.println(error.c_str());
    return;
  }

  String header = doc["header"];
  JsonObject payload = doc["payload"];

  if(header=="Create new account"){//tạo tài khoản 
    String uid=payload["UID"];
    String password=payload["password"];
    tao_tk(uid, password);

  }
  else if(header=="Check_in response"){//thông tin phiên xác thực check in
    String uid=payload["UID"];
    String password = payload["password"];
    int finger_id= payload["finger_id"];
    xacthuc(finger_id, password, uid );
  }
}

void tao_tk(String uid, String password){
  //kiểm tra mật khẩu
  String input_password=nhap_password();

  if(input_password != password){
    Serial.println("Sai mật khẩu, hãy nhập lại");
  }
  else{
    int result=enrollFingerprint();//tạo vân tay

    if(result<0){
      Serial.print("Tạo vân tay thất bại");
      StaticJsonDocument<200> jsonDoc;
      jsonDoc["header"]="response new account";
      jsonDoc["UID"]=uid;
      jsonDoc["status"]="failed";
      String msg;
      serializeJson(jsonDoc, msg);
      client.send(msg);
    }
    else{
      Serial.print("Tạo vân tay thành công");
      StaticJsonDocument<200> jsonDoc;
      jsonDoc["header"]="response new account";
      jsonDoc["UID"]=uid;
      jsonDoc["status"]="successfully";
      jsonDoc["finger_id"]=result;
      String msg;
      serializeJson(jsonDoc, msg);
      client.send(msg);
    }
  }
}


int enrollFingerprint() {
  // Tìm ID chưa sử dụng
  int id = findAvailableID();
  if (id == -1) {
    Serial.println("Không còn vị trí trống để lưu vân tay.");
    return -1;
  }
  Serial.print("Đang đăng ký vân tay với ID tự động: ");
  Serial.println(id);

  // Quá trình thu thập mẫu vân tay
  int p = -1;
  Serial.println("Đặt ngón tay lên cảm biến...");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      Serial.println("Lấy ảnh thành công.");
    } else if (p == FINGERPRINT_NOFINGER) {
      Serial.println("Chưa phát hiện ngón tay.");
    } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
      Serial.println("Lỗi giao tiếp.");
    } else if (p == FINGERPRINT_IMAGEFAIL) {
      Serial.println("Lỗi xử lý ảnh.");
    } else {
      Serial.println("Lỗi không xác định.");
    }
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.println("Không thể chuyển đổi ảnh sang mẫu.");
    return -1;
  }
  Serial.println("Nhấc ngón tay ra và đặt lại lần nữa...");
  delay(2000);

  // Lấy mẫu lần 2
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      Serial.println("Lấy ảnh lần 2 thành công.");
    } else if (p == FINGERPRINT_NOFINGER) {
      Serial.println("Chưa phát hiện ngón tay.");
    } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
      Serial.println("Lỗi giao tiếp.");
    } else if (p == FINGERPRINT_IMAGEFAIL) {
      Serial.println("Lỗi xử lý ảnh.");
    } else {
      Serial.println("Lỗi không xác định.");
    }
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    Serial.println("Không thể chuyển đổi ảnh sang mẫu.");
    return -1;
  }
  // Ghép mẫu
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Ghép mẫu thành công.");
  } else {
    Serial.println("Ghép mẫu thất bại.");
    return -1;
  }
  // Lưu mẫu
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Lưu mẫu thành công!");
    return id;
  } else {
    return -1;
  }
}

// Hàm tìm ID trống đầu tiên trong cơ sở dữ liệu
int findAvailableID() {
  for (int id = 0; id < 127; id++) { // ID từ 0 đến 127
    uint8_t p = finger.loadModel(id);
    if (p == FINGERPRINT_NOTFOUND) {
      return id; // ID trống
    }
  }
  return -1; // Không tìm thấy ID trống
}

bool isUnlocked = false;
void xacthuc(int finger_id, String password, String uid){
   if (kiemtra_vantay(finger_id)) { // Kiểm tra vân tay
    Serial.println("Mở khóa bằng vân tay thành công!");
    isUnlocked = true;
    delay(3000);
  } 
  else if (kiemtra_matkhau(password)) { // Kiểm tra mật khẩu
    Serial.println("Mở khóa bằng mật khẩu thành công!");
    isUnlocked = true;
    delay(3000);
  } else {
    Serial.println("Xác thực thất bại. Thử lại...");
  }
  
  if (isUnlocked) {

    Serial.println("HỆ THỐNG ĐÃ MỞ KHÓA!");
    digitalWrite(LED, HIGH);
    StaticJsonDocument<300> jsonDoc;
      jsonDoc["header"]="Check_in successfully";
      jsonDoc["UID"]=uid;
      jsonDoc["time"]=time();
      String msg;
      serializeJson(jsonDoc, msg);
      client.send(msg);
   

    delay(5000); //  mở khóa trong 5s
    isUnlocked = false;
    Serial.println("Khóa lại hệ thống...");
    digitalWrite(LED, LOW);
  }
}

bool kiemtra_matkhau(String password){
  String input_pass = nhap_password();
  if(password==input_pass) return true;
  else return false;
}
bool kiemtra_vantay(int finger_id){
  int result = getFingerprintID();
  if(result==finger_id) return true; 
  else return false;
}

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1; // Không lấy được hình ảnh

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1; // Không chuyển đổi được hình ảnh

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -1; // Không tìm thấy ID

  return finger.fingerID;
}

String nhap_password(){
  Serial.println("Nhập mật khẩu!");
  String inputBuffer = "";
  char key = keypad.getKey();

  if (key) { // Nếu có phím được nhấn
    if (key == '#') { // Kết thúc nhập khi nhấn '#'
      String result = inputBuffer; 
      inputBuffer = ""; // Xóa buffer để chuẩn bị lần nhập mới
      return result; 
    } else {
      inputBuffer += key; 
    }
  }
  return ""; 
}

String time(){
  timeClient.update(); // Cập nhật thời gian từ NTP
 
  time_t epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime((time_t *)&epochTime);

  int year = ptm->tm_year + 1900;
  int month = ptm->tm_mon + 1;
  int day = ptm->tm_mday;
  int hour = ptm->tm_hour;
  int minute = ptm->tm_min;
  int second = ptm->tm_sec;

  char formattedTime[30];
  sprintf(formattedTime, "%04d-%02d-%02d %02d:%02d:%02d", year, month, day, hour, minute, second);

  String timeString = String(formattedTime); 
  return timeString;
}
void setup() {

  Serial.begin(115200);
  if (init_wifi() != ESP_OK){
    Serial.println("Lỗi kết nối Wifi/WebSocket");
    return;
  }                             
  mySerial.begin(57600, SERIAL_8N1, AS_TXD, AS_RXD);      
  delay(100);
  finger.begin(57600);
  timeClient.begin();

  if (finger.verifyPassword()) {
    Serial.println("Kết nối cảm biến vân tay thành công!");
  } else {
    Serial.println("Không thể kết nối cảm biến vân tay");
    while (1);
  }  
  SPI.begin();                  
  rfid.PCD_Init();              
}

String storedUID = "";

void loop() {

  client.poll();
  storedUID = ""; // Xóa giá trị cũ

  for (byte i = 0; i < rfid.uid.size; i++) {
      if (rfid.uid.uidByte[i] < 0x10) {
          storedUID += "0"; // Thêm '0' nếu giá trị byte nhỏ hơn 0x10
      }
      storedUID += String(rfid.uid.uidByte[i], HEX); // Chuyển byte thành hex và nối vào chuỗi
  }

  Serial.print("UID: ");
  Serial.println(storedUID);
  StaticJsonDocument<200> jsonDoc;
    jsonDoc["header"]="Check_in request";
    jsonDoc["UID"]=storedUID;
    String msg;
    serializeJson(jsonDoc, msg);
    client.send(msg);
  rfid.PICC_HaltA();// Dừng giao tiếp với thẻ
  delay(1000);
}
