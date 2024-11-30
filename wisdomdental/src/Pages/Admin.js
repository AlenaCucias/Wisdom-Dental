import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";

export const AdminPage = () => {
  const [modal, setModal] = useState({
    patientRecords: false,
    payrollInfo: false,
    staffPerformance: false,
  });

  const toggleModal = (modalName) => {
    setModal((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });

  return (
    <div className="admin-page">
      <div className="text-buttons-wrapper">
        <div className="title">Admin Dashboard</div>
        <p className="description">
          Welcome back! View and manage Patient and Staff Information here.
        </p>

        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("patientRecords")}>
                All Patient Records
              </button>
            </div>
          </div>
        </div>

        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("payrollInfo")}>
                View Payroll Information
              </button>
            </div>
          </div>
        </div>

        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("staffPerformance")}>
                View Staff Performance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overlap">
        <div className="group-2">
          <div className="avatar" />
          <div className="label-normal">
            <div className="label-text">Admin</div>
          </div>
          <div className="title-2">{user?.First_Name || 'N/A'}{' '}{user?.Last_Name || 'N/A'}</div>
        </div>

        <p className="email-johndoe-gmail">
          <span className="span">Email: </span>
          <span className="text-wrapper-2">
            {user?.Email || 'N/A'}
            <br />
            <br />
          </span>
          <span className="span">Phone Number: <br /></span>
          <span className="text-wrapper-2">{user?.Phone_Number || 'N/A'}</span>
        </p>
      </div>

      {/* Modals for each button */}
      <Modal isOpen={modal.patientRecords} toggle={() => toggleModal("patientRecords")}>
        <ModalHeader toggle={() => toggleModal("patientRecords")}>All Patient Records</ModalHeader>
        <ModalBody>
          <p>Display Patient Records here...</p>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal.payrollInfo} toggle={() => toggleModal("payrollInfo")}>
        <ModalHeader toggle={() => toggleModal("payrollInfo")}>View Payroll Information</ModalHeader>
        <ModalBody>
          <p>Display Payroll Information here...</p>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal.staffPerformance} toggle={() => toggleModal("staffPerformance")}>
        <ModalHeader toggle={() => toggleModal("staffPerformance")}>View Staff Performance</ModalHeader>
        <ModalBody>
          <p>Display Staff Performance here...</p>
        </ModalBody>
      </Modal>
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
