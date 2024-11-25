from user import User
from backend.api.staff import add_hours, upcoming_appointments
from backend.api.common import authenticate_user

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
    password = "234"

    is_authenticated, user_info, sheet, role = authenticate_user(email, password)

    if is_authenticated:
        print("Authentication successful!")
        print(f"Welcome, {user_info['First Name']}!")
    else:
        print("Authentication failed. Please check your credentials.")

    #print(add_hours(user_info, 10))
    #print(upcoming_appointments(user_info))
