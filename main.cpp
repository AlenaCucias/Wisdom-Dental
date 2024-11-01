#include <iostream>
#include "classes.h"

int main() {
    Staff emp1("Yeng", "ythao@email.com", "(123)456-7890", 12345, 12);
    std::cout << "My name is " << emp1.getName() << std::endl;
    std::cout << "My email is " << emp1.getEmail() << std::endl;
    std::cout << "My phone is " << emp1.getPhone() << std::endl;
    std::cout << "My salary is " << emp1.getSalary() << std::endl;
    std::cout << "I worked " << emp1.getHoursWorked() << " hours" << std::endl;
}