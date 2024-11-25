# patients.py
from flask import Flask, request, jsonify
from backend.api.common import get_worksheet, hash_password, append_row, extract
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
    # Filter Appointments table to only those that match with the current user
    appts = get_worksheet("Appointments")
    appt_data = appts.get_all_records()
    filtered_rows = [ row for row in appt_data if row["Patient ID"] == user['Patient ID']]

    doctor_names = extract("Staff", filtered_rows, "Doctor ID", "Staff ID", "Last Name")
    treatment_names = extract("Treatment", filtered_rows, "Treatment ID", "Treatment ID", "Name")

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
    # Filter Appointments table to only those that match with the current user
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()
    filtered_rows = [ row for row in data if row["Patient ID"] == user['Patient ID']]
    treatment_names = extract("Treatment", filtered_rows, "Treatment ID", "Treatment ID", "Name")
    cost = extract("Treatment", filtered_rows, "Treatment ID", "Treatment ID", "Cost")

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
    Get available appointments for a user to view.

    This function retrieves all available appointments that are not booked, grouped by date,
    with times sorted in ascending order and duplicates removed.

    Returns:
        list of tuples: Each tuple contains:
            - str: The date in "MM-DD-YYYY" format.
            - list of str: A list of unique, sorted times (in "HH:MM:SS AM/PM" format) available on that date.
    """
    # Filter Appointments table to only those that are not booked
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()
    today = datetime.today().date()

    # Group available times by date, ensuring the date is in the future
    grouped_appointments = defaultdict(list)
    for row in data:
        if not row["Patient ID"] and not row["Treatment ID"]:
            appointment_date = datetime.strptime(row["Date"], "%m-%d-%Y").date()
            if appointment_date > today:
                grouped_appointments[row["Date"]].append(row["Time"])

    # Process each date's times to remove duplicates and sort them
    sorted_appointments = [
        (date, sorted(set(times), key=lambda t: datetime.strptime(t, "%I:%M:%S %p")))
        for date, times in grouped_appointments.items()
    ]

    # ADDED the jsonify
    return jsonify(sorted_appointments)

# ADDED
if __name__ == '__main__':
    app.run(debug=True)

def book_appointment(user, date, time, notes):
    """
    Book an appointment for a user.

    Parameters:
        user (str): A dictionary containing user information, including the "Patient ID".
        date (str): The date of the appointment (format: "MM-DD-YYYY").
        time (str): The time of the appointment (format: "HH:MM:SS AM/PM").
        notes (str): Any comments the user would like to add to the appointment.

    Returns:
        str: A success message or an error message if the appointment could not be booked.
    """
    # Get the worksheet and all records
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()

    # Loop through all rows to find an available slot for the specified date and time
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Date"] == date and row["Time"] == time:
            if not row["Patient ID"] and not row["Treatment ID"]:  # Check if slot is unbooked
                # Book the appointment
                sheet.update(f"B{i}", [[user["Patient ID"]]])  # Patient ID is in column B
                sheet.update(f"G{i}", [[notes]])  # Notes are in column G
                return f"Appointment booked successfully for {date} at {time}."

    # If no available slots were found
    return "No available appointment slots for the specified date and time."


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
