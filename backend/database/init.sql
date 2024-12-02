CREATE DATABASE iot_unlock;
CREATE USER 'iot_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON iot_unlock.* TO 'iot_user'@'localhost';
FLUSH PRIVILEGES;
