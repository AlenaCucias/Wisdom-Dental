from user import User
from backend.api.patients import get_all_patients, add_patient, hash_password, authenticate_patient, dental_history, payment_history, get_available_appointments, book_appointment, cancel_appointment, reschedule_appointment, get_total_cost, update_payments, get_treatment_plan
from backend.api.common import authenticate_user

class Patient(User):

    def __init__(self, name, email, phone_number, amount_due, treatment_recieved):
        super().__init__(name, email, phone_number)
        self.amount_due = amount_due
        self.treatment_recieved = treatment_recieved

    def get_amount_due(self):
        return self.amount_due

    def get_treatment_recieved(self):
        return self.treatment_recieved

    def set_treatment_recieved(self, treatment_recieved):
        self.treatment_recieved = treatment_recieved

    # I put 'pass' as a placeholder
    def schedule_appointment():
        pass

    #def reschedule_appointment():
        pass

    #def cancel_appointment():
        pass

    def make_payment():
        pass

    def view_payment_details():
        pass

    def view_dental_history():
        pass

    def view_treatment_plan():
        pass

    def view_Xray():
        pass

       # TESTING FUNCTIONS

    # patients = get_all_patients()
    # print("Patients:", patients)

    email = "example@gmail.com"
    password = "123"

    is_authenticated, user_info, sheet, role = authenticate_user(email, password)

    if is_authenticated:
        print("Authentication successful!")
        print(f"Welcome, {user_info['First Name']}!")
    else:
        print("Authentication failed. Please check your credentials.")

    print(sheet) # Use this value to enter into specified dashboard
    print(role) # Admins are in the staff sheet so if the sheet is Staff and role is Admin, go to Admin dashboard

    #print(get_treatment_plan(user_info))
    #print(dental_history(user_info))
    #print(payment_history(user_info))
    #print(get_total_cost(user_info))
    #print(update_payments(user_info))
    #print(get_available_appointments())
    #print(book_appointment(user_info,"12-02-2024","9:00:00 AM","I'm having pain in my lower left jaw"))
    #print(get_available_appointments())
    #print(cancel_appointment(user_info, "12-02-2024","9:00:00 AM"))
    #print(reschedule_appointment(user_info, "12-02-2024", "9:00:00 AM", "12-02-2024", "10:00:00 AM", "Need a later time for better schedule"))


    #new_patient = ["New","Patient","123-456-7890","newpatient@email.com",hash_password("newpatient")]
    #add_patient(new_patient)
