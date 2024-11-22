# google_auth.py
import gspread
from google.oauth2.service_account import Credentials

# Authentication function to connect to WisdomDB with Google Sheets API
def get_client():
    """
    Authenticates and returns a Google Sheets API client using service account credentials.

    This function uses a service account JSON key file to authenticate and authorize access
    to the Google Sheets and Google Drive APIs. The function returns a client object that
    can be used to interact with Google Sheets.

    Returns:
        gspread.Client: The authenticated Google Sheets API client.
    """
    creds = Credentials.from_service_account_file("backend/api/wisdom-dental-441719-bed0a9e07213.json")
    scoped_creds = creds.with_scopes(['https://www.googleapis.com/auth/spreadsheets',"https://www.googleapis.com/auth/drive"])
    client = gspread.authorize(scoped_creds)
    return client