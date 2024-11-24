from flask import Flask, request, jsonify
from common import append_row
from datetime import datetime
from flask_cors import CORS

app = Flask (__name__)
CORS(app, origins=["http://localhost:3000"])

# Handle OPTIONS preflight requests
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        return '', 200

@app.route('/submit_feedback', methods=['POST'])
#Endpoint to submit feedback
def submit_feedback():
        data = request.json
        comments = data.get ('comments')
        contact_email = data.get('contact_email')
        patient_name = data.get ('Name')
        patient_status = data.get('patient_status') # current or former
        star_rating = data.get('star_rating') # 1 to 5

        print(f"Patient Name Type: {type(patient_name)}, Value: {patient_name}")
        print(f"Comments Type: {type(comments)}, Value: {comments}")
        print(f"Contact Email Type: {type(contact_email)}, Value: {contact_email}")
        print(f"Patient Status Type: {type(patient_status)}, Value: {patient_status}")
        print(f"Star Rating Type: {type(star_rating)}, Value: {star_rating}")
        if not patient_name or not comments:
            return jsonify({'message': 'Patient name and comments are required'}), 400

        if not isinstance(patient_name, str):
            return jsonify({'message': 'Patient name must be a string'}), 400

        if not isinstance(comments, str):
            return jsonify({'message': 'Comments must be a string'}), 400

        if not isinstance(contact_email, str):
            return jsonify({'message': 'Contact email must be a string'}), 400

        if patient_status not in ['Current Patient', 'Former Patient']:
            return jsonify({'message': 'Patient status must be "current" or "former"'}), 400

        if not isinstance(patient_status, str):
            return jsonify({'message': 'Patient status must be a string'}), 400

        if not isinstance(star_rating, int):
            return jsonify({'message': 'Star rating must be an integer'}), 400

        if not (1 <= star_rating <= 5):
            return jsonify({'message': 'Star rating must be between 1 and 5'}), 400


        try:
        # Get today's date
            current_date = datetime.now().strftime('%m-%d-%Y')

        # Prepare row data
            row = [
                patient_name,
                contact_email,
                comments,
                patient_status,
                star_rating,
                current_date
            ]
        # Append the row to the Google Sheet
            append_row("Feedback", row)
            return jsonify({'message': 'Feedback submitted successfully'}), 201

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Failed to submit feedback', 'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
