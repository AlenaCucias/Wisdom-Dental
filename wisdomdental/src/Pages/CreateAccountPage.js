import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";


const CreateAccountPage = () => {
  // State to store form input data
  const initialFormData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // State to store form input data
  const [formData, setFormData] = useState(initialFormData);

  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    // Submit logic here
    alert("Account created successfully!");
    console.log("Form Data:", values);
    resetForm(); // Reset form fields after successful submission
  };
  const validate = (values) => {
    const errors = {};
  
    if (!values.firstName) {
      errors.firstName = "First Name is required";
    }
  
    if (!values.lastName) {
      errors.lastName = "Last Name is required";
    }
  
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    }
  
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }
  
    if (!values.password) {
      errors.password = "Password is required";
    }
  
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    }
  
    return errors;
  };
  
  const handleCancel = () => {
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="create-account">
      <span className="text-5">Create Account Form</span>
      <span className="text-6">
        Create your profile by filling in this account creation form
      </span>

      <Formik
        initialValues={initialFormData} // Initial form data
        validate={validate} // Validation function
        onSubmit={handleSubmit} // Handle form submission
      >
        <Form>
          {/* First Name and Last Name */}
          <div className="wrapper-4">
            <span className="text-7">First Name</span>
            <span className="text-8">Last Name</span>
          </div>

          <div className="group-3">
            <div className="group-4">
              <Field
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                className="input-field"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error-message"
              />
            </div>

            <div className="section-2">
              <Field
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                className="input-field"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="error-message"
              />
            </div>
          </div>

          {/* Phone Number and Email */}
          <div className="wrapper-5">
            <span className="text-b">Phone Number</span>
            <span className="text-c">Email</span>
          </div>

          <div className="section-3">
            <div className="group-5">
              <Field
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                className="input-field"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="error-message"
              />
            </div>

            <div className="group-6">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="input-field"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>
          </div>
          {/* Create Password and Confirm Password */}
          <div className="section-4">
            <span className="text-f">Create Password</span>
            <span className="text-10">Confirm Password</span>
          </div>
          <div className="box-3">
            <div className="box-4">
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                className="input-field"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <div className="group-7">
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm the password"
                className="input-field"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>
          </div>
          {/* Submit and Cancel Buttons */}
          <div className="group-8">
            <div className="group-9">
              <button type="submit" className="Button-5">
                <span className="text-13">Create Account</span>
              </button>
            </div>
            <button type="button" className="Button-5" onClick={handleCancel}>
              <span className="text-14">Cancel</span>
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
export default CreateAccountPage;