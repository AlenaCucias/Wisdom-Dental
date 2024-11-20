import React from "react";
//import { NavbarDesign } from "./NavbarDesign";
//import group19 from "./group-19.png";
//import rectangle4138 from "./rectangle-4138.svg";
//import "./style.css";

export const PatientDashboard = () => {
  return (
    <div className="patient-dashboard">
      <div className="div">
        <div className="group">
          <div className="div-2">
            <div className="text-wrapper">Patient Dashboard</div>

            <p className="description">
              Welcome back! View and manage your dental information here.
            </p>

            <div className="overlap">
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

              <div className="group-wrapper">
                <div className="group-2">
                  <div className="label-normal">
                    <div className="label-text">Patient</div>
                  </div>

                  <div className="title-2">John Doe</div>

                  <div className="avatar" />
                </div>
              </div>
            </div>

            <div className="overlap-2">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  {/*<img
                    className="rectangle"
                    alt="Rectangle"
                    src={rectangle4138}
                  />*/}

                  <div className="title-3">Upcoming Appointments</div>

                  <div className="list">
                    <div className="row">
                      <div className="item">
                        <div className="frame-2">
                          <p className="p">
                            Wednesday, October 16
                            <br /> 10 AM
                          </p>

                          <div className="subtitle">Dental Cleaning</div>
                        </div>
                      </div>

                      <div className="item">
                        <div className="frame-2">
                          <p className="p">
                            Friday, <br />
                            October 18
                            <br /> 2 PM
                          </p>

                          <div className="subtitle">Consultation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="primary">
                <div className="title-4">Schedule Appointment</div>
              </div>

              <div className="group-3" />
            </div>

            <div className="overlap-3">
              <div className="title-5">Payment Due</div>

              <div className="metric-wrapper">
                <div className="metric">
                  <div className="title-6">Total Fees</div>

                  <div className="data">$75.00</div>
                </div>
              </div>

              <div className="text-wrapper-3">View Details</div>
            </div>

            <div className="overlap-wrapper">
              <div className="div-wrapper">
                <div className="text-wrapper-4">View Dental History</div>
              </div>
            </div>

            <div className="overlap-group-4">
              <div className="text-wrapper-9">View X-Rays</div>
            </div>

            <div className="overlap-group-3">
              <div className="text-wrapper-5">View Treatment Plan</div>
            </div>

            {/*<img className="img" alt="Group" src={group19} />*/}

            <button className="primary-wrapper">
              <div className="title-wrapper">
                <div className="title-4">Make Payment</div>
              </div>
            </button>
          </div>
        </div>

        {/*<NavbarDesign
          arrow="image.svg"
          buttonNavigationPillLabel="Logout"
          className="navbar-design-2-final-for-now"
          websiteIconPic="image.png"
        />*/}
      </div>
    </div>
  );
};

export default PatientDashboard