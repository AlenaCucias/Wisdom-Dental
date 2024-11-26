# patients.py
from flask import Flask, request, jsonify
from common import get_worksheet, hash_password, append_row, extract
from datetime import datetime
from collections import defaultdict
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

def get_all_patients():
    """
    Retrieves all records from the 'Patient' sheet.

    Returns:
        list: A list of dictionaries, where each dictionary represents a row in the 'Patient' sheet,
              with column names as keys and the corresponding cell values as values.
    """
    sheet = get_worksheet("Patient")
    return sheet.get_all_records()

def add_patient(patient_data):
    """
    Adds a new patient's data to the 'Patient' sheet by appending a new row.

    Args:
        patient_data (list): A list containing the patient's information to be added.
    """
    append_row("Patient", patient_data)


@app.route('/authenticate_patient', methods=['POST'])
def authenticate_patient():
    """
    Authenticates a patient by checking their email and password against the stored records.

    Args:
        None (request JSON is expected)

    Returns:
        JSON: A response indicating whether authentication was successful or not, with an optional user record.
    """
    try:
        data = request.json  # Get the incoming JSON data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        sheet = get_worksheet("Patient")
        patient_data = sheet.get_all_records()

        # Hash the password to compare with the stored hash
        hashed_password = hash_password(password)

        # Check if a matching record exists
        user = next(
            (row for row in patient_data if row["Email"] == email and row["Password"] == hashed_password),
            None
        )

        if user:
            # Return success with user data
            return jsonify({"success": True, "user": user}), 200
        else:
            # Return failure message
            return jsonify({"success": False, "error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_treatment_plan(user):
    """
    Returns the treatment plan for a given user.

    Args:
        user (dict): A dictionary containing user information, including the "Treatment Plan".

    Returns:
        str: A string containing the user's treatment plan.
    """
    treatment_plan = user["Treatment Plan"]
    return treatment_plan

def dental_history(user):
    """
    Retrieve the dental history for a given user.

    This function filters the "Appointments" table to find all appointments associated with the user,
    retrieves the corresponding doctor and treatment details, and returns a formatted list of tuples
    containing the details of past appointments.

    Args:
        user (dict): A dictionary containing user information, including the "Patient ID".

    Returns:
        list of lists: Each inner list contains:
            - str: The date of the appointment in "MM-DD-YYYY" format.
            - str: The name of the treatment performed during the appointment.
           - str: The last name of the doctor who performed the treatment.

    Note: Only past appointments (with dates before today's date) are included.
    """
    # Get all relevant sheets
    appt_data = get_worksheet("Appointments").get_all_records()
    staff_data = get_worksheet("Staff").get_all_records()
    treatment_data = get_worksheet("Treatment").get_all_records()
    # Filter Appointments table to only those that match with the current user
    filtered_rows = [ row for row in appt_data if row["Patient ID"] == user['Patient ID']]

    doctor_names = extract(staff_data, filtered_rows, "Doctor ID", "Staff ID", "Last Name")
    treatment_names = extract(treatment_data, filtered_rows, "Treatment ID", "Treatment ID", "Name")

    # Use the current date to show all past visits
    today = datetime.today().date()

    # Format data in a list of tuples
    total_data = [[date, treatment, doctor]
                   for date, treatment, doctor in
                   zip([row["Date"]for row in filtered_rows], treatment_names, doctor_names)
                   if datetime.strptime(date, "%m-%d-%Y").date() < today
                   ]

    return total_data

def payment_history(user):
    """
    Retrieve the payment history for a given user.

    This function filters the "Appointments" table to retrieve all appointments for the specified user,
    fetches the corresponding treatment details (name and cost), and returns a formatted list of tuples
    containing the appointment details.

    Args:
        user (dict): A dictionary containing user information, including the "Patient ID".

    Returns:
        list of lists: Each inner list contains:
            - str: The date of the appointment in "MM-DD-YYYY" format.
            - str: The name of the treatment associated with the appointment.
            - str or float: The cost of the treatment.
            - str or bool: The payment status of the appointment (e.g., "TRUE" for paid or "FALSE" for not paid).
    """
    # Get all relevant sheets
    appt_data = get_worksheet("Appointments").get_all_records()
    treatment_data = get_worksheet("Treatment").get_all_records()
    # Filter Appointments table to only those that match with the current user
    filtered_rows = [ row for row in appt_data if row["Patient ID"] == user['Patient ID']]
    treatment_names = extract(treatment_data, filtered_rows, "Treatment ID", "Treatment ID", "Name")
    cost = extract(treatment_data, filtered_rows, "Treatment ID", "Treatment ID", "Cost")

    # Format data in a list of tuples
    total_data = [[date, treatment, cost, status]
                   for date, treatment, cost, status in
                   zip([row["Date"]for row in filtered_rows], treatment_names, cost, [row["Paid"] for row in filtered_rows])
                   ]
    return total_data

def get_total_cost(user):
    """
    Calculate the total outstanding cost for a given user based on unpaid appointments.

    Args:
        user (dict): A dictionary containing user information, including the "Patient ID".

    Returns:
        float: The total outstanding cost for the user, summing the costs of appointments where the "Paid" status is "FALSE".
    """
    data = payment_history(user)
    total_cost = sum(row[2] for row in data if row[3] == "FALSE")  # row[2] refers to the "cost" column, and row[3] refers to the "status" column
    return total_cost

def update_payments(user):
    """
    Updates payment status for a user and appends the payment details to the Payments sheet.

    Args:
        user (dict): A dictionary containing user information, including the "Patient ID".

    Returns:
        str: A message indicating the status of the operation.

    Note: Must not be called if the cost is 0
    """
    # Get the worksheet and all records
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()
    payment_amount = get_total_cost(user)
    today = datetime.today().date().strftime("%m-%d-%Y")

    # Loop through all rows to find an available slot for the specified date and time
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Patient ID"] == user["Patient ID"] and row["Paid"] == "FALSE":
            # Book the appointment
            appointment_id = row["Appointment ID"]
            sheet.update(f"H{i}", [[True]])  # Paid is in column H
    payment_data = [user["Patient ID"], appointment_id, payment_amount, today]
    append_row("Payments", payment_data)
    return f"Payments updated"

# ADDED
@app.route('/get_available_appointments', methods=['GET'])
def get_available_appointments():
    """
    Get all available appointment slots with corresponding dates and times.

    Returns:
        JSON response: A list of dates and their available time slots.
    """
    try:
        sheet = get_worksheet("Appointments")
        data = sheet.get_all_records()  # Get all records from the 'Appointments' sheet
    except Exception as e:
        return jsonify({"error": f"Error accessing appointment records: {str(e)}"}), 500

    available_slots = {}
    today = datetime.today().date().strftime("%m-%d-%Y")

    # Collect available slots
    for row in data:
        if not row["Patient ID"] and not row["Treatment ID"]:  # Check availability
            date, time = row["Date"], row["Time"]
            if date > today:  # Only future dates
                # Reformat time to "HH:MM AM/PM" and strip leading zeros
                # Reformat time to "H:MM AM/PM" (removes leading zero in hour)
                time_obj = datetime.strptime(time, "%I:%M:%S %p")
                formatted_time = time_obj.strftime("%I:%M %p").lstrip('0')  # Strip leading zero
                available_slots.setdefault(date, set()).add(formatted_time)  # Use set to avoid duplicates

    # Sort times for each date and convert back to lists
    for date in available_slots:
        available_slots[date] = sorted(available_slots[date], key=lambda t: datetime.strptime(t, "%I:%M %p")).lstrip("0")

    if available_slots:
        return jsonify({"available_slots": available_slots}), 200
    else:
        return jsonify({"message": "No available appointment slots at the moment."}), 404

@app.route('/book_appointment', methods=['POST'])
def book_appointment(user, date, time, notes):
    """
    Book an appointment for a user.

    Parameters:
        - user (dict): The dictionary containing user information, including the "Patient ID".
        - date (str): The date of the appointment (format: "MM-DD-YYYY").
        - time (str): The time of the appointment (format: "HH:MM:SS AM/PM").
        - notes (str): Any comments the user would like to add to the appointment.

    Returns:
        str: A success message or an error message if the appointment could not be booked.
    """
    # Get the incoming JSON request
    try:
        data = request.json
        patient_id = data.get("patient_id")
        date = data.get("date")
        time = data.get("time")
        notes = data.get("notes")
        data = request.json

        # Extract values from the request
        patient_id = data.get("Patient_id")
        treatment_id = data.get("treatment_id")
        doctor_id = data.get("doctor_id")
        date = data.get("date")
        time = data.get("time")
        notes = data.get("notes", "")

        if not all([patient_id, date, time]):
                return jsonify({"success": False, "error": "Missing required fields"}), 400

        sheet = get_worksheet("Appointments")
        data = sheet.get_all_records()

        for i, row in enumerate(data, start=2):  # Rows start at 2 because of the header
            if row["Date"] == date and row["Time"] == time and not row["Patient ID"]:
                sheet.update(f"B{i}", [[patient_id]])  # Update Patient ID
                sheet.update(f"G{i}", [[notes]])  # Update Notes
                return jsonify({"success": True, "message": "Appointment booked successfully"}), 200

        return jsonify({"success": False, "error": "Selected time slot is not available"}), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def cancel_appointment(user, date, time):
    """
    Cancel an appointment for a user.

    Parameters:
        user (str): A dictionary containing user information, including the "Patient ID".
        date (str): The date of the appointment (format: "MM-DD-YYYY").
        time (str): The time of the appointment (format: "HH:MM:SS AM/PM").

    Returns:
        str: A success message or an error message if the appointment could not be canceled.
    """
    # Get the worksheet and all records
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()

    # Loop through all rows to find the appointment for the specified date, time, and user
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Date"] == date and row["Time"] == time and row["Patient ID"] == user["Patient ID"]:
            # Cancel the appointment
            sheet.update(f"B{i}", [[""]])  # Patient ID is in column B
            sheet.update(f"C{i}", [[""]])  # Treatment ID is in column C
            sheet.update(f"G{i}", [[""]])  # Notes are in column G
            return f"Appointment canceled successfully for {date} at {time}."

    # If no available slots were found
    return "Not able to cancel the appointment for the specified date and time."

def reschedule_appointment(user, date, time, new_date, new_time, new_notes):
    """
    Reschedule an appointment for a user.

    Parameters:
        user (str): A dictionary containing user information, including the "Patient ID".
        date (str): The date of the original appointment (format: "MM-DD-YYYY").
        time (str): The time of the original appointment (format: "HH:MM:SS AM/PM").
        new_date (str): The date of the new appointment (format: "MM-DD-YYYY").
        new_time (str): The time of the new appointment (format: "HH:MM:SS AM/PM").
        new_notes (str): Any comments the user would like to add to the new appointment.


    Returns:
        str: A success message or an error message if the appointment could not be rescheduled.
    """
    # Get the worksheet and all records
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()

    # Loop through all rows to find the appointment for the specified date, time, and user
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Date"] == date and row["Time"] == time and row["Patient ID"] == user["Patient ID"]:
            # Book the appointment
            treatment = row["Treatment ID"]
            sheet.update(f"B{i}", [[""]])  # Patient ID is in column B
            sheet.update(f"C{i}", [[""]])  # Treatment ID is in column C
            sheet.update(f"G{i}", [[""]])  # Notes are in column G

    # Loop through all rows to find an available slot for the specified date and time
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Date"] == new_date and row["Time"] == new_time:
            if not row["Patient ID"] and not row["Treatment ID"]:  # Check if slot is unbooked
                # Book the appointment
                sheet.update(f"B{i}", [[user["Patient ID"]]])  # Patient ID is in column B
                sheet.update(f"C{i}", [[treatment]]) # Treatment ID is in column C
                sheet.update(f"G{i}", [[new_notes]])  # Notes are in column G
                return f"Appointment rescheduled successfully for {new_date} at {new_time}."

    # If no available slots were found
    return "Not able to reschedule your appointment."

@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.json
    first_name = data.get('firstName')  # changed from 'Name' to 'firstName'
    last_name = data.get('lastName')    # added 'lastName'
    contact_email = data.get('contact_email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    hashed_password = hash_password(password)  # You can hash the password before saving it

    # Validate required fields
    if not first_name or not last_name or not contact_email or not phone_number or not password:
        return jsonify({'message': 'First name, last name, contact email, phone number, and password are required'}), 400

    if not isinstance(first_name, str):
        return jsonify({'message': 'First name must be a string'}), 400

    if not isinstance(last_name, str):
        return jsonify({'message': 'Last name must be a string'}), 400

    if not isinstance(contact_email, str):
        return jsonify({'message': 'Contact email must be a string'}), 400

    if not isinstance(phone_number, str):
        return jsonify({'message': 'Phone number must be a string'}), 400

    try:
        # Get today's date for the account creation date
        current_date = datetime.now().strftime('%m-%d-%Y')

        # Get the last Patient ID to auto-generate the next one (assuming Patient ID is numeric)
          # Increment Patient ID by 1

        # Prepare the row to insert into the "Patients" sheet
        row = [
             # New Patient ID
            first_name,      # firstName
            last_name,       # lastName
            phone_number,
            contact_email,
            hashed_password,  # It's assumed that the password is already hashed
        ]

        # Assuming 'append_row' is a function that appends data to your Google Sheet
        append_row("Patient", row)  # Assuming "Patients" is the sheet name

        return jsonify({'message': 'Patient account created successfully'}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Failed to create account', 'error': str(e)}), 500

def get_last_patient_id():
    """Fetch the last patient ID from the Google Sheet and return it"""
    try:
        # Access Google Sheet
        sheet = get_worksheet("Patient")  # Make sure "Patients" sheet exists
        rows = sheet.get_all_records()  # Get all the records
        if not rows:
            return 1000  # If no rows, start from Patient ID 1000
        # Get the max Patient ID from the existing records
        last_patient_id = max([row['Patient ID'] for row in rows])  # Find the max Patient ID
        return last_patient_id
    except Exception as e:
        print(f"Error getting last Patient ID: {e}")
        return 1000

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

@app.route('/get_latest_reviews', methods=['GET'])
def get_latest_reviews():
    # Get the 'Feedback' worksheet
    sheet = get_worksheet('Feedback')

    # Fetch all values from the sheet (assuming reviews are in the format: ID, Name, Comment, Star Rating, Timestamp)
    reviews = sheet.get_all_records()

    # Check the keys (columns) of the first review to verify the column names
    if reviews:
        print("Column Names:", reviews[0].keys())  # This will print the columns from the first record

    # Ensure reviews exist
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 404

    # Sort reviews by timestamp in descending order
    sorted_reviews = sorted(reviews, key=lambda x: x['Date'], reverse=True)

    # Return the top 5 latest reviews
    return jsonify(sorted_reviews[:4])

if __name__ == '__main__':
    app.run(debug=True)
