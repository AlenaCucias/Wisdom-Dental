import React, { useState } from "react";
import PropTypes from "prop-types";

const FBUserInput = ({ label, placeholder, type, value, onInputChange }) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
      onInputChange(newValue); // Pass input value to parent component
  };
  return (
    <div className="input">
      <p className="title-3">{label}</p>
      <div className="textfield">
        <input
          className="text"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

FBUserInput.propTypes = {
  label: PropTypes.string.isRequired, // Label text for the input
  placeholder: PropTypes.string, // Placeholder text inside the input box
  type: PropTypes.string, // Input type (text, email, etc.)
  onInputChange: PropTypes.func, // Callback for input change
};

FBUserInput.defaultProps = {
  type: "text",
};

export default FBUserInput;
