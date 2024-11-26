from user import User
from backend.api.staff import update_timesheet, upcoming_appointments
from backend.api.common import authenticate_user, hash_password

class Staff(User):
    def __init__(self, name, email, phone_number, salary, hours_worked):
        super().__init__(name, email, phone_number)
        self.salary = salary
        self.hours_worked = hours_worked

    def get_salary(self):
            return self.get_salary

    def get_hours_worked(self):
            return self.hours_worked

    email = "jbunt@gmail.com"
    password = "James Bunt"

    is_authenticated, user_info, sheet, role = authenticate_user(email, password)

    if is_authenticated:
        print("Authentication successful!")
        print(f"Welcome, {user_info['First Name']}!")
    else:
        print("Authentication failed. Please check your credentials.")

    #print(update_timesheet(user_info, "2:00", "Teeth Cleaning", 5))
    #print(upcoming_appointments(user_info))
