# patients.py
from user import User
from flask import  Blueprint, Flask, request, jsonify
from common import get_worksheet, hash_password, append_row, extract
from notification import appointment_confirmation
from datetime import datetime
from collections import defaultdict
from flask_cors import CORS

patients_blueprint = Blueprint('patients', __name__)

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


@patients_blueprint.route('/authenticate_patient', methods=['POST'])
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
    treatment_plan = user["Treatment_Plan"]
    return treatment_plan

@patients_blueprint.route('/get_dental_history', methods=['GET'])
def dental_history():
    """
    Retrieve the dental history for a given user.

    This function filters the "Appointments" table to find all appointments associated with the user,
    retrieves the corresponding doctor and treatment details, and returns a formatted list of tuples
    containing the details of past appointments.

    Args:
        user (dict): A dictionary containing user information, including the "Patient_ID".

    Returns:
        list of lists: Each inner list contains:
            - str: The date of the appointment in "MM-DD-YYYY" format.
            - str: The name of the treatment performed during the appointment.
           - str: The last name of the doctor who performed the treatment.

    Note: Only past appointments (with dates before today's date) are included.
    """
    patient_id = request.args.get("patient_id")

    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        # Get all relevant sheets
        appt_data = get_worksheet("Appointments").get_all_records()
        staff_data = get_worksheet("Staff").get_all_records()
        treatment_data = get_worksheet("Treatment").get_all_records()
        # Filter Appointments table to only those that match with the current user
        filtered_rows = [ row for row in appt_data if str(row["Patient_ID"]) == patient_id]

        doctor_names = extract(staff_data, filtered_rows, "Doctor_ID", "Staff_ID", "Last_Name")
        treatment_names = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Name")

        # Use the current date to show all past visits
        today = datetime.today().date()

        # Format data in a list of tuples
        total_data = [[date, treatment, doctor]
                    for date, treatment, doctor in
                    zip([row["Date"]for row in filtered_rows], treatment_names, doctor_names)
                    if datetime.strptime(date, "%m-%d-%Y").date() < today
                    ]

        return jsonify({"appointments": total_data}),200

    except Exception as e:
        return jsonify({"error":f"Failed to fetch dental history: {str(e)}"}),500

@patients_blueprint.route('/get_payment_history', methods=['GET'])
def payment_history():
    """
    Retrieve the payment history for a given user.

    This function filters the "Appointments" table to retrieve all appointments for the specified user,
    fetches the corresponding treatment details (name and cost), and returns a formatted list of tuples
    containing the appointment details.

    Args:
        user (dict): A dictionary containing user information, including the "Patient_ID".

    Returns:
        list of lists: Each inner list contains:
            - str: The date of the appointment in "MM-DD-YYYY" format.
            - str: The name of the treatment associated with the appointment.
            - str or float: The cost of the treatment.
            - str or bool: The payment status of the appointment (e.g., "TRUE" for paid or "FALSE" for not paid).
    """
    patient_id = request.args.get("patient_id")

    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        # Get all relevant sheets
        appt_data = get_worksheet("Appointments").get_all_records()
        treatment_data = get_worksheet("Treatment").get_all_records()
        # Filter Appointments table to only those that match with the current user
        filtered_rows = [ row for row in appt_data if str(row["Patient_ID"]) == patient_id]
        treatment_names = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Name")
        cost = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Cost")

        # Format data in a list of tuples
        total_data = [[date, treatment, cost, status]
                    for date, treatment, cost, status in
                    zip([row["Date"]for row in filtered_rows], treatment_names, cost, [row["Paid"] for row in filtered_rows])
                    ]

        return jsonify({"payments": total_data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch payment history: {str(e)}"}), 500

@patients_blueprint.route('/get_total_cost', methods=['GET'])
def get_total_cost():
    """
    Calculate the total outstanding cost for a given user based on unpaid appointments.

    Args:
        user (dict): A dictionary containing user information, including the "Patient_ID".

    Returns:
        float: The total outstanding cost for the user, summing the costs of appointments where the "Paid" status is "FALSE".
    """
    patient_id = request.args.get("patient_id")

    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        # Get all relevant sheets
        appt_data = get_worksheet("Appointments").get_all_records()
        treatment_data = get_worksheet("Treatment").get_all_records()
        # Filter Appointments table to only those that match with the current user
        filtered_rows = [ row for row in appt_data if str(row["Patient_ID"]) == patient_id]
        treatment_names = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Name")
        cost = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Cost")

        cost = [float(c) if c is not None else 0.0 for c in cost]

        # Format data in a list of tuples
        total_data = [[date, treatment, cost, status]
                    for date, treatment, cost, status in
                    zip([row["Date"]for row in filtered_rows], treatment_names, cost, [row["Paid"] for row in filtered_rows])
                    ]

        total_cost = sum(row[2] for row in total_data if row[3] == "FALSE")  # row[2] refers to the "cost" column, and row[3] refers to the "status" column

        return jsonify({"total_cost": total_cost}), 200
    except Exception as e:
        print(f"Error in get_total_cost: {e}")
        return jsonify({"error": f"Failed to fetch total cost: {str(e)}"}), 500

    #data = payment_history()
    #total_cost = sum(row[2] for row in data if row[3] == "FALSE")  # row[2] refers to the "cost" column, and row[3] refers to the "status" column
    #return total_cost

@patients_blueprint.route('/update_payments', methods=['GET'])
def update_payments():
    """
    Updates payment status for a user and appends the payment details to the Payments sheet.

    Args:
        user (dict): A dictionary containing user information, including the "Patient_ID".

    Returns:
        str: A message indicating the status of the operation.

    Note: Must not be called if the cost is 0
    """
    # Get the worksheet and all records
    sheet = get_worksheet("Appointments")
    data = sheet.get_all_records()

    patient_id = request.args.get("patient_id")

    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        # Get all relevant sheets
        appt_data = get_worksheet("Appointments").get_all_records()
        treatment_data = get_worksheet("Treatment").get_all_records()
        # Filter Appointments table to only those that match with the current user
        filtered_rows = [ row for row in appt_data if str(row["Patient_ID"]) == patient_id]
        treatment_names = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Name")
        cost = extract(treatment_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Cost")

        cost = [float(c) if c is not None else 0.0 for c in cost]

        # Format data in a list of tuples
        total_data = [[date, treatment, cost, status]
                    for date, treatment, cost, status in
                    zip([row["Date"]for row in filtered_rows], treatment_names, cost, [row["Paid"] for row in filtered_rows])
                    ]

        payment_amount = sum(row[2] for row in total_data if row[3] == "FALSE")

        if payment_amount == 0:
            return jsonify({"error": "No outstanding payment to update."}), 400

        today = datetime.today().date().strftime("%m-%d-%Y")

        # Loop through all rows to find an available slot for the specified date and time
        for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
            if str(row["Patient_ID"]) == patient_id and row["Paid"] == "FALSE":
                # Book the appointment
                appointment_id = row["Appointment_ID"]
                sheet.update(f"H{i}", [[True]])  # Paid is in column H
        payment_data = [patient_id, appointment_id, payment_amount, today]
        append_row("Payments", payment_data)

        return jsonify({"message":f"Payments updated"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update payments: {str(e)}"}), 500

# ADDED
@patients_blueprint.route('/get_available_appointments', methods=['GET'])
def get_available_appointments():
    """
    Get all available appointment slots with corresponding dates and times.
    Each time slot allows up to 3 patients across dentists.
    """
    try:
        sheet = get_worksheet("Appointments")
        data = sheet.get_all_records()  # Get all records from the 'Appointments' sheet
    except Exception as e:
        return jsonify({"error": f"Error accessing appointment records: {str(e)}"}), 500

    available_slots = {}
    today = datetime.today().date().strftime("%m-%d-%Y")

    # Track total bookings for each date and time
    time_slot_counts = {}

    for row in data:
        date, time = row["Date"], row["Time"]
        if date > today:  # Only consider future dates
            key = (date, time)

            # Count how many rows have a Patient_ID for the same time slot
            if key not in time_slot_counts:
                time_slot_counts[key] = 0
            if row["Patient_ID"]:
                time_slot_counts[key] += 1

    # Include slots with fewer than 3 patients
    for (date, time), count in time_slot_counts.items():
        if count < 3:  # Only include time slots with fewer than 3 bookings
            if date not in available_slots:
                available_slots[date] = []
            available_slots[date].append(time)

    # Sort times for each date
    for date in available_slots:
        available_slots[date] = sorted(available_slots[date], key=lambda t: datetime.strptime(t, "%I:%M %p"))

    if available_slots:
        return jsonify({"available_slots": available_slots}), 200
    else:
        return jsonify({"message": "No available appointment slots at the moment."}), 404

@patients_blueprint.route('/book_appointment', methods=['POST'])
def book_appointment():
    """
    Book an appointment for a user.

    Expects JSON payload with:
    - patient_id: ID of the patient booking the appointment
    - date: Date of the appointment in "MM-DD-YYYY" format
    - time: Time of the appointment in "HH:MM AM/PM" format
    - notes: Additional notes for the appointment (optional)
    """
    try:
        data = request.json
        patient_id = data.get("patient_id")
        date = data.get("date")
        time = data.get("time")
        treatment = data.get("treatment")
        notes = data.get("notes", "")

        # Validate required fields
        if not all([patient_id, date, time]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        # Validate Patient ID
        patient_sheet = get_worksheet("Patient")
        patients = patient_sheet.get_all_records()
        if not any(str(patient["Patient_ID"]) == str(patient_id) for patient in patients):
            return jsonify({"success": False, "error": "Invalid Patient ID"}), 400

        # Access the Appointments worksheet
        appointment_sheet = get_worksheet("Appointments")
        appointments = appointment_sheet.get_all_records()

        found = False  # Flag to check if we find a valid slot
        for i, row in enumerate(appointments, start=2):  # Start from row 2 (after header)
            if (
                row["Date"] == date and
                row["Time"].strip() == time.strip() and  # Match time and date
                not row["Patient_ID"]  # Slot is not booked
            ):
                # Update the first available slot for the time
                appointment_sheet.update(f"B{i}", [[patient_id]])  # Update Patient_ID
                appointment_sheet.update(f"C{i}", [[treatment]]) # set default treatment to general consultation
                appointment_sheet.update(f"G{i}", [[notes]])  # Update Notes
                found = True
                break

        if not found:
            return jsonify({"success": False, "error": "Time slot already fully booked (3 patients max)."}), 400

        # Check if a matching patient record exists
        user = next(
            (row for row in patients if row["Patient_ID"] == patient_id),
            None
        )

        # Send appointment confirmation email if user found
        if user:
            try:
                appointment_confirmation(user, date, time)
            except Exception as e:
                print(f"Error sending confirmation email: {e}")

        return jsonify({"success": True, "message": "Appointment booked successfully"}), 200

    except Exception as e:
        print(f"Error booking appointment: {e}")  # Log the error
        return jsonify({"success": False, "error": str(e)}), 500


@patients_blueprint.route('/get_treatments', methods=['GET'])
def get_treatments():
    """
    Fetch all available treatments from the 'Treatment' sheet.

    Returns:
        JSON: A list of treatment names and IDs.
    """
    try:
        treatment_sheet = get_worksheet("Treatment")
        treatments = treatment_sheet.get_all_records()

        if not treatments:
            return jsonify({"success": False, "message": "No treatments found"}), 404

        treatment_list = [
            {"id": row["Treatment_ID"], "name": row["Name"]}
            for row in treatments
        ]

        return jsonify({"success": True, "treatments": treatment_list}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@patients_blueprint.route('/get_upcoming_appointments', methods=['GET'])
def get_upcoming_appointments():
    """
    Fetch upcoming appointments for a given patient ID.
    Query Parameter:
        - patient_id: ID of the patient
    """
    patient_id = request.args.get("patient_id")
    if not patient_id:
        return jsonify({"error": "Patient ID is required"}), 400

    try:
        sheet = get_worksheet("Appointments")
        appointments = sheet.get_all_records()
        treatment_sheet = get_worksheet("Treatment")  # Fetch the treatment sheet
        treatments = treatment_sheet.get_all_records()
        today = datetime.today().date()
        upcoming = []

        # Debugging: Print patient_id and today's date
        print(f"Fetching appointments for Patient_ID={patient_id}, Today's Date={today}")

        for row in appointments:
            try:
                appointment_date = datetime.strptime(row["Date"], "%m-%d-%Y").date()
                if str(row["Patient_ID"]) == str(patient_id) and appointment_date >= today:

                    # Find the treatment name by matching Treatment_ID from the appointments sheet
                    treatment_name = "General Checkup"  # Default value if no treatment found
                    treatment_id = row["Treatment_ID"]

                    # Loop through the treatments to find the matching Treatment_ID
                    for treatment in treatments:
                        if str(treatment["Treatment_ID"]) == str(treatment_id):
                            treatment_name = treatment["Name"]  # Get the treatment name

                    upcoming.append({
                        "appointment_id": row["Appointment_ID"],
                        "date": row["Date"],
                        "time": row["Time"],
                        "treatment": treatment_name,
                        "paid": row["Paid"],
                    })
            except Exception as e:
                print(f"Error parsing row: {row}, Error: {e}")

        # Debugging: Print all matching appointments
        print(f"Upcoming Appointments for Patient_ID={patient_id}: {upcoming}")

        if not upcoming:
            return jsonify({"message": "No upcoming appointments at the moment"}), 200

        # Sort by date and time
        upcoming.sort(
            key=lambda x: (
                datetime.strptime(x["date"], "%m-%d-%Y"),
                datetime.strptime(x["time"], "%I:%M %p"),
            )
        )

        return jsonify({"appointments": upcoming}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch appointments: {str(e)}"}), 500

@patients_blueprint.route('/cancel_appointment', methods=['POST'])
def cancel_appointment():
    try:
        data = request.json
        appointment_id = data.get("appointment_id")
        patient_id = data.get("patient_id")

        if not appointment_id or not patient_id:
            return jsonify({"success": False, "error": "Appointment ID and Patient ID are required"}), 400

        sheet = get_worksheet("Appointments")
        appointments = sheet.get_all_records()

        # Loop through the data to find the matching appointment
        for i, row in enumerate(appointments, start=2):  # Skip the header row
            if row["Appointment_ID"] == appointment_id and row["Patient_ID"] == patient_id:
                sheet.update(f"B{i}", [[""]])  # Clear Patient_ID
                sheet.update(f"C{i}", [[""]])  # Clear Treatment_ID
                sheet.update(f"G{i}", [[""]])  # Clear Notes
                return jsonify({"success": True, "message": f"Appointment {appointment_id} canceled successfully."}), 200

        return jsonify({"success": False, "error": "Appointment not found or mismatch."}), 400

    except Exception as e:
        return jsonify({"success": False, "error": f"Error: {str(e)}"}), 500

@patients_blueprint.route('/reschedule_appointment', methods=['POST'])
def reschedule_appointment():
    """
    Reschedule an appointment for a given patient.

    Expects JSON payload:
    - patient_id: ID of the patient
    - old_date: Original date of the appointment
    - old_time: Original time of the appointment
    - new_date: New date for the appointment
    - new_time: New time for the appointment
    - new_notes: Notes for the new appointment (optional)
    """
    data = request.json
    print(f"Request Data: {data}")
    patient_id = data.get("patient_id")
    old_date = data.get("old_date")
    old_time = data.get("old_time")
    new_date = data.get("new_date")
    new_time = data.get("new_time")
    new_notes = data.get("new_notes", "")

    if not all([patient_id, old_date, old_time, new_date, new_time]):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    try:
        sheet = get_worksheet("Appointments")
        appointments = sheet.get_all_records()

        # Step 1: Retrieve the Treatment_ID of the original appointment
        treatment_id = None
        for i, row in enumerate(appointments, start=2):
            if row["Date"] == old_date and row["Time"] == old_time and str(row["Patient_ID"]) == str(patient_id):
                treatment_id = row["Treatment_ID"]  # Get the Treatment_ID
                # Clear the original appointment slot
                sheet.update(f"B{i}", [[""]])  # Clear Patient_ID
                sheet.update(f"C{i}", [[""]])  # Clear Treatment_ID
                sheet.update(f"G{i}", [[""]])  # Clear Notes
                print(f"Original appointment {old_date} at {old_time} canceled.")
                break

        if not treatment_id:
            return jsonify({"success": False, "error": "Original appointment not found"}), 400

        # Step 2: Reschedule the appointment with the same Treatment_ID
        for i, row in enumerate(appointments, start=2):
            if row["Date"] == new_date and row["Time"] == new_time and not row["Patient_ID"]:  # Check availability
                # Book the new appointment
                sheet.update(f"B{i}", [[patient_id]])  # Update Patient_ID
                sheet.update(f"C{i}", [[treatment_id]])  # Update Treatment_ID with the same treatment
                sheet.update(f"G{i}", [[new_notes]])  # Update Notes
                print(f"Appointment rescheduled to {new_date} at {new_time}.")

                # Confirmation email logic
                patient_data = get_worksheet("Patient").get_all_records()
                user = next((row for row in patient_data if row["Patient_ID"] == patient_id), None)
                if user:
                    try:
                        appointment_confirmation(user, new_date, new_time)
                    except Exception as e:
                        print(f"Error sending confirmation email: {e}")

                return jsonify({"success": True, "message": "Appointment rescheduled successfully."}), 200

        return jsonify({"success": False, "error": "Selected time slot is not available."}), 400

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@patients_blueprint.route('/create_account', methods=['POST'])
def create_account():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    contact_email = data.get('contact_email')
    phone_number = data.get('phone_number')
    password = data.get('password') # You can hash the password before saving it

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

    if (len(password) < 8):
        return jsonify({'message': 'Password must be at least 8 characters'}), 400

    if ((len(phone_number) != 10) or not (phone_number.isdigit())):
        return jsonify({'message': 'Phone number must be 10 digits'}), 400

    try:
        hashed_password = hash_password(password)

        # Prepare the row to insert into the "Patients" sheet
        row =[
            first_name,      # firstName
            last_name,       # lastName
            phone_number,
            contact_email,
            hashed_password,
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
        last_patient_id = max([row['Patient_ID'] for row in rows])  # Find the max Patient ID
        return last_patient_id
    except Exception as e:
        print(f"Error getting last Patient ID: {e}")
        return 1000
