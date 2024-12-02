#include <WebSocketsClient.h>
#include <SPI.h>
#include <Adafruit_PN532.h>
#include <Wire.h>
#include <Keypad.h>
#include <Adafruit_Fingerprint.h>
#include <LiquidCrystal_I2C.h>

// WiFi Config
const char* ssid = "Your_SSID";         // Tên WiFi
const char* password = "Your_PASSWORD"; // Mật khẩu WiFi

// WebSocket Config
const char* websockets_server_host = "192.168.1.100"; // Địa chỉ IP server Flask
const uint16_t websockets_server_port = 3000;         // Cổng server Flask

// LCD Config
LiquidCrystal_I2C lcd(0x27, 16, 2);

// RFID Config
#define RC_SDA  5
Adafruit_PN532 nfc(RC_SDA);

// Fingerprint Config
#define AS_TXD  16
#define AS_RXD  17
HardwareSerial FP(AS_RXD, AS_TXD);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&FP);

// Keypad Config
#define R1 25
#define R2 26
#define R3 27
#define R4 14
#define C1 12
#define C2 13
#define C3 32
#define C4 33
char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
byte pin_rows[4] = {R1, R2, R3, R4};
byte pin_column[4] = {C1, C2, C3, C4};
Keypad keypad = Keypad(makeKeymap(keys), pin_rows, pin_column, 4, 4);

// WebSocket Client
WebSocketsClient client;

// Init WiFi
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

// WebSocket Event Handler
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
      Serial.printf("WebSocket received: %s\n", payload);
      break;
  }
}

// Send Fingerprint Data
void sendFingerprintData(uint8_t id, String fingerprintData) {
  String payload = "{\"user_id\":" + String(id) + ",\"fingerprint_data\":\"" + fingerprintData + "\"}";
  client.sendTXT(payload);
  Serial.println("Sent Fingerprint Data: " + payload);
}

// Send RFID Data
void sendRFIDData(uint8_t id, String card_uid) {
  String payload = "{\"user_id\":" + String(id) + ",\"card_uid\":\"" + card_uid + "\"}";
  client.sendTXT(payload);
  Serial.println("Sent RFID Data: " + payload);
}

// Fingerprint Setup
void initFingerprint() {
  FP.begin(57600);
  if (finger.begin()) {
    Serial.println("Fingerprint sensor initialized");
  } else {
    Serial.println("Fingerprint sensor initialization failed");
  }
}

// Create Fingerprint Model
void createFingerprint() {
  Serial.println("Place your finger on the sensor");
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) return;

  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) return;

  delay(2000);
  Serial.println("Place the same finger again");
  result = finger.getImage();
  if (result != FINGERPRINT_OK) return;

  result = finger.image2Tz(1);
  if (result != FINGERPRINT_OK) return;

  result = finger.createModel();
  if (result != FINGERPRINT_OK) return;

  String fingerprintData = "0x55,0xAA,0x01,..."; // Dữ liệu vân tay
  sendFingerprintData(1, fingerprintData); // Replace 1 with user ID
}

// Verify Fingerprint
void verifyFingerprint() {
  Serial.println("Place your finger on the sensor");
  int result = finger.getImage();
  if (result != FINGERPRINT_OK) return;

  result = finger.image2Tz();
  if (result != FINGERPRINT_OK) return;

  result = finger.fingerSearch();
  if (result == FINGERPRINT_OK) {
    Serial.println("Fingerprint matched!");
    sendFingerprintData(1, "Match"); // Replace 1 with user ID
  } else {
    Serial.println("No match found");
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

// Read RFID
void readRFID() {
  uint8_t success;
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0}; // Buffer to store UID
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  if (success) {
    String card_uid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      card_uid += String(uid[i], HEX);
    }
    Serial.println("RFID UID: " + card_uid);
    sendRFIDData(1, card_uid); // Replace 1 with user ID
  }
}

void setup() {
  Serial.begin(115200);
  lcd.begin();
  lcd.print("Initializing...");
  
  initWiFi();
  initFingerprint();
  initRFID();

  client.begin(websockets_server_host, websockets_server_port, "/");
  client.onEvent(webSocketEvent);
  lcd.clear();
  lcd.print("Ready");
}

void loop() {
  client.loop();
  char key = keypad.getKey();
  if (key) {
    Serial.println("Key Pressed: " + String(key));
  }
  readRFID();
}
