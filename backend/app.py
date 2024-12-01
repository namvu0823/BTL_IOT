from flask import Flask, request, jsonify
import mysql.connector
from config.db_config import get_db_config

app = Flask(__name__)

db_config = get_db_config()

def connect_db():
    return mysql.connector.connect(**db_config)

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, phone) VALUES (%s, %s, %s)",
            (data['name'], data['email'], data['phone'])
        )
        conn.commit()
        return jsonify({"user_id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/add_fingerprint', methods=['POST'])
def add_fingerprint():
    data = request.json
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO fingerprints (user_id, fingerprint_data) VALUES (%s, %s)",
            (data['user_id'], data['fingerprint_data'])
        )
        conn.commit()
        return jsonify({"message": "Fingerprint added"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/add_rfid', methods=['POST'])
def add_rfid():
    data = request.json
    conn = connect_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO rfid_cards (user_id, card_uid) VALUES (%s, %s)",
            (data['user_id'], data['card_uid'])
        )
        conn.commit()
        return jsonify({"message": "RFID card added"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
