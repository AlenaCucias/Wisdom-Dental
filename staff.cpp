#include <string>
#include "user.cpp"

class Staff : public User {
    private:
        double salary;
        double hoursWorked;

    public:
        Staff() : User() {
            this->salary = 0;
            this->hoursWorked = 0;
        }

        Staff(std::string name, std::string email, std::string phone, double salary, double hoursWorked) : User(name, email, phone) {
            this->salary = salary;
            this->hoursWorked = hoursWorked;
        }

        double getSalary() {
            return salary;
        }

        double getHoursWorked() {
            return hoursWorked;
        }
};