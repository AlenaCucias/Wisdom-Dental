class Patient(User):

    def __init__(self, amountDue, treatmentRecieved):
        super().__init__(name, email, phone)
        self.amountDue = amountDue
        self.treatmentRecieved = treatmentRecieved
    
    def getAmountDue(self):
        return self.amountDue
    
    def getTreatmentRecieved(self):
        return self.treatmentRecieved
    
    def setTreatmentRecieved(self, treatmentRecieved):
        self.treatmentRecieved = treatmentRecieved
    
    # I put 'pass' as a placeholder
    def scheduleAppointment():
        pass

    def rescheduleAppointment():
        pass

    def cancelAppointment():
        pass

    def makePayment():
        pass

    def viewPaymentDetails():
        pass

    def viewDentalHistory():
        pass

    def viewTreatmentPlan():
        pass

    def viewXray():  
        pass  