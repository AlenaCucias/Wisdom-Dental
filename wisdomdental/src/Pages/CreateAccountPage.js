import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccountPage = () => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Send data to Flask backend (replace with your backend URL)
      const response = await axios.post("http://localhost:5000/create_account", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact_email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
      });

      // If successful, show success message
      setSuccess(true);
      setError(null);
      console.log("Form Data:", formData);
      console.log("Response from Flask:", response.data);

      // Reset form fields
      setFormData(initialFormData);
    } catch (err) {
      // If error, show error message
      setError(err.response?.data?.message || "Failed to create account");
      setSuccess(false);
      console.error("Error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="create-account">
      <span className="text-5">Create Account Form</span>
      <span className="text-6">
        Create your profile by filling in this account creation form
      </span>

      <form onSubmit={handleSubmit}>
        {/* First Name and Last Name */}
        <div className="wrapper-4">
          <span className="text-7">First Name</span>
          <span className="text-8">Last Name</span>
        </div>

        <div className="group-3">
          <div className="group-4">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="section-2">
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
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
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="group-6">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
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
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="group-7">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm the password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
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
      </form>

      {/* Show success or error message */}
      {success && <p style={{ color: "green" }}>Account created successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateAccountPage;