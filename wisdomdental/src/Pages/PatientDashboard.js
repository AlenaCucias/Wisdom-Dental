import React from "react";
import {useState} from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
//import { NavbarDesign } from "./NavbarDesign";
//import group19 from "./group-19.png";
//import rectangle4138 from "./rectangle-4138.svg";
//import "./style.css";

export const PatientDashboard = () => {
  const [scheduleAppointmentModalOpen, setScheduleAppointmentModalOpen] = useState(false);
  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);
  const [viewTreatmentPlanModalOpen, setViewTreatmentPlanModalOpen] = useState(false);
  const [viewXrayModalOpen, setViewXrayModalOpen] = useState(false);
  const [viewDentalHistoryModalOpen, setViewDentalHistroyModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [upcomingAppointemntsModalOpen, setUpcomingAppointmentsModalOpen] = useState(false);
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

                  <button onClick={() => setUpcomingAppointmentsModalOpen(true)}>
                    <div className="title-3">Upcoming Appointments</div>
                  </button>

                  <Modal isOpen={upcomingAppointemntsModalOpen}>
                    <ModalHeader toggle ={() => setUpcomingAppointmentsModalOpen(false)}>Upcoming Appointments</ModalHeader>
                    <ModalBody>
                      No upcoming appointments at the moment
                    </ModalBody>
                  </Modal>

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

              <button className ="btn shadow rounded primary"
                onClick={() => setScheduleAppointmentModalOpen(true)}>
                  <div className="title-4"> Schedule Appointment</div>
              </button>

              <Modal isOpen={scheduleAppointmentModalOpen}>
                <ModalHeader toggle={() => setScheduleAppointmentModalOpen(false)}>Schedule Appointment</ModalHeader>
                <ModalBody>
                  test
                </ModalBody>
              </Modal>

              <div className="group-3" />
            </div>

            <div className="overlap-3">
              <div className="title-5">Payment Due</div>

              <div className="metric-wrapper">
                <div className="metric">
                  <div className="title-6">Total Fees</div>

                  <div className="data">$0.00</div>
                </div>
              </div>
                
              
              <button onClick={() => setViewDetailsModalOpen(true)}>
                <div className="text-wrapper-3">View Details</div>
              </button>

              <Modal isOpen={viewDetailsModalOpen}>
                <ModalHeader toggle={() => setViewDetailsModalOpen(false)}>Payment History</ModalHeader>
                <ModalBody>
                  No payment history at the moment
                </ModalBody>
              </Modal>

            </div>

            <button className="btn shadow rounded overlap-wrapper"
              onClick={() => setViewDentalHistroyModalOpen(true)}>
              {/*<div className="div-wrapper">*/}
                <div className="text-wrapper-4">View Dental History</div>
              {/*</div>*/}
            </button>

            <Modal isOpen={viewDentalHistoryModalOpen}>
              <ModalHeader toggle={() => setViewDentalHistroyModalOpen(false)}>Dental History</ModalHeader>
              <ModalBody>
                No dental history at the moment
              </ModalBody>
            </Modal>

            <button className="btn shadow rounded overlap-group-4"
              onClick={() => setViewXrayModalOpen(true)}>
              <div className="text-wrapper-9">View X-Rays</div>
            </button>

            <Modal isOpen={viewXrayModalOpen}>
              <ModalHeader toggle={() => setViewXrayModalOpen(false)}>X-ray</ModalHeader>
              <ModalBody>
                image
              </ModalBody>
            </Modal>

            <button className="btn shadow rounded overlap-group-3"
              onClick={() => setViewTreatmentPlanModalOpen(true)}>
                <div className="text-wrapper-5">View Treatment Plan</div>
            </button>

            <Modal isOpen={viewTreatmentPlanModalOpen}>
              <ModalHeader toggle={() => setViewTreatmentPlanModalOpen(false)}>Treatment Plan</ModalHeader>
              <ModalBody>
                No treatment plan at the moment
              </ModalBody>
            </Modal>

            {/*<img className="img" alt="Group" src={group19} />*/}

            <button className="btn shadow rounded primary-wrapper"
              onClick={() => setMakePaymentModalOpen(true)}>
              {/*<div className="primary-wrapper">*/}
                {/*<div className="title-wrapper">*/}
                  <div className="title-4">Make Payment</div>
                {/*</div>*/}
              {/*</div>*/}
            </button>

            <Modal isOpen={makePaymentModalOpen}>
              <ModalHeader toggle={() => setMakePaymentModalOpen(false)}>Make Payment</ModalHeader>
              <ModalBody>
                test
              </ModalBody>
            </Modal>
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