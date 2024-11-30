# reminder.py
from common import send_email, get_worksheet, extract
from datetime import datetime, timedelta

def appointment_reminder():
    # Get target date from add two days to today's date
    today = datetime.today().date()
    target_date = (today + timedelta(days=2)).strftime("%m-%d-%Y")  # Format target date as string

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
                        <img src="https://drive.google.com/uc?export=view&id=13D-bJiSojIy6DjfVEpX6Ivli95U-rwQv&export=view&authuser=0" alt="Wisdom Dental Logo" width="150">
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

# Run the reminder function
appointment_reminder()
