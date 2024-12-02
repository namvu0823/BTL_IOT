USE iot_unlock;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(15)
);

CREATE TABLE fingerprints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  fingerprint_data BLOB,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE rfid_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  card_uid VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
