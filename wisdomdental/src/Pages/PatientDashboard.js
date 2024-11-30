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
  const [successfulPaymentModalOpen, setSuccessfulPaymentModalOpen] = useState(false);
  const [appointmentConfirmationModalOpen, setAppointmentConfirmationModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [reason, setReason] = useState(''); // State to capture the reason
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [upcomingAppointmentsModalOpen, setUpcomingAppointmentsModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For rescheduling/canceling
  const [dentalHistory, setDentalHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalCost, setTotalCost] = useState(null);

  
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });

  useEffect(() => {
    // Fetch upcoming appointments and available appointments
    fetchUpcomingAppointments();
    fetchAvailableAppointments();
  }, []);

  useEffect(() => { 
    const userDetails = JSON.parse(sessionStorage.getItem('user')); 
    console.log('User Details: ', userDetails)
    if (userDetails) { 
      setUser(userDetails); 
    } 
  }, []); 

  useEffect(() => {
    const fetchTotalCost = async () => {
      const patientId = user?.Patient_ID;
      try {
        const response = await axios.get('http://127.0.0.1:5000/patients/get_total_cost', {
          params: { patient_id: patientId }, // Replace with the logged-in user's ID
        });
        if (response.status === 200) {
          setTotalCost(response.data.total_cost || 0);
          console.log("Total Cost Fetched:", response.data.total_cost);
        }
      } catch (error) {
        console.error("Error fetching total cost:", error);
      }
    };
    fetchTotalCost();
  }, [user]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const patientId = user?.Patient_ID;
      try {
        const response = await axios.get('http://127.0.0.1:5000/patients/get_payment_history', {
          params: { patient_id: patientId }, // Replace with the logged-in user's ID
        });
        if (response.status === 200) {
          setPaymentHistory(response.data.payments || []);
          console.log("Payment History Fetched:", response.data.payments);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    const fetchDentalHistory = async () => {
      const patientId = user?.Patient_ID;
      try {
        const response = await axios.get('http://127.0.0.1:5000/patients/get_dental_history', {
          params: { patient_id: patientId }, // Replace with the logged-in user's ID
        });
        if (response.status === 200) {
          setDentalHistory(response.data.appointments || []);
          console.log("Dental History Fetched:", response.data.appointments);
        }
      } catch (error) {
        console.error("Error fetching dental history:", error);
      }
    };
    fetchDentalHistory();
  }, []);
  
  const fetchUpcomingAppointments = async () => {
    const patientId = user?.Patient_ID;
    try {
      const response = await axios.get('http://127.0.0.1:5000/patients/get_upcoming_appointments', {
        params: { patient_id: patientId }, // Replace with the logged-in user's ID
      });
      if (response.status === 200) {
        setUpcomingAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
    }
  };

  const sortedAppointments = upcomingAppointments.sort((a,b) => {
    return new Date(a.date) - new Date(b.data);
  })
  
  
  if (!user) { 
    return <div>Loading...</div>;
  }

  const formatDate = (dataString) => {
    const [month, day, year] = dataString.split('-');
    const date = new Date(year, month-1, day);
    const options = {year: 'numeric', month:'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  }

  //used to fetch availabe appointments
  const fetchAvailableAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/patients/get_available_appointments');
      if (response.status === 200) {
        setAppointments(response.data.available_slots || []);
      }
    } catch (error) {
      console.error("Error fetching available appointments:", error);
    }
  };
 
  const switchToReason = () => {
    setScheduleAppointmentModalOpen(false);
    setReasonModalOpen(true);
  }

  const switchToAppointmentConfirmation = () => {
    setReasonModalOpen(false);
    setAppointmentConfirmationModalOpen(true);
  }
  
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
    setSelectedDate(date);
    setSelectedTime(time);
    setScheduleAppointmentModalOpen(false); // Close the time slots modal
    setReasonModalOpen(true); // Open reason input modal
  };

  const handleSubmitReason = () => {
    if (!reason) {
      alert('Please enter a reason for the appointment.');
      return;
    }

    const requestData = {
      patient_id: user['Patient_ID'],
      date: selectedDate,
      time: selectedTime,
      notes: reason,
    };

    axios
      .post('http://127.0.0.1:5000/patients/book_appointment', requestData)
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          setReason('');
          fetchUpcomingAppointments();
          fetchAvailableAppointments();  // Refresh available slots
          setReasonModalOpen(false);
        } else {
          alert(response.data.error || 'Failed to book the appointment');
        }
      })
      .catch((error) => {
        console.error('Error booking appointment:', error);
        alert('An error occurred while booking the appointment.');
      });
  };


  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleCancelClick = (appointmentId) => {
    const appointmentData = {
      appointment_id: appointmentId,
      patient_id: user.Patient_ID,  // Assuming this is how you access the logged-in patient's ID
    };
  
    axios
      .post("http://127.0.0.1:5000/patients/cancel_appointment", appointmentData)
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);  // Success message
          setRescheduleModalOpen(false); // Close the reschedule modal
          fetchUpcomingAppointments();
            // Refresh appointments
        } else {
          alert(response.data.error);  // Error message
        }
      })
      .catch((error) => {
        console.error("There was an error canceling the appointment:", error);
      });
  };

  const handleRescheduleSubmit = () => { 
    if (!selectedDate || !selectedTime) {
      alert("Please select a valid date and time to reschedule.");
      return;
    }
  
    const requestData = {
      patient_id: user.Patient_ID, // Assuming this is correct
      old_date: selectedAppointment.date,  // The original appointment's date
      old_time: selectedAppointment.time,  // The original appointment's time
      new_date: selectedDate,  // The new selected date
      new_time: selectedTime,  // The new selected time
      new_notes: "Rescheduled Appointment",  // Optional notes for the new appointment
    };
  
    axios
      .post("http://127.0.0.1:5000/patients/reschedule_appointment", requestData)
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message); // Success message
          setRescheduleModalOpen(false); // Close modal
          setRescheduleModalOpen(false); // Close the reschedule modal
          fetchUpcomingAppointments(); // Refresh the appointment list
        } else {
          alert(response.data.error); // Error message
        }
      })
      .catch((error) => {
        console.error("There was an error rescheduling the appointment:", error);
      });
  };

  return (
    <div className="patient-dashboard">
      <div className="div">
        <div className="group">
          <div className="div-2">
            <div className="text-wrapper">Patient Dashboard</div>

            <p className="description">
              Welcome back {user?.First_Name}! View and manage your dental information here.
            </p>

            <div className="overlap">
            <p className="email-johndoe-gmail">
  <span className="span">Email: </span>
  <span className="text-wrapper-1">{user?.Email || 'N/A'}</span>
  <br />
  <br />
  <span className="span">Phone Number: </span>
  <span className="text-wrapper-6">{user?.Phone_Number || 'N/A'}</span>
</p>

<div className="group-wrapper">
  <div className="group-2">
    <div className="label-normal">
      <div className="label-text">Patient</div>
    </div>
    <div className="text-wrapper-2">{user?.First_Name || 'N/A'}{' '}{user?.Last_Name || 'N/A'}</div>
                  <div className="avatar" />
                </div>
              </div>
            </div>

            <div className="overlap-2">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">

                <div className="title-3" onClick={() => setUpcomingAppointmentsModalOpen(true)}>
              Upcoming Appointments
            </div>
            
            {/* Upcoming Appointments Modal */}
            <Modal
        isOpen={upcomingAppointmentsModalOpen}
        className="modal-dialog modal-dialog-centered modal-sm"
      >
        <ModalHeader toggle={() => setUpcomingAppointmentsModalOpen(false)}>
          Upcoming Appointments
        </ModalHeader>
        <ModalBody>
          {Array.isArray(upcomingAppointments) && upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.appointment_id} className="item" style={{ marginBottom: '25px'}}>
                <div className="frame-2" style={{ textAlign: 'center'}}>
                <Col className="d-flex flex-column align-items-center justify-content-center">
                  <Row>{appointment.treatment || "General Consultation"}</Row>
                  <Row>{formatDate(appointment.date)}</Row>
                  <Row style={{ marginBottom: '10px'}}>{appointment.time}</Row>
                </Col>
                  <Button
                    className="btn shadow rounded primary flex-grow-1"
                    onClick={() => handleRescheduleClick(appointment)}
                    style={{ marginRight: '10px', width: '110px'}}
                  >
                    Reschedule
                  </Button>
                  <Button
                    className="btn shadow rounded danger"
                    onClick={() => handleCancelClick(appointment.appointment_id)}
                    style={{ width: '110px'}}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming appointments at the moment.</p>
          )}
        </ModalBody>
      </Modal>
            {/* Reschedule Modal */}
            <Modal isOpen={rescheduleModalOpen} className="modal-dialog modal-dialog-centered modal-lg">
  <ModalHeader toggle={() => setRescheduleModalOpen(false)}>Reschedule Appointment</ModalHeader>
  <ModalBody>
    {Object.keys(appointments).length > 0 ? (
      Object.keys(appointments).map((date) => (
        <div key={date} style={{ marginBottom: "20px" }}>
          <p>{formatDate(date)}</p>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px", listStyleType: "none" }}>
            {appointments[date].map((time, index) => (
              <li key={index}>
                <button
                  className="btn shadow rounded primary"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(time);
                  }}
                >
                  {time}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p>No available slots to reschedule.</p>
    )}
    {selectedDate && selectedTime && (
      <div>
        <p>Selected Date: {formatDate(selectedDate)}</p>
        <p>Selected Time: {selectedTime}</p>
      </div>
    )}
    <div className="d-flex justify-content-center" style={{ marginTop: "20px"}}>
    <Button
      className="btn shadow rounded primary "
      onClick={handleRescheduleSubmit}
      style={{ marginTop: "20px" }}
    >
      Confirm Reschedule
    </Button>
    </div>
  </ModalBody>
</Modal>
                  <div className="list">
                    {sortedAppointments.length == 0 ? (
                      <p>No uncoming appointments at the moment</p>
                    ) : (
                    <div className="row">
                      {sortedAppointments.map((appointment, index) => (
                      <div className="item" key={index}>
                        <div className="frame-2">
                          <p className="p">
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                            })}
                            <br />
                            {appointment.time}
                          </p>
                          <div className="subtitle">{appointment.treatment || "General Consultation"}</div>
                        </div>
                      </div>
                      ))}
                    </div>
                    )}
                  </div>
                </div>
              </div>
              <button
         className="btn shadow rounded primary" onClick={() => setScheduleAppointmentModalOpen(true)}>
        <div className="title-4">Schedule Appointment</div>
      </button>

      <Modal isOpen={scheduleAppointmentModalOpen} className="modal-dialog modal-dialog-centered modal-lg">
        <ModalHeader toggle={() => setScheduleAppointmentModalOpen(false)}>Schedule Appointment</ModalHeader>
        <ModalBody>
          {Object.keys(appointments).length > 0 ? (
            Object.keys(appointments).map((date) => (
              <div key={date} style={{ marginBottom: '20px' }}>
                <p>{formatDate(date)}</p>
                <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0, listStyleType: 'none', gap: '10px' }}>
                  {appointments[date].map((time, index) => (
                    <li key={index} style={{ flex: '0 1 auto', marginBottom: '10px' }}>
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
        </ModalBody>
      </Modal>

      <Modal isOpen={reasonModalOpen} className="modal-dialog modal-dialog-centered modal-md">
        <ModalHeader toggle={() => setReasonModalOpen(false)}>Provide a Reason</ModalHeader>
        <ModalBody>
          <Row>
            <Label htmlFor="reason" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
              Provide a brief description to help the medical staff prepare for your appointment
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for visit"
              style={{ width: '80%', height: '150px', margin: '0 auto' }}
            />
          </Row>
          <Row className="col-6 mx-auto">
            <Button onClick={handleSubmitReason} style={{ marginTop: '20px' }} className="btn rounded shadow">
              Confirm Appointment
            </Button>
          </Row>
        </ModalBody>
      </Modal>

      <Modal isOpen={appointmentConfirmationModalOpen} className="modal-dialog modal-dialog-centered modal-md">
        <ModalHeader toggle={() => setAppointmentConfirmationModalOpen(false)}>Appointment Confirmation</ModalHeader>
        <ModalBody>Your appointment has been confirmed!</ModalBody>
      </Modal>
              <div className="group-3" />
            </div>

            <div className="overlap-3">
              <div className="title-5">Payment Due</div>

              <div className="metric-wrapper">
                <div className="metric">
                  <div className="title-6">Total Fees</div>

                  <div className="data">{totalCost !== null ? `$${totalCost.toFixed(2)}` : "Loading..."}</div>
                </div>
              </div>
                
                <div className="text-wrapper-3" onClick={() => setViewDetailsModalOpen(true)}>View Details</div>
            </div>
            
            <Modal isOpen={viewDetailsModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setViewDetailsModalOpen(false)}>Payment History</ModalHeader>
              <ModalBody>
              {paymentHistory.length > 0 ? (
                  <table style={{ width: "100%", textAlign: "center"}}>
                    <thead>
                      <tr>
                        <th style={{ width: "10%", textAlign: "center", padding: "10px"}}>Date</th>
                        <th style={{ width: "30%", textAlign: "center", padding: "10px", paddingLeft: "60px"}}>Treatment</th>
                        <th style={{ width: "20%", textAlign: "center", padding: "10px"}}>Cost</th>
                        <th style={{ width: "10%", textAlign: "center", padding: "10px"}}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {paymentHistory.map((payments, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px"}}>{formatDate(payments[0])}</td>
                        <td style={{paddingLeft: "60px"}}> {payments[1]}</td>
                        <td> ${Number(payments[2]).toFixed(2)}</td>
                        <td> {payments[3] === "TRUE" ? "Paid" : "Not Paid"}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No payment history at the moment</p>
                )}
              </ModalBody>
            </Modal>

            <button className="btn shadow rounded overlap-wrapper"
              onClick={() => setViewDentalHistroyModalOpen(true)}>
                <div className="text-wrapper-4">View Dental History</div>
            </button>

            <Modal isOpen={viewDentalHistoryModalOpen} className='modal-dialog modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setViewDentalHistroyModalOpen(false)}>Dental History</ModalHeader>
              <ModalBody>
                {dentalHistory.length > 0 ? (
                  <table style={{ width: "100%", textAlign: "center"}}>
                    <thead>
                      <tr>
                        <th style={{ width: "25%", textAlign: "center", padding: "10px"}}>Date</th>
                        <th style={{ width: "50%", textAlign: "center", padding: "10px"}}>Treatment</th>
                        <th style={{ width: "75%", textAlign: "center", padding: "10px"}}>Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                    {dentalHistory.map((appointments, index) => (
                      <tr key={index}>
                        <td style={{padding: "10px"}}>{formatDate(appointments[0])}</td>
                        <td>{appointments[1]}</td>
                        <td>{appointments[2]}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No dental history at the moment</p>
                )}
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
                {user?.Treatment_Plan || "No treatment plan at the moment"}
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

            <Modal isOpen={successfulPaymentModalOpen} className='modal-dialog modal-dialog-centered modal-md'>
              <ModalHeader toggle={() => setSuccessfulPaymentModalOpen(false)}>Payment Confirmation</ModalHeader>
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