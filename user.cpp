#include <string>
using namespace std;

class User {
    protected: 
        string name;
        string email;
        string phone;

    
    public:
        User () {
            this->name = "";
            this->email = "";
            this->phone = "";
        }

        User(string name, string email, string phone) {
            this->name = name;
            this->email = email;
            this->phone = phone;
        }

        string getName() {
            return this->name;
        }

        string getEmail() {
            return email;
        }

        string getPhone() {
            return phone;
        }

        void login() {

        }

        void signup() {

        }

        void logout() {

        }
};