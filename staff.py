class User: 
    def_intit(self, name = "", email ="", phone = ""):
        self.name = name
        self.email = email
        self.phone = phone

class Staff(User):
    def_init_(self, name "", email = "", phone="", salary= 0.0, hours_worked= 0.0):
        super()._init_(name, email, phone)
        self.salary = salary
        self.hours_worked = hours_worked
    
    def get_salary(self):
            return self.get_salary
    
    def get_hours_worked(self):
            return self.hours_worked
    
    