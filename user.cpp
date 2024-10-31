#include <string>

class User {
    public: 
        std::string name;
        std::string email;
        std::string phone;

    
    public:
        User () {
            this->name = "";
            this->email = "";
            this->phone = "";
        }

        User(std::string name, std::string email, std::string phone) {
            this->name = name;
            this->email = email;
            this->phone = phone;
        }

        std::string getName() {
            return this->name;
        }

        std::string getEmail() {
            return email;
        }

        std::string getPhone() {
            return phone;
        }

        void login() {

        }

        void signup() {

        }

        void logout() {

        }
};