# notification.py
from common import send_email

def appointment_confirmation(user, date, time):
    # Send an email
    to_email = user["Email"]
    subject = "Dentist Appointment Confirmation"

    # HTML body with a logo, structured layout, and professional formatting
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
