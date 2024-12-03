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
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [topProcedures, setTopProcedures] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [treatmentID, setTreatmentID] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [openTreatment, setOpenTreatment] = useState(false);
  const [patientNames, setPatientNames] = useState([]);
  const [apptTime, setApptTime] = useState([]);

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
        const soonestAppt = sortedAppointments.slice(0, 2);
        setAppointments(soonestAppt);

        const ids = soonestAppt.map((appt) => appt[3]);
        setTreatmentID(ids);
        const names = soonestAppt.map((appt) => appt[0]);
        setPatientNames(names);
        const times = soonestAppt.map((appt) => appt[2]);
        setApptTime(times);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

  useEffect(() => {
    const fetchPerformance = async () => {
      const userID = user.Staff_ID;
      try {
        const response = await axios.post('http://127.0.0.1:5000/staff/get_performance', { userID });
        const sortedData = response.data
          .map((review) => ({
            date: new Date(review[0]),
            procedure: review[1],
            time: parseFloat(review[2]),
            performance: review[3],
          }))
          .sort((a, b) => b.date - a.date);

          const recentReviews = sortedData.slice(0, 2);
          setPerformanceReviews(recentReviews);

          const procedureStats = sortedData.reduce((acc, { procedure, time}) => {
            if(!acc[procedure]) {
              acc[procedure] = { totalTime: 0, count: 0 };
            }
            acc[procedure].totalTime += time;
            acc[procedure].count += 1;
            return acc;
          }, {});

          const procedureArray = Object.keys(procedureStats).map(procedure => {
            const { totalTime, count } = procedureStats[procedure];
            const avgTime = totalTime / count;
            return { procedure, avgTime, count };
          });

          const topThreeProcedures = procedureArray
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

          setTopProcedures(topThreeProcedures);


      } catch(error) {
        console.error('Error fetching performance data:', error);
      }
    };
    fetchPerformance();
  },[user]);

  useEffect(() => {
    const fetchQualifications = async () => {
      const userID = user.Staff_ID;
      try {
        const response = await axios.post('http://127.0.0.1:5000/staff/get_qualifications', { userID });
        const info = response.data
          .map((qualifcation) => ({
            degree: qualifcation[0],
            certification: qualifcation[1],
            experience: qualifcation[2],
          }))
        setQualifications(info);
        }catch(error) {
          console.error("error fetching qualifications: ", error);
      }
    };
    fetchQualifications();
  },[user])

  const handleSubmit = async (values, { resetForm }) => {
    const timesheet =
    {
      hours: values.hours,
      procedure: values.procedure,
      performance: values.performance,
      apptTime: values.apptTime, 
    };
    const hours = values.hours;
    const procedure = values.procedure;
    const performance = values.performance;
    const apptTime = values.apptTime;
    console.log(timesheet);
    try {
      const response = await axios.post('http://127.0.0.1:5000/staff/update_timesheet', { user, hours, procedure, performance, apptTime });
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

  const handleTreatment = async () => {
    const id1 = treatmentID[0];
    const id2 = treatmentID[1];
    console.log({ id1, id2 });  // Check if the values are correct


    try{
      const response = await axios.post('http://127.0.0.1:5000/staff/get_treatment_details', { id1, id2 });
      console.log(response.data);
      const details = response.data.map((description, index) => ({
          treatment_ID: treatmentID[index],
          patientName: patientNames[index],
          appt_Time: apptTime[index],
          treatmentDetails: description
        }))
      setTreatment(details);
    } catch(error) {
      console.error("error fetch treatment details: ", error)
    }
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
                  <div className="staff-profile">
                    <div className="avatar-container">
                      <div className="avatar" />
                    </div>
                    <div className="text-wrapper">{user && role === "Dentist" ? "Dr. " : ""}{user ? userName : 'Loading...'} {user ? userLast : ""}</div>
                    <div className="label-normal">
                      <div className="label-text">Staff</div>
                    </div>
                  </div>
                  <div className="email-johndoe-gmail">
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
                  </div>
              </div>
            </div>
          </Col>
          <div className='mt-3'>
            <div className="frame">
              <div className="overlap-group">
                <div className="reviews">
                  <div className="container">
                    <div className="title-2 mt-2">Procedure Reviews</div>
                  </div>
                  <div className="list performance-reviews">
                    <div className="row ms-3 mt-2">
                        {performanceReviews.map((review, index) => (
                          <div className="card my-auto">
                            <div key={index} className='review'>
                              <div className="user">
                                <div className="avatar-2">
                                  <div className="title-wrapper">
                                    <div className="text-center mb-1 subtitle-2">{review.procedure}</div>
                                    <div className="title-3 text-center">{review.date.toDateString()}</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {[...Array(review.performance)].map((_, starIndex) => (
                                  <FontAwesomeIcon key={starIndex} icon={faStar} style={{color: 'gold' }} className='mb-1'/>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
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
                      {qualifications.map((qualifcation, index) => (
                        <div className="row-2">
                          <div className="metric">
                            <div className="title-5">Degree</div>
                            <div className="data">{qualifcation.degree}</div>
                          </div>
                          <div className="metric">
                            <div className="title-5">Certification</div>
                            <div className="data">{qualifcation.certification}</div>
                          </div>
                          <div className="metric">
                            <div className="title-5">Years of Experience</div>
                            <div className="data">{qualifcation.experience}</div>
                          </div>
                        </div>
                      ))}
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
                      <div
                        className='title-9 mb-1' 
                        onClick={() => {
                          handleTreatment()
                          setOpenTreatment(true);
                        }}
                      >
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal isOpen={openTreatment} className='modal-dialog modal-dialog-centered modal-lg'>
                <ModalHeader toggle={() => setOpenTreatment(false)}>
                  Treatment Details
                </ModalHeader>
                  <ModalBody className='my-3'>
                    {treatment.map((item, index) => (
                      <div>
                        <Row className='bg-secondary'>
                          <Col style={{color: 'white'}}>Treatment Number: </Col>
                          <Col style={{color: 'white'}}>{item.treatment_ID}</Col>
                        </Row>
                        <Row>
                          <Col>Patient Name: </Col>
                          <Col>{item.patientName}</Col>
                        </Row>
                        <Row>
                          <Col>Appointment Time: </Col>
                          <Col>{item.appt_Time}</Col>
                        </Row>
                        <Row>
                          <Col>Treatment Details: </Col>
                          <Col>{item.treatmentDetails}</Col>
                        </Row>
                      </div>
                    ))}
                    
                  </ModalBody>
              </Modal>
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
                            apptTime: '',
                          }}
                          onSubmit={handleSubmit}
                          validate={validatePayroll}
                        >
                          <Form>
                            <Row className='mb-2'>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='hours'>Input Time (HH:MM)</Label>
                                  <Field
                                    id="hours"
                                    name="hours"
                                    placeholder="Enter Hours:Minutes (HH:MM)"
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
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='apptTime'>Input Appointment Time (HH:MM)</Label>
                                  <Field
                                    id='apptTime'
                                    name='apptTime'
                                    placeholder='Enter Appointment Time (HH:MM)'
                                    className='form-control'
                                  />
                                  <ErrorMessage name='apptTime'>
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
                  <div className="list-4 ">
                    <div className="container-7 mx-auto">
                      {topProcedures.map((procedure, index) => (
                          <div key={index} className='mx-auto'> 
                            <div className="metric-2 item-5 ps-1 ms-1">
                              <div className="title-11"><strong>{procedure.procedure}</strong></div>
                              <div className="data-2">{procedure.avgTime.toFixed(2)} Hours (Performed {procedure.count} times)</div>
                            </div>
                          </div>
                      ))}
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