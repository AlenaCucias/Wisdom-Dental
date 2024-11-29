import React, {useState, useEffect} from 'react'
import { Col, Row, Modal, ModalBody, FormGroup, Label, Button, ModalHeader } from 'reactstrap';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Core React component
import { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validatePayroll } from '../utils/validatePayroll';
import axios from 'axios';



const StaffDashboard = ({ user }) => {
  const [staffInfo, setStaffInfo] = useState(null);
  const [openPayroll, setOpenPayroll] = useState(false);
  const [error, setError] = useState(null);
  const [pay, setPay] = useState(user.Total_Pay);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(null);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/staff/upcoming_appointments', { user })
        const sortedAppointments = response.data
          .map((appointment) => {
            const [time, date] = appointment[2].split(' '); // Splitting "Time Date"
            const formattedDate = new Date(`${date}T${time}`); // Create a Date object
            return { ...appointment, formattedDate };
          })
          .sort((a, b) => a.formattedDate - b.formattedDate); // Sort by the Date object

        // Get the two soonest appointments
        setAppointments(sortedAppointments.slice(0, 2));
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

 

  const handleSubmit = async (values, { resetForm }) => {
    const timesheet =
    {
      hours: values.hours,
      procedure: values.procedure,
      performance: values.performance
    };
    const hours = values.hours;
    const procedure = values.procedure;
    const performance = values.performance;
    console.log(timesheet);
    try {
      const response = await axios.post('http://127.0.0.1:5000/staff/update_timesheet', { user, hours, procedure, performance });
      console.log(response);
      setPay(response.data.pay);
    } catch (error) {
      console.log("Error submitting timesheet: ", error);
      setError("An error occurred, please try again later.");
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        throw new Error(`Server responded with status ${error.response.status}: ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        throw new Error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        throw error;
      }
    }
    resetForm();
    setOpenPayroll(false);
  }

  const userName = user.First_Name;
  const userLast = user.Last_Name;
  const role = user.Role;
  const email = user.Email;
  const phone = user.Phone_Number;

  return (
    <div className='staff-dashboard'>
      <div className="overlap">
        <div className="title">Staff Dashboard</div>

        <p className="description">
          Welcome back, {user ? userName : 'User'}! View upcoming appointments and payroll here.
        </p>

        <div className="overlap">
          <Col>
            <div className="group" >
              <div className="group-2">
                <Row className='justify-content-center'>
                  <div>
                    <div className="label-normal ms-3">
                      <div className="label-text">Staff</div>
                    </div>
                    <div className="text-wrapper">{user && role === "Dentist" ? "Dr. " : ""}{user ? userName : 'Loading...'} {user ? userLast : ""}</div>
                    <div className="avatar ms-2" />
                  </div>
                </Row>
                <Row className='justify-content-center'>
                  <p className="email-johndoe-gmail">
                    <span className="span">Email: </span>

                    <span className="text-wrapper-2">
                      {user ? email : "Loading..."}
                      <br />
                      <br />
                    </span>

                    <span className="span">
                      Phone Number: <br />
                    </span>

                    <span className="text-wrapper-2">{user ? phone : "Loading..."}</span>
                  </p>
                </Row>


              </div>
            </div>
          </Col>

          <div>
            <div className="frame">
              <div className="overlap-group">
                <div className="reviews">

                  <div className="container">
                    <div className="title-2">Procedure Reviews</div>
                  </div>

                  <div className="list">
                    <div className="row">
                      <div className="card">
                        <div className="user">
                          <div className="avatar-2">
                            <div className="avatar-3" />

                            <div className="title-wrapper">
                              <div className="title-3 text-start">Sarah Johnson <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /></div>
                            </div>
                          </div>


                        </div>

                        <p className="p">Great service and friendly staff</p>
                      </div>

                      <div className="card">
                        <div className="user">
                          <div className="avatar-2">
                            <div className="avatar-3" />

                            <div className="title-wrapper">
                              <div className="title-3 text-start">Alex Chang <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /><FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} /></div>
                            </div>
                          </div>


                        </div>

                        <p className="p">
                          The best dental experience I’ve had!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data-metrics">
                  <div className="container-wrapper">
                    <div className="div-wrapper">
                      <div className="title-4">Qualifications Overview</div>
                    </div>
                  </div>

                  <div className="row-wrapper">
                    <div className="row-2">
                      <div className="metric">
                        <div className="title-5">Dental Degree</div>

                        <div className="data">DDS</div>

                        <div className="change">Updated</div>
                      </div>

                      <div className="metric">
                        <div className="title-5">Certifications</div>

                        <div className="data">Implantology</div>

                        <div className="change">Expires soon</div>
                      </div>

                      <div className="metric">
                        <div className="title-5">Years of Experience</div>

                        <div className="data">8</div>

                        <div className="change">Growing</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <div className="overlap-2">
            <div className="frame-2">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <div className="rectangle" />

                  <div className="list-2">
                    <div className="list-wrapper">
                      <div className="list-3">
                        <div className="row-3">
                          <Col className='item'>
                            {appointments.length === 0 ? (
                              <p>No upcoming appointments.</p>
                            ) : (
                              <div className='appt'>
                                {appointments.map((appointment, index) => (
                                  <div key={index} className='frame-3'>
                                    <strong className='title-6'>{appointment[0]}</strong><div className='subtitle'>{appointment[1] || 'N/A'}</div>
                                    <div className='subtitle-2'>{appointment[2]}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </Col>
                        </div>
                      </div>
                    </div>
                    <div className="container-2">
                      <div className="title-7">Upcoming Appointments</div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="text-wrapper-3">Logout</div>

              <div className="overlap-wrapper">
                <div className="overlap-3">
                  <div className="title-8">Payroll</div>

                  <div className="frame-4">
                    <div className="subtitle-3">$ {pay}</div>

                    <div className="text-wrapper-4">
                      Bi-weekly Salary To Date
                    </div>
                  </div>

                  <div className="overlap-group-3">
                    <Button
                      type='button'
                      className="btn shadow rounded"
                      onClick={() => setOpenPayroll(true)}
                    >
                      Add Time and Procedure
                    </Button>
                    <Modal isOpen={openPayroll} className='modal-dialog modal-dialog-centered modal-lg'>
                      <ModalHeader
                        toggle={() => setOpenPayroll(false)}
                      >
                        Enter Time Worked
                      </ModalHeader>
                      <ModalBody className='my-4 mx-4'>
                        <Formik
                          initialValues={{
                            hours: '',
                            procedure: '',
                            performance: '',
                          }}
                          onSubmit={handleSubmit}
                          validate={validatePayroll}
                        >
                          <Form>
                            <Row className='mb-2'>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='hours'>Input Time (hours:minutes)</Label>
                                  <Field
                                    id="hours"
                                    name="hours"
                                    placeholder="Enter Hours:Minutes (hh:mm)"
                                    className="form-control"
                                  />
                                  <ErrorMessage name='hours'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                  </ErrorMessage>
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='procedure'>Input Procedure</Label>
                                  <Field
                                    id='procedure'
                                    name='procedure'
                                    placeholder='Enter Procedure'
                                    className='form-control'
                                  />
                                  <ErrorMessage name='procedure'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                  </ErrorMessage>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className='mb-4'>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='performance'>Input Performance (enter number 1-5)</Label>
                                  <Field
                                    id='performance'
                                    name='performance'
                                    placeholder='Enter Performance'
                                    className='form-control'
                                  />
                                  <ErrorMessage name='performance'>
                                    {(msg) => <p className='text-danger text-start'>{msg}</p>}
                                  </ErrorMessage>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className='col-6 mx-auto'>
                              <Button
                                className='btn rounded shadow'
                                type='submit'
                              >
                                Submit
                              </Button>
                            </Row>
                          </Form>
                        </Formik>
                      </ModalBody>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>

            <div className="frame-5">
              <div className="overlap-4">
                <div className="rectangle-3" />

                <div className="data-metrics-2">
                  <div className="container-3">
                    <div className="container-4">
                      <div className="title-10">Treatment Times</div>
                    </div>
                  </div>

                  <div className="list-4">
                    <div className="row-4">
                      <div className="metric-2">
                        <div className="title-11">Dental Cleaning</div>

                        <div className="data-2">45 mins</div>
                      </div>

                      <div className="metric-2">
                        <div className="title-11">Tooth Extraction</div>

                        <div className="data-2">90 mins</div>
                      </div>
                    </div>

                    <div className="row-4">
                      <div className="metric-2">
                        <div className="title-11">Root Canal</div>

                        <div className="data-2">120 mins</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rectangle-4" />

      </div>
    </div >
  )
}

export default StaffDashboard