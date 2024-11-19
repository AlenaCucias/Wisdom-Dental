import React from "react";
// import group9 from "./group-9.png";
// import group15 from "./group-15.png";
// import "./style.css";

// AdminPage component
export const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="div">
        <div className="title">Admin Dashboard</div>

        <p className="description">
          Welcome back, John! View and manage Patient and Staff Information
          here.
        </p>

        <div className="rectangle" />

        {/* <img className="group" alt="Group" src={group9} /> */}

        {/* <img className="img" alt="Group" src={group15} /> */}

        <div className="group-wrapper">
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <div className="text-wrapper">All Patient Records</div>
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

            <span className="span">
              Phone Number: <br />
            </span>

            <span className="text-wrapper-2">+1(123) 456-7890</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Default export for Admin component
const Admin = () => {
  return (
    <div>
      <AdminPage />
    </div>
  );
};

export default Admin;
