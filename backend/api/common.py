# common.py
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from google.auth import exceptions as google_auth_exceptions
import gspread
from flask import Blueprint,request, jsonify, make_response
from .google_auth import get_client
import hashlib 

common_blueprint = Blueprint('common', __name__)

def get_worksheet(sheet_name):
    """
    Retrieves a specified worksheet from the "WisdomDB" spreadsheet using the Google Sheets API.

    Args:
        sheet_name (str): The name of the worksheet to retrieve.

    Returns:
        gspread.models.Worksheet: The worksheet object corresponding to the specified sheet name.
    """
    client = get_client()
    spreadsheet = client.open("WisdomDB")
    return spreadsheet.worksheet(sheet_name)

def hash_password(password):
    """
    Hashes a given plaintext password using SHA-256.

    Args:
        password (str): The plaintext password to be hashed.

    Returns:
        str: The hashed password in hexadecimal format.
    """
    return hashlib.sha256(password.encode()).hexdigest()

def append_row(sheet_name, data):
    """
    Appends a row to the Google Sheet with an incremented ID.

    Args:
        sheet_name (str): The name of the sheet to append to.
        data (list): A list of values to be appended, excluding the ID.
    """
    # Get all existing rows
    sheet = get_worksheet(sheet_name)
    rows = sheet.get_all_values()

    # Determine the next ID by checking the last row's ID
    if len(rows) > 1:  # Check if there are rows other than the header
        last_id = int(rows[-1][0])  # Assuming the first column is always the ID
        next_id = last_id + 1
    else:
        next_id = 1  # Start at 1 if the sheet is empty or only has a header

    # Prepend the ID to the data
    new_row = [next_id] + data

    # Append the new row to the sheet
    sheet.append_row(new_row, value_input_option="USER_ENTERED")

@common_blueprint.route('/authenticate_user', methods=['POST'])
def authenticate_user():
    #removed email and password parameters
    """
    Authenticate a user by checking their email and password across multiple sheets.

    If the user is found in the "Staff" sheet, their role is also included in the return.

    Args:
        email (str): The email address provided by the user.
        password (str): The plaintext password provided by the user.

    Returns:
        tuple:
            - bool: `True` if the credentials match a record, `False` otherwise.
            - dict or None: The user's details as a dictionary if authentication is successful,
              or `None` if authentication fails.
            - str or None: The name of the sheet where the user was found, or `None` if not found.
            - str or None: The user's role if found in the "Staff" sheet, or `None` otherwise.

    Note: Passwords are hashed before comparison.
    """

    email = request.json.get('email')  # If the request is JSON
    password = request.json.get('password')  # If the request is JSON
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # List of sheets to search through
    sheets = ["Patient", "Staff"]

    hashed_password = hash_password(password)

    for sheet_name in sheets:
        sheet = get_worksheet(sheet_name)
        data = sheet.get_all_records()

        # Search for a match
        user = next((row for row in data if row["Email"] == email and row["Password"] == hashed_password), None)

        if user:
            # If found in "Staff," include the role
            role = user["Role"] if sheet_name == "Staff" else None
            return make_response(jsonify([True, user, sheet_name, role]), 200)

    # Return failure if no match is found
    return jsonify({"error": "Authentication failed"}), 401

def extract(unfiltered_data, filtered_rows, data_to_compare, filter, data_to_extract):
    """
    Extract specific data from a given sheet based on filtered rows.

    This function retrieves data from another sheet and ensures it aligns with the order of
    a specific column in the filtered rows. It matches rows in the second sheet using a shared
    key and extracts desired information.

    Args:
        unfiltered_data (list of dict): The name of the sheet to extract data from.
        filtered_rows (list of dict): Rows filtered from the original dataset.
        data_to_compare (str): The key in `filtered_rows` whose values will be used for matching.
        filter (str): The key in the target sheet for filtering rows based on matching IDs.
        data_to_extract (str): The key in the target sheet whose values will be extracted.

    Returns:
        list: A list of extracted values from the target sheet, ordered to match the order of
        the `data_to_compare` values in `filtered_rows`.

    Note: The order of `filtered_rows` is preserved in the returned list of extracted values.
    """
    data = [row[data_to_compare] for row in filtered_rows]

    # Filter rows where the row[filter] matches any ID in data
    new_rows = [row for row in unfiltered_data if row[filter] in data]

    # Extract new data in the same order as data
    new_data = [
        next(row[data_to_extract] for row in new_rows if row[filter] == doc_id)
        for doc_id in data
    ]
    return new_data
