from Patient import Patient 
from staff import Staff
from appointment import Appointment

pat = Patient("John", "John@gmail.com", "123123", 123, "213")
staff = Staff("Jane", "Jane@gmail.com", "3131", 12345, 23)

app = Appointment(1, pat, staff, 2024, 12, 12, 12, 30, "done")
print(app.get_patient(), app.get_staff())
print(app.get_date(), "\t", app.get_time())
