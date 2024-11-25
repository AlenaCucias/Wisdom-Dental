import React from "react";
import {useEffect, useState} from 'react';
import {Row, Col, FormGroup, Label, Modal, ModalHeader, ModalBody, Button} from "reactstrap";
import { Formik, Field, Form } from "formik";
import axios from 'axios';

export const PatientDashboard = () => {
  const [scheduleAppointmentModalOpen, setScheduleAppointmentModalOpen] = useState(false);
  const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);
  const [viewTreatmentPlanModalOpen, setViewTreatmentPlanModalOpen] = useState(false);
  const [viewXrayModalOpen, setViewXrayModalOpen] = useState(false);
  const [viewDentalHistoryModalOpen, setViewDentalHistroyModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [upcomingAppointemntsModalOpen, setUpcomingAppointmentsModalOpen] = useState(false);
  const [successfulPaymentModalOpen, setSuccessfulPaymentModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState(''); // State to capture the reason


  //used to fetch availabe appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_available_appointments');
      if (response.status === 200) {
        console.log(response.data);
        setAppointments(response.data.available_slots); // Assuming the response is in { available_slots: {...} } format
      } else {
        console.error("Failed to fetch appointments:", response);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [])
  
  const handleSubmit = async (values) => {
    const paymentForm = {
      cardNumber: values.cardNumber,
      expirationDate: values.expirationDate,
      cvv: values.cvv,
      cardName: values.cardName
    }
      console.log(paymentForm);
      //Close the payment modal and open the success modal
      setMakePaymentModalOpen(false);
      setSuccessfulPaymentModalOpen(true);
  };
  const handleTimeSlotClick = (date, time) => {
    const userConfirmed = window.confirm(`Are you sure you want to book the appointment for ${date} at ${time}?`);
  
    if (userConfirmed) {
      // Proceed to send the reason and book the appointment
      bookAppointment(date, time, reason)
        .then(response => {
          alert(`Appointment booked successfully for ${date} at ${time}.`);
          setScheduleAppointmentModalOpen(false); // Close the modal after booking
          setReason(''); // Reset the reason input field
        })
        .catch(error => {
          alert('Error booking the appointment. Please try again later.');
        });
    }
  };
  const bookAppointment = (date, time, reason) => {
  return fetch('/book_appointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user:  // Add patient info here
      date,
      time,
      notes: reason,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`Appointment booked for ${date} at ${time}`);
      return `Appointment booked successfully`;
    } else {
      throw new Error(data.message || 'Booking failed');
    }
  })
  .catch(error => {
    alert(`Error booking appointment: ${error.message}`);
  });
};
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

                  <button onClick={() => setUpcomingAppointmentsModalOpen(true)}>
                    <div className="title-3">Upcoming Appointments</div>
                  </button>

                  <Modal isOpen={upcomingAppointemntsModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
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
              <button
        className="btn shadow rounded primary"
        onClick={() => setScheduleAppointmentModalOpen(true)}
      >
        <div className="title-4">Schedule Appointment</div>
      </button>

      <Modal
        isOpen={scheduleAppointmentModalOpen}
        className="modal-dialog modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setScheduleAppointmentModalOpen(false)}>
          Schedule Appointment
        </ModalHeader>
        <ModalBody>
          {Object.keys(appointments).length > 0 ? (
            Object.keys(appointments).map((date) => (
              <div key={date}>
                <p>{date}</p>
                <ul>
                  {appointments[date].map((time, index) => (
                    <li key={index}>
                      <button
                        className="btn shadow rounded primary"
                        onClick={() => handleTimeSlotClick(date, time)}
                      >
                        {time}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No available appointments at the moment</p>
          )}

          {/* Input for the reason */}
          <div>
            <label htmlFor="reason">Reason for Appointment:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for visit"
            />
          </div>
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
             
                    

                  
  
            </div>

            <button className="btn shadow rounded overlap-wrapper"
              onClick={() => setViewDentalHistroyModalOpen(true)}>
                <div className="text-wrapper-4">View Dental History</div>
            </button>

            <Modal isOpen={viewDentalHistoryModalOpen} className='modal-dialog modal-dialog-centered modal-md'>
              <ModalHeader toggle={() => setViewDentalHistroyModalOpen(false)}>Dental History</ModalHeader>
              <ModalBody>
                <Row>
                  <Col>Date</Col>
                  <Col>Treatment</Col>
                  <Col>Doctor</Col>
                </Row>
              </ModalBody>
            </Modal>

            <button className="btn shadow rounded overlap-group-4"
              onClick={() => setViewXrayModalOpen(true)}>
              <div className="text-wrapper-9">View X-Rays</div>
            </button>

            <Modal isOpen={viewXrayModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setViewXrayModalOpen(false)}>X-ray</ModalHeader>
              <ModalBody>
                image
              </ModalBody>
            </Modal>

            <button className="btn shadow rounded overlap-group-3"
              onClick={() => setViewTreatmentPlanModalOpen(true)}>
                <div className="text-wrapper-5">View Treatment Plan</div>
            </button>

            <Modal isOpen={viewTreatmentPlanModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setViewTreatmentPlanModalOpen(false)}>Treatment Plan</ModalHeader>
              <ModalBody>
                No treatment plan at the moment
              </ModalBody>
            </Modal>

            {/*<img className="img" alt="Group" src={group19} />*/}

            <button className="btn shadow rounded primary-wrapper"
              onClick={() => setMakePaymentModalOpen(true)}>
                <div className="title-4">Make Payment</div>
            </button>

            <Modal isOpen={makePaymentModalOpen} className='modal-dialog modal-dialog-centered modal-md'>
              <ModalHeader toggle={() => setMakePaymentModalOpen(false)}>Make Payment</ModalHeader>
              <ModalBody>
                  <Formik 
                    initialValues={{
                      cardNumber: '',
                      expirationDate: '',
                      cvv: '',
                      cardName: '',
                    }}
                    onSubmit={handleSubmit}>
                      <Form>
                        <Col className='mb-4'>
                          <Row>
                            <FormGroup>
                              <Label htmlFor='cardNumber'>Card Number</Label>
                              <Field
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="Enter card number"
                              className="form-control"/>
                            </FormGroup>
                          </Row>
                          
                          <Row>
                            <FormGroup>
                              <Label htmFor='expirationDate'>Expiration Date</Label>
                              <Field
                              id="expirationDate"
                              name="expirationDate"
                              placeholder="Enter MM/YY"
                              className="form-control"/>
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup>
                              <Label htmFor='cvv'>CVV</Label>
                              <Field
                              id="cvv"
                              name="cvv"
                              placeholder="Enter CVV"
                              className="form-control"/>
                            </FormGroup>
                          </Row>

                          <Row>
                            <FormGroup>
                              <Label htmFor='cardName'>Name on card</Label>
                              <Field
                              id="cardName"
                              name="cardName"
                              placeholder="Enter name on card"
                              className="form-control"/>
                            </FormGroup>
                          </Row>
                        </Col>

                        <Row className='col-6 mx-auto'>
                          <Button
                            className='btn rounded shadow'
                            type='submit'>
                              Pay Now
                            </Button>
                          </Row>
                      </Form>
                    </Formik>
              </ModalBody>
            </Modal>

            <Modal isOpen={successfulPaymentModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setSuccessfulPaymentModalOpen(false)}>Thank you for your payment</ModalHeader>
              <ModalBody>
                Your transaction has been successfully processed
              </ModalBody>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard