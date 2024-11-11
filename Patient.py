from User import User

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

    def reschedule_appointment():
        pass

    def cancel_appointment():
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