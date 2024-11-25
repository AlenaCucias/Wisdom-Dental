import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

export const AdminPage = () => {
  // State to manage visibility of modals
  const [modal, setModal] = useState({
    patientRecords: false,
    payrollInfo: false,
    staffPerformance: false,
  });

  // Toggle the visibility of modals
  const toggleModal = (modalName) => {
    setModal((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  return (
    <div className="admin-page">
      <div className="div">
        <div className="title">Admin Dashboard</div>

        <p className="description">
          Welcome back, John! View and manage Patient and Staff Information here.
        </p>

        <div className="rectangle" />

        {/* All Patient Records Button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("patientRecords")}>
                All Patient Records
              </button>
            </div>
          </div>
        </div>

        {/* View Payroll Information Button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("payrollInfo")}>
                View Payroll Information
              </button>
            </div>
          </div>
        </div>

        {/* View Staff Performance Button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("staffPerformance")}>
                View Staff Performance
              </button>
            </div>
          </div>
        </div>

        {/* Admin Profile Section */}
        <div className="overlap">
          <div className="group-2">
            <div className="label-normal">
              <div className="label-text">Admin</div>
            </div>

            <div className="title-2">John Doe</div>

            <div className="avatar" />
          </div>

          <p className="email-johndoe-gmail">
            <span className="span">Email: </span>
            <span className="text-wrapper-2">
              johndoe@gmail.com
              <br />
              <br />
            </span>
            <span className="span">Phone Number: <br /></span>
            <span className="text-wrapper-2">+1(123) 456-7890</span>
          </p>
        </div>

        {/* Modals for each button */}

        {/* Modal for All Patient Records */}
        <Modal isOpen={modal.patientRecords} toggle={() => toggleModal("patientRecords")}>
          <ModalHeader toggle={() => toggleModal("patientRecords")}>All Patient Records</ModalHeader>
          <ModalBody>
            {/* Content related to patient records */}
            <p>Display Patient Records here...</p>
          </ModalBody>
        </Modal>

        {/* Modal for View Payroll Information */}
        <Modal isOpen={modal.payrollInfo} toggle={() => toggleModal("payrollInfo")}>
          <ModalHeader toggle={() => toggleModal("payrollInfo")}>View Payroll Information</ModalHeader>
          <ModalBody>
            {/* Content related to payroll information */}
            <p>Display Payroll Information here...</p>
          </ModalBody>
        </Modal>

        {/* Modal for View Staff Performance */}
        <Modal isOpen={modal.staffPerformance} toggle={() => toggleModal("staffPerformance")}>
          <ModalHeader toggle={() => toggleModal("staffPerformance")}>View Staff Performance</ModalHeader>
          <ModalBody>
            {/* Content related to staff performance */}
            <p>Display Staff Performance here...</p>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <div>
      <AdminPage />
    </div>
  );
};

export default Admin;
