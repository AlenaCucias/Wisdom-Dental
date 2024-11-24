import React from "react";
import { useState } from "react";
import { Modal, ModalHeader, ModalBody, FormGroup, Label, Button } from "reactstrap";

export const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="div">
        <div className="title">Admin Dashboard</div>

        <p className="description">
          Welcome back, John! View and manage Patient and Staff Information here.
        </p>

        <div className="rectangle" />

        {/* Existing All Patient Records button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button>All Patient Records</button>
            </div>
          </div>
        </div>

        {/* New View Payroll Information button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button>View Payroll Information</button>
              </div>
          </div>
        </div>

        {/* New View Staff Performance button */}
        <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button>View Staff Performance</button>
              </div>
          </div>
        </div>

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
