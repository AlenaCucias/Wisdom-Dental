from user import User
from typing import List
from backend.api.admin import get_full_names, view_patient_records, view_payroll_data, view_feedback


class AdminDashboard:
    def __init__(self):
        # Private variables for patient and staff records
        self.__patientList = []  # List of Patient objects
        self.__staffRecords = []  # List of Staff objects

    # Method to add a patient to the patientList
    def add_patient(self, patient):
        self.__patientList.append(patient)

    # Method to add staff to staffRecords
    def add_staff(self, staff):
        self.__staffRecords.append(staff)

    # Public method to view appointments for all patients
    def viewAppointments(self) -> List:
        appointments = []
        for patient in self.__patientList:
            appointments.extend(patient.appointments)  # check if appt.py set
        return appointments

    # Public method to view billings for all patients
    def viewBillings(self) -> List:
        billings = []
        for patient in self.__patientList:
            billings.extend(patient.billings)  # check if appt.py set
        return billings

    #print(get_full_names("Patient", "Patient ID"))
    #print(get_full_names("Staff", "Staff ID"))
    #print(view_patient_records(1001))
    #print(view_payroll_data(2001))
    #print(view_feedback())
