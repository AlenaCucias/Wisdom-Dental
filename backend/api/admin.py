from common import get_worksheet, append_row
from patients import dental_history
from datetime import datetime
from collections import defaultdict
from flask import Blueprint, jsonify, request

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/view_staff_list', methods=['GET'])
def view_staff_list():
    try:
        staff_data = get_worksheet("Staff").get_all_records()
        staff_list = [
            {"Staff_ID": row["Staff_ID"], "Name": f"{row['First_Name']} {row['Last_Name']}"}
            for row in staff_data
        ]
        return jsonify({"staff_list": staff_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch staff list: {str(e)}"}), 500
    

def get_full_names(sheet_name, id_type):
    """
    Extracts user IDs, first and last names from a sheet, combines the names,
    and returns a list of tuples with user IDs and full names.

    Args:
        sheet_name: The name of the sheet to extract data from.
        id_type: The ID field to be used (e.g., "Staff_ID" or "Patient_ID").

    Returns:
        list: A list of tuples, where each tuple contains:
              - User ID (int)
              - Full name (str) in the format "First Last"
    """
    data = get_worksheet(sheet_name).get_all_records()
    user_data = [
        (row[id_type], f"{row['First_Name']} {row['Last_Name']}")  # Concatenate first and last name
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

@admin_blueprint.route('/view_patient_list', methods=['GET'])
def view_patient_list():
    try:
        patient_data = get_worksheet("Patient").get_all_records()
        patient_list = [
            {"Patient_ID": row["Patient_ID"], "Name": f"{row['First_Name']} {row['Last_Name']}"}
            for row in patient_data
        ]
        return jsonify({"patients": patient_list}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch patient list: {str(e)}"}), 500
    
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

@admin_blueprint.route('/update_time', methods=['POST'])
def update_time():
    """
        resolves timesheet, adds timesheet data to payroll, and resets hours worked and total pay in staff worksheet

        Args:
            selectedTimesheet (array): of timesheet ids
    """
    data = request.json
    timesheet_ids = data.get('timesheetIDs', [])
    
    staff_data = get_worksheet("Staff").get_all_records()
    timesheet_data = get_worksheet('Timesheet').get_all_records()

    today = datetime.today().date()
    
    total_hours_to_remove = 0
    total_amount_owed = 0
    staff_id = None

    for timesheet_id in timesheet_ids:
        filtered_rows = [row for row in timesheet_data if row["Timesheet_ID"] == timesheet_id]
        
        for row in filtered_rows:
            staff_id = row["Staff_ID"]
            hours = float(row["Time"])
            total_hours_to_remove += hours
            
            # Get staff information
            staff_record = next((s for s in staff_data if s["Staff_ID"] == staff_id), None)
            if staff_record:
                wage = float(staff_record["Hourly_Pay"])
                total_amount_owed += hours * wage
                
                # Mark the timesheet as resolved
                row_index = timesheet_data.index(row) + 2
                get_worksheet("Timesheet").update(f"H{row_index}", [[True]])

    if staff_id:
        # Update the staff record
        staff_row_index = next((i for i, s in enumerate(staff_data, start=2) if s["Staff_ID"] == staff_id), None)
        if staff_row_index:
            current_hours = float(staff_record["Hours_Worked"])
            current_pay = float(staff_record["Total_Pay"])
            
            # Update the Staff worksheet with new hours and pay
            get_worksheet("Staff").update(f"H{staff_row_index}", [[current_hours - total_hours_to_remove]])
            get_worksheet("Staff").update(f"J{staff_row_index}", [[current_pay - total_amount_owed]])

    total_data = [staff_id, today, total_amount_owed ]
    
    return total_data

@admin_blueprint.route('/update_performance', methods=['POST'])
def update_performance():
    """
        add performance data from timesheet to Staff Performance Sheet

        Args:        
          user_id (str or int): The ID of the staff member whose payroll data is to be retrieved.

    """
    data = request.json
    user_id = data.get('userID')
    timesheet_data = get_worksheet("Timesheet").get_all_records()
    filtered_rows = [ row for row in timesheet_data if row["Resolved"] == True and row["Send_Performance"] == False]
    for i in filtered_rows:    
        next_index = len(get_worksheet("Staff Performance").get_all_records()) + 1
        time = i["H"] 
        procedure = i["D"]
        date = i["G"]
        performance = i["E"]
        performance_data = [next_index, user_id, time, procedure, date, performance]
        append_row("Staff Performance", performance_data)
        row_index = timesheet_data.index(i) + 2
        get_worksheet("Timesheet").update(f"I{row_index}", [[True]])

    return jsonify({"message": "Performance updated successfully!"}), 200


@admin_blueprint.route('/update_payroll', methods=["POST"])
def update_payroll():
    """

    updates payroll sheet with admin  validate timesheet information

    Args:
        user (object): passes staffID date and amount owed
    """
    data = request.json
    staffID = data.get('staffID')
    date = data.get("date")
    amount = data.get('paid')

    payroll_data = get_worksheet("Payroll").get_all_records()

    next_index = len(payroll_data) + 1

    payStub = [next_index, staffID, date, amount]
    append_row("Payroll", payStub)
    
    return jsonify({"message": "payroll updated successfully!"}), 200




@admin_blueprint.route('/view_staff_performance', methods=['GET'])
def view_staff_performance():
    try:
        staff_id = request.args.get("staff_id")  # Get the staff_id from query parameters
        performance_data = get_worksheet("Staff Performance").get_all_records()  # Fetch performance data

        # Filter data based on the staff ID
        filtered_data = [
            {
                "Performance_ID": record["Performance_ID"],
                "Date": record["Date"],
                "Time": record["Time"],
                "Procedure": record["Procedure"],
                "Performance": record["Performance"],
            }
            for record in performance_data if record["Staff_ID"] == int(staff_id)  # Ensure Staff_ID is compared as integer
        ]

        return jsonify({"staff_performance": filtered_data}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch staff performance: {str(e)}"}), 500
    

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
