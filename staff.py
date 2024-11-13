from user import User

class Staff(User):
    def __init__(self, name, email, phone_number, salary, hours_worked):
        super().__init__(name, email, phone_number)
        self.salary = salary
        self.hours_worked = hours_worked
    
    def get_salary(self):
            return self.get_salary
    
    def get_hours_worked(self):
            return self.hours_worked
    
    