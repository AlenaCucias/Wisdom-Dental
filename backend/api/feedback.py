from flask import Flask, request, jsonify 
import mysql.connector
from mysql.connector import Error

app = Flask (__name__)

#Database connection helper
def get_db_connection():
    conn = mysql.connector.connet(host= 'xxxxxx', database = 'xxxx', user='xxxx', password='xxxxxxx')
    return conn

#Endpoint to submit feedback
def submit_feedback():
        data = request.json
        comments = data.get ('comments')
        contract_email = data.get('contact_email')
        patient_name = data.get ('Name')
        patient_status = data.get('patient_status') # current or former
        star_rating = data.get('star_rating') # 1 to 5

        if not patient_name or not comments:
            return jsonify({'message':'Patient ID and comments are requrired'}), 400

        if patient_status not in ['current', 'former']:
            return jsonify({'message':'Patient status must be "current" or "former"'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursour.execute(INSERT INTO FEEDBACK (patient_name, comments, contact_email, patient_status, star_rating) values (?, ?, ?, ?, ?), (patient_name, comments, contact_email, patient_status, star_rating))
            conn.commit()
            return jsonify({'message':'Feedback submitted succesfully'}), 201
        except sqlite3.DatabaseError as e:   
            print(f"Error:{e}")
            return jsonify({'message': 'Failed to submit feedback'}), 500

        finally:
            conn.close()

if __name__ == '__main__': #running the flask application
    app.run(debug=True)
