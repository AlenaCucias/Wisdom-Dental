# staff.py
from .user import User
from .common import get_worksheet, extract, append_row
from datetime import datetime
from collections import defaultdict
from flask import Blueprint, jsonify, request

staff_blueprint = Blueprint('staff', __name__)

@staff_blueprint.route('/get_treatment_details', methods=['POST'])
def get_treatment_details():
    appointment_data = get_worksheet("Treatment").get_all_records()
    data = request.json
    id1 = data.get('id1')
    id2 = data.get('id2')
    print(id1)

    filtered_row1 = [row for row in appointment_data if str(row["Treatment_ID"]).strip().lower() == id1]
    filtered_row2 = [row for row in appointment_data if str(row["Treatment_ID"]).strip().lower() == id2]

    print(f"Filtered rows for id1: {filtered_row1}")
    print(f"Filtered rows for id2: {filtered_row2}")

    total_data = [[row['Description']] for row in filtered_row1] + [[row['Description']] for row in filtered_row2]
    print(total_data)
    return jsonify(total_data)


@staff_blueprint.route('/upcoming_appointments', methods=['POST'])
def upcoming_appointments():
    """
    Retrieve a list of upcoming appointments for a specific staff member.

    This function filters appointment data based on the given user's staff ID
    and fetches associated patient and treatment details. It returns a list
    of appointments including the patient's full name, treatment name, and
    the date and time of the appointment.

    Args:
        user (dict): A dictionary containing user information, including the 'Staff ID'.

    Returns:
        list: A list of upcoming appointments, where each item is a list
              containing:
              - Patient's full name (str)
              - Treatment name (str, or empty string if unavailable)
              - Appointment date and time (str, formatted as "Time Date")

    Note:
        - The function assumes data is pre-fetched from three worksheets:
          "Appointments", "Treatment", and "Patient".
        - Appointments with missing "Patient ID" or past dates are excluded.
    """
    data = request.json
    user = data.get('user', {})
    # Get all relevant sheets once
    appt_data = get_worksheet("Appointments").get_all_records()
    treatments_data = get_worksheet("Treatment").get_all_records()
    patients_data = get_worksheet("Patient").get_all_records()
    today = datetime.today().date()

    filtered_rows = [row for row in appt_data if row["Doctor_ID"] == user['Staff_ID'] and row["Patient_ID"]]
    treatment_names = [extract(treatments_data, filtered_rows, "Treatment_ID", "Treatment_ID", "Name")
                       [0] if row.get("Treatment_ID") else "" for row in filtered_rows]
    patient_first_names = extract(patients_data, filtered_rows, "Patient_ID", "Patient_ID", "First_Name")
    patient_last_names = extract(patients_data, filtered_rows, "Patient_ID", "Patient_ID", "Last_Name")
    # Create a new list to store the full names
    patient_full_names = [f"{first} {last}" for first, last in zip(patient_first_names, patient_last_names)]

    # Format the total data list
    total_data = [
        [name, treatment, f"{row['Time']} {row['Date']}", f"{row['Treatment_ID']}"]
        for name, treatment, row in zip(patient_full_names, treatment_names, filtered_rows)
        if datetime.strptime(row["Date"], "%m-%d-%Y").date() > today  # Ensure date parsing is consistent
    ]

    return total_data
@staff_blueprint.route('/update_timesheet', methods=['POST'])
def update_timesheet():

    """
    Add hours to the current timesheet for a staff member and record the performance.

    This function updates the "Hours Worked" for a specific staff member in the
    "Staff" worksheet by adding the specified number of hours. It also logs the
    performance data in the "Staff Performance" sheet. The function identifies
    the correct row based on the staff member's ID.

    Args:
        user (dict): A dictionary containing the staff member's information,
                     including the "Staff ID" and current "Hours Worked".
        hours (str): The number of hours worked, given in the format "HH:MM" (e.g., "2:30").
        procedure (str): The name or description of the procedure performed.
        performance (int): A performance rating for the procedure between 1-5 inclusive.
        pay (str): The total amount of money made after updating timesheet

    Returns:
        int: updated total pay

    Note:
        - Assumes "Hours Worked" is stored in column H of the "Staff" worksheet.
        - The function starts searching from the second row, skipping headers.
        - The `hours` argument is a string in "HH:MM" format and is converted into a float
          (e.g., "2:30" becomes 2.5).
    """

    data = request.json
    user = data.get('user', {})
    hours = data.get('hours')
    procedure = data.get('procedure')
    performance = data.get('performance')
    apptTime = data.get('apptTime')

    if not user or not hours or not procedure or performance is None:
        return jsonify({"error": "Invalid input. All fields are required."}), 400

    # Add performance data to performance sheet
    today = datetime.today().date().strftime("%m-%d-%Y")
    performance_data = [user["Staff_ID"], hours, procedure, today, performance]
    append_row("Staff Performance", performance_data)

    #Add time sheet data to timesheet sheet
    timesheet_data = [user["Staff_ID"], hours, procedure, performance, apptTime, today, False, False]
    append_row("Timesheet", timesheet_data)

    # Gather necesary data
    sheet = get_worksheet("Staff")
    data = sheet.get_all_records()
    current_hours = user["Hours_Worked"]

    # Convert hours to float to add to the total
    hours, minutes = map(int, hours.split(":"))
    hours_float = hours + minutes / 60.0

    # Add hours to total_hours in staff sheet
    new_hours = current_hours + hours_float
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Staff_ID"] == user["Staff_ID"]:
            # Add new hours
            sheet.update(f"H{i}", [[new_hours]])  # Hours Worked is in column H
            pay = sheet.cell(i, 10).value
    # return f"Timesheet updated"

    return jsonify({"pay":pay}), 200

@staff_blueprint.route('/get_performance', methods=['POST'])
def get_performance():
    """
    Retrieves performance data for a specific staff member.

    Args:
        user_id (str or int): The ID of the staff member whose performance data is to be retrieved.

    Returns:
        list: A list of performance history, each containing:
              - Date
              - Procedure
              - Time spent on the procedure
              - Performance (1-5 inclusive)
    """
    data = request.json
    user_id = data.get('userID')
    performance_data = get_worksheet("Staff Performance").get_all_records()
    # Get only records that are associated with user
    filtered_rows = [ row for row in performance_data if row["Staff_ID"] == user_id]
    total_data = [[row["Date"], row["Procedure"], row["Time"], row["Performance"]] for row in filtered_rows]
    return total_data

@staff_blueprint.route('/get_qualifications', methods=['POST'])
def get_qualifications():
    """
    Retrieves qualifcations for staff member

    Args:
        user_id (str or int): The ID of the staff member whose performance data is to be retrieved.

    Returns:
        list of qualifcaions, containg:
            - degree
            - certificationsi
            - years of expirience 
    """

    data = request.json
    user_id = data.get('userID')    
    qualifications_data = get_worksheet("Qualifications").get_all_records()
    filtered_rows = [ row for row in qualifications_data if row["Staff_ID"] == user_id]
    total_data = [[row["Degree"], row["Certification"], row["Experience"]] for row in filtered_rows]
    return total_data