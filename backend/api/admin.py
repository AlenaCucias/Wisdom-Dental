# admin.py
from backend.api.common import get_worksheet
from backend.api.patients import dental_history
from datetime import datetime
from collections import defaultdict

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
        (row[id_type], f"{row['First Name']} {row['Last Name']}") # Concatenate first and last name
        for row in data if id_type in row and "First Name" in row and "Last Name" in row
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
    user_info = next((row for row in patient_data if row["Patient ID"] == user_id), None)
    return dental_history(user_info)

def view_payroll_data(user_id):
    """
    Retrieves payroll data for a specific staff member.

    Args:
        user_id (str or int): The ID of the staff member whose payroll data is to be retrieved.

    Returns:
        list: A list of payroll records, each containing:
              - Payment Date
              - Amount Paid
    """
    payroll_data = get_worksheet("Payroll").get_all_records()
    # Get only records that are associated with user
    filtered_rows = [ row for row in payroll_data if row["Staff ID"] == user_id]
    total_data = [[row["Payment Date"], row["Amount Paid"]] for row in filtered_rows]
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
