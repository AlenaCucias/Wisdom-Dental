import datetime

class Appointment():

    def __init__(self, app_ID, patient, staff, y, m, d, hr, min, status):
        self.appointment_ID = app_ID
        self.patient = patient
        self.staff = staff
        self.date = datetime.date(y, m, d)
        self.time_slot = datetime.time(hr, min)
        self.status = status

    def get_app_ID(self):
        return self.appointment_ID
    
    def get_patient(self):
        return self.patient.get_name()

    def get_staff(self):
        return self.staff.get_name()
    
    def get_date(self):
        return self.date
    
    def get_time(self):
        return self.time_slot
    
    def get_status(self):
        return self.status
    
    def schedule():
        pass

    def cancel():
        pass

    def reschedule():
        pass

