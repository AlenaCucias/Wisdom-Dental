# admin.py
from .common import get_worksheet
from .patients import dental_history
from datetime import datetime
from collections import defaultdict
from flask import Blueprint, jsonify, request

admin_blueprint = Blueprint('admin', __name__)

def get_full_names(sheet_name, id_type):
    """
    Extracts user IDs, first and last names from a sheet, combines the names,
    and returns a list of tuples with user IDs and full names.

    Args:
        sheet: The worksheet object to extract data from.

    Returns:
        list: A list of tuples, where each tuple contains:
              - User ID (int)
              - Full name (str) in the format "First Last"
    """
    data = get_worksheet(sheet_name).get_all_records()
    user_data = [
        (row[id_type], f"{row['First_Name']} {row['Last_Name']}") # Concatenate first and last name
        for row in data if id_type in row and "First_Name" in row and "Last_Name" in row
    ]
    return user_data

def view_patient_records(user_id):
    """
    Retrieves the dental history for a specific patient.

    Args:
        user_id (str or int): The ID of the patient whose records are to be retrieved.

    Returns:
        list or dict: The dental history for the specified patient.
    """
    patient_data = get_worksheet("Patient").get_all_records()
    # Get patient info to call dental_history
    user_info = next((row for row in patient_data if row["Patient_ID"] == user_id), None)
    return dental_history(user_info)

@admin_blueprint.route('/view_payroll_data', methods=['POST'])
def view_payroll_data():
    """
    Retrieves payroll data for a specific staff member.

    Args:
        user_id (str or int): The ID of the staff member whose payroll data is to be retrieved.

    Returns:
        list: A list of payroll records, each containing:
              - Payment Date
              - Amount Paid
    """
    data = request.json
    user_id = data.get('userID') 
    payroll_data = get_worksheet("Payroll").get_all_records()
    # Get only records that are associated with user
    filtered_rows = [ row for row in payroll_data if row["Staff_ID"] == user_id]
    total_data = [[row["Payment_Date"], row["Amount_Paid"]] for row in filtered_rows]
    return total_data

@admin_blueprint.route('/view_timesheet', methods=['POST'])
def view_timesheet():
    """
        Retrieves timesheet data, resolves timesheet, adds timesheet data to payroll, and resets hours worked and total pay in staff worksheet

        Args:
            user_id (str or int): The ID of the staff member whose payroll data is to be retrieved.

        Returns:
            list: A list of payroll records, each containing:
              - timesheet id
              - date
              - time
              - procedure
              - hours worked 
    """

    data = request.json
    user_id = data.get('userID')
    timesheet_data = get_worksheet('Timesheet').get_all_records()
    filtered_rows = [ row for row in timesheet_data if row["Staff_ID"] == user_id]
    total_data = [[row["Timesheet_ID"], row["Date"], row["Appt_Time"], row["Procedure"], row["Time"]] for row in filtered_rows]
    return total_data

@admin_blueprint.route('/update_time_and_pay')
def update_time_and_pay():
    """
        resolves timesheet, adds timesheet data to payroll, and resets hours worked and total pay in staff worksheet

        Args:
            selectedTimesheet (array): of timesheet ids
    """
    data = request.json
    timesheet_ids = data.get('timesheetIDs', [])
    staff_data = get_worksheet("Staff").get_all_records()
    timesheet_data = get_worksheet('Timesheet').get_all_records()
    amount_owed = 0
    staffID = ''
    for timesheet_id in timesheet_ids:
        filtered_rows = [ row for row in timesheet_data if row["Timesheet_ID"] == timesheet_id]
        payroll_data = [[row["Staff_ID"], row["Date"]] for row in filtered_rows]
        hours = [[row["Time"]] for row in filtered_rows]
        staffID = [[row["Staff_ID"]] for row in filtered_rows]
        filtered_staff = [ row for row in staff_data if row["Staff_ID"] == staffID]
        wage = [[row["Hourly_Pay"]] for row in filtered_staff]
        amountOwed += hours * wage
        if filtered_rows is not None:
            for i, row in enumerate(data, start=2):  # Start=2 because headers are in the first row
                if row["Timesheet_ID"] == timesheet_id:
                    get_worksheet("Timesheet").update(f"H{i}", [True])



def view_staff_performance(user_id):
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
    performance_data = get_worksheet("Staff Performance").get_all_records()
    # Get only records that are associated with user
    filtered_rows = [ row for row in performance_data if row["Staff_ID"] == user_id]
    total_data = [[row["Date"], row["Procedure"], row["Time"], row["Performance"]] for row in filtered_rows]
    return total_data


def view_feedback():
    """
    Retrieves and formats all feedback, sorted by the most recent entries first.

    Returns:
        list: A list of formatted feedback records, each containing:
              - Date
              - Name
              - Rating
              - Comments
              - Role
              - Email
    """
    feedback_data = get_worksheet("Feedback").get_all_records()
    # Sort by Date in descending order
    sorted_feedback = sorted(feedback_data, key=lambda row: datetime.strptime(row["Date"], "%m-%d-%Y"), reverse=True)
    # Format the sorted data
    formatted_data = [[row["Date"], row["Name"], row["Rating"], row["Comments"], row["Role"], row["Email"]]
                      for row in feedback_data]
    return formatted_data
