#include <string>
#include "user.cpp"
using namespace std;

class Staff : public User {
    private:
        double salary;
        double hoursWorked;

    public:
        Staff() : User() {
            this->salary = 0;
            this->hoursWorked = 0;
        }

        Staff(string name, string email, string phone, double salary, double hoursWorked) : User(name, email, phone) {
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