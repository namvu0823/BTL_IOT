#include <SPI.h>
#include <MFRC522.h>

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

const char* ssid     = ""; // CHANGE HERE
const char* password = ""; // CHANGE HERE
LiquidCrystal_I2C lcd(0x27,16,2);

char  keys[4][4]={
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte pin_rows[4]={R1,R2,R3,R4};
byte pin_column[4]={C1,C2,C3,C4};

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

Keypad keypad =Keypad(makeKeymap(keys),pin_rows, pin_column, 4, 4);



void setup() {
  Serial.begin(115200);
  Serial.println("Booting...")

  if (init_wifi() != ESP_OK) {
      Serial.println("WiFi initialization failed. Restarting...");
  }

}

void loop() {
  char key = keypad.getKey();//lấy ký tự từ bàn phím

  if (key) {
    Serial.println(key);
  }

}
