from flask import Flask, request, jsonify
import gspread
from google_auth import get_client 
from datetime import datetime
from flask_cors import CORS

app = Flask (__name__)
CORS(app)

@app.route('/submit_feedback', methods=['POST'])
#Endpoint to submit feedback
def submit_eedback():
        data = request.json
        comments = data.get ('comments')
        contract_email = data.get('contact_email')
        patient_name = data.get ('Name')
        patient_status = data.get('patient_status') # current or former
        star_rating = data.get('star_rating') # 1 to 5

        if not patient_name or not comments:
            return jsonify({'message': 'Patient name and comments are required'}), 400

        if patient_status not in ['current', 'former']:
            return jsonify({'message': 'Patient status must be "current" or "former"'}), 400
        if not star_rating or not (1 <= star_rating <= 5):
            return jsonify({'message': 'Star rating must be between 1 and 5'}), 400

        client = get_client()

        sheet = client.open('WisdomDB').sheet1

        current_date = datetime.now().strftime('%m/%d/%Y')

        row = [
            "",  # Feedback ID (will be auto-generated)
            patient_name, 
            contact_email, 
            comments, 
            patient_status, 
            star_rating, 
            current_date
        ]
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
        # Get the next available row (this assumes the first row is headers)
            next_row = len(sheet.get_all_values()) + 1  # Get the next empty row in the sheet
            feedback_id = next_row  # Feedback ID is assigned based on the row number

            row[0] = feedback_id

            sheet.append_row(row)

            return jsonify({'message': 'Feedback submitted successfully'}), 201

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to submit feedback'}), 500

if __name__ == '__main__':
    app.run(debug=True)
