# notification.py
from common import send_email, get_worksheet, extract
import base64
from datetime import datetime, timedelta
import time
import schedule


# Base64 encode your image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def appointment_confirmation(user, date, time):
    # Send an email
    to_email = user["Email"]
    subject = "Dentist Appointment Confirmation"

    # Base64 encode the logo image
    encoded_image = encode_image("../../wisdomdental/src/components/logo.png")

    # HTML body with a logo, structured layout, and professional formatting
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <!-- Header with Logo -->
        <table width="100%" style="background-color: #7495AF; padding: 0;">
            <tr>
                <td style="text-align: center;">
                    <img src="data:image/png;base64,{encoded_image}" alt="Wisdom Dental Logo" width="150">
                </td>
            </tr>
        </table>

        <!-- Main content -->
        <div style="padding: 20px;">
            <h2 >Hello {user["First_Name"]}!</h2>
            <p><strong>Your appointment has been confirmed for <span style="color: #007bff;">{date}</span> at <span style="color: #007bff;">{time}</span>.</strong></p>
            <p>We are looking forward to seeing you soon!</p>
            <br>
            <p>Best regards,<br>
               <strong>Wisdom Dental</strong><br>
               <em>Your dental health, our priority</em></p>
        </div>

        <!-- Footer with Contact Information -->
        <table width="100%" style="background-color: #f8f8f8; padding: 10px 0; margin-top: 20px;">
            <tr>
                <td style="text-align: center;">
                    <p style="color: #555;">Wisdom Dental - 1234 ABC Dr, Sacramento, CA 95819</p>
                    <p style="color: #555;">Phone: (123) 456-7890 | Email: office@wisdomdental.com</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    response = send_email(to_email, subject, body)
    return response

def appointment_reminder():
    # Get today's date to compare to appointment dates
    today = datetime.today().date()
    target_date = today + timedelta(days=2)
    # Get all relevant sheets
    appt_data = get_worksheet("Appointments").get_all_records()
    patient_data = get_worksheet("Patient").get_all_records()
    # Filter Appointments table to only those that match with the current user
    filtered_rows = [ row for row in appt_data if row["Date"] == target_date]
    patient_names = extract(patient_data, filtered_rows, "Patient_ID", "Patient_ID", "First_Name")
    patient_emails = extract(patient_data, filtered_rows, "Patient_ID", "Patient_ID", "Email")

    # Format data in a list of tuples
    total_data = [[email, name, date, time]
                   for email, name, date, time in
                   zip(patient_emails, patient_names, [row["Date"]for row in filtered_rows], [row["Time"]for row in filtered_rows])
                   ]

    subject = "Dentist Appointment Reminder"

    # Base64 encode the logo image
    encoded_image = encode_image("../../wisdomdental/src/components/logo.png")

    # Iterate through each patient and send the reminder email
    for email, name, date, time in total_data:
        # Create the email body with dynamic content
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <!-- Header with Logo -->
            <table width="100%" style="background-color: #7495AF; padding: 0;">
                <tr>
                    <td style="text-align: center;">
                        <img src="data:image/png;base64,{encoded_image}" alt="Wisdom Dental Logo" width="150">
                    </td>
                </tr>
            </table>

            <!-- Main content -->
            <div style="padding: 20px;">
                <h2>Hello {name}!</h2>
                <p><strong>This is a reminder that your appointment on <span style="color: #007bff;">{date}</span> at <span style="color: #007bff;">{time}</span> is coming up.</strong></p>
                <p>See you soon!</p>
                <br>
                <p>Best regards,<br>
                   <strong>Wisdom Dental</strong><br>
                   <em>Your dental health, our priority</em></p>
            </div>

            <!-- Footer with Contact Information -->
            <table width="100%" style="background-color: #f8f8f8; padding: 10px 0; margin-top: 20px;">
                <tr>
                    <td style="text-align: center;">
                        <p style="color: #555;">Wisdom Dental - 1234 ABC Dr, Sacramento, CA 95819</p>
                        <p style="color: #555;">Phone: (123) 456-7890 | Email: office@wisdomdental.com</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

        # Send the email to each patient
        response = send_email(email, subject, body)
        print(f"Reminder sent to {name} ({email}): {response}")

    print(f"Reminder email sent at {datetime.now()}")

# Schedule the job to run once a day at 9:00 AM
schedule.every().day.at("09:00").do(appointment_reminder)

# This will execute the job once and then stop
schedule.run_pending()
