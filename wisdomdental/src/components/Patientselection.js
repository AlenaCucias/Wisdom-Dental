import React, { useState } from 'react';

const PatientSelection = ({ selectedStatus, setSelectedStatus }) => {
  const handleSelection = (status) => {
    setSelectedStatus(status); // Updates the selected status when a chip is clicked
  };
  return (
    <div className="selection-wrapper">
      <div className="selection">
        <div className="title-3">Patient Status</div>

        <div className="chip-group">
          <div
            className={`chip ${selectedStatus === "Current Patient" ? "selected" : ""}`}
            onClick={() => handleSelection("Current Patient")}
          >
            <span className="text-2">Current Patient</span>
          </div>

          <div
            className={`chip-2 ${selectedStatus === "Former Patient" ? "selected" : ""}`}
            onClick={() => handleSelection("Former Patient")}
          >
            <span className="text-2">Former Patient</span>
          </div>
        </div>

        {/* Display the selected patient status */}
        {selectedStatus && (
          <div className="selected-status">
            <p>You have selected: <strong>{selectedStatus}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSelection;