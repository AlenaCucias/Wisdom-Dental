# staff.py
from backend.api.common import get_worksheet, hash_password, append_row, extract
from datetime import datetime
from collections import defaultdict

def upcoming_appointments(user):
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
    # Get all relevant sheets once
    appt_data = get_worksheet("Appointments").get_all_records()
    treatments_data = get_worksheet("Treatment").get_all_records()
    patients_data = get_worksheet("Patient").get_all_records()
    today = datetime.today().date()

    filtered_rows = [row for row in appt_data if row["Doctor ID"] == user['Staff ID'] and row["Patient ID"]]
    treatment_names = [extract(treatments_data, filtered_rows, "Treatment ID", "Treatment ID", "Name")
                       [0] if row.get("Treatment ID") else "" for row in filtered_rows]
    patient_first_names = extract(patients_data, filtered_rows, "Patient ID", "Patient ID", "First Name")
    patient_last_names = extract(patients_data, filtered_rows, "Patient ID", "Patient ID", "Last Name")
    # Create a new list to store the full names
    patient_full_names = [f"{first} {last}" for first, last in zip(patient_first_names, patient_last_names)]

    # Format the total data list
    total_data = [
        [name, treatment, f"{row['Time']} {row['Date']}"]
        for name, treatment, row in zip(patient_full_names, treatment_names, filtered_rows)
        if datetime.strptime(row["Date"], "%m-%d-%Y").date() > today  # Ensure date parsing is consistent
    ]

    return total_data


def add_hours(user, hours):
    """
    Add hours to the current timesheet for a staff member.

    This function updates the "Hours Worked" for a specific staff member
    in the "Staff" worksheet by adding the specified number of hours.
    It identifies the correct row based on the staff member's ID.

    Args:
        user (dict): A dictionary containing the staff member's information,
                     including the "Staff ID" and current "Hours Worked".
        hours (int or float): The number of hours to be added to the current total.

    Returns:
        str: A confirmation message indicating that the timesheet was updated.

    Note:
        - Assumes "Hours Worked" is stored in column H of the "Staff" worksheet.
        - The function starts searching from the second row, skipping headers.
    """
    sheet = get_worksheet("Staff")
    data = sheet.get_all_records()
    current_hours = user["Hours Worked"]
    new_hours = current_hours + hours
    for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
        if row["Staff ID"] == user["Staff ID"]:
            # Add new hours
            sheet.update(f"H{i}", [[new_hours]])  # Hours Worked is in column H
    return f"Timesheet updated"
