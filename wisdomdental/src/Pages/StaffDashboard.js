import React, {useState, useEffect} from 'react'
import { Col, Row, Modal, ModalBody, FormGroup, Label, Button, ModalHeader } from 'reactstrap';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Core React component
import { Formik, Field, Form } from "formik";



const StaffDashboard = ({ user }) => {
  const [staffInfo, setStaffInfo] = useState(null);
  const [openPayroll, setOpenPayroll] = useState(false);
  const handleSubmit = (values) => {
    const timesheet = 
    {
      hours: values.hours,
      procedure: values.procedure
    };
    console.log(timesheet);
    setOpenPayroll(false);
  }

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setStaffInfo(storedUser);
  }, []);

  function format_payroll(pay) {
    pay = pay.toString();
    var decimalPart = "";
    if (pay.indexOf('.') !== -1) {
        //alert("decimal number");
        pay = pay.split(".");
        decimalPart = "." + pay[1];
        pay = pay[0];
        //alert(pay);
        //alert(decimalPart);

    }
    var formatted_pay = "";
    var count = 0;
    for (var i = pay.length - 1; i >= 0 && pay.charAt(i) !== '-'; i--) {
        //alert("inside for" + pay.charAt(i) + "and count=" + count + " and formatted_pay=" + formatted_pay);
        if (count === 3) {
          formatted_pay += ",";
            count = 0;
        }
        formatted_pay += pay.charAt(i);
        count++;
    }
    if (pay.charAt(0) === '-') {
      formatted_pay += "-";
    }
    //alert(formatted_pay);
    //alert(formatted_pay.split("").reverse().join(""));
    return formatted_pay.split("").reverse().join("") + decimalPart;
  }

  return (
    <div className='staff-dashboard'>
      <div className="overlap">
        <div className="title">Staff Dashboard</div>

        <p className="description">
          Welcome back, {staffInfo ? staffInfo.First_Name : 'User'}! View upcoming appointments and payroll here.
        </p>

        <div className="overlap">
          <Col>
            <div className="group" >
              <div className="group-2">
                <Row className='justify-content-center'>
                  <div>
                    <div className="label-normal">
                      <div className="label-text">Staff</div>
                    </div>
                    <div className="text-wrapper">{staffInfo ? staffInfo.First_Name + " " + staffInfo.Last_Name : 'Loading...'}</div>
                    <div className="avatar" />
                  </div>
                </Row>
                <Row className='justify-content-center'>
                  <p className="email-johndoe-gmail">
                    <span className="span">Email: </span>

                    <span className="text-wrapper-2">
                      {staffInfo ? staffInfo.Email : 'Loading...'}
                      <br />
                      <br />
                    </span>

                    <span className="span">
                      Phone Number: <br />
                    </span>

                    <span className="text-wrapper-2">{staffInfo ? staffInfo.Phone_Number : 'Loading...'}</span>
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
                    <div className="title-2">Patient Reviews</div>
                  </div>

                  <div className="list">
                    <div className="row">
                      <div className="card">
                        <div className="user">
                          <div className="avatar-2">
                            <div className="avatar-3" />

                            <div className="title-wrapper">
                              <div className="title-3 text-start">Sarah Johnson <FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /></div>
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
                              <div className="title-3 text-start">Alex Chang <FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /><FontAwesomeIcon icon={faStar} style={{color: 'gold'}} /></div>
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
                          <div className="item">
                            <div className="frame-3">
                              <div className="title-6">John Doe</div>

                              <div className="subtitle">Cleaning</div>
                            </div>

                            <div className="subtitle-2">9:00 AM</div>
                          </div>

                          <div className="item">
                            <div className="frame-3">
                              <div className="title-6">Jane Smith</div>

                              <div className="subtitle">Check-up</div>
                            </div>

                            <div className="subtitle-2">10:30 AM</div>
                          </div>
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
                    <div className="subtitle-3">{staffInfo ? "$" + format_payroll(staffInfo.Total_Pay) : 'Loading...'}</div>

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
                        className='mx-3'  
                      >
                        Enter Time Worked
                      </ModalHeader>
                      <ModalBody className='my-4 mx-5'>
                        <Formik
                          initialValues={{
                            hours: '',
                            procedure: '',
                          }}
                          onSubmit={handleSubmit}
                        >
                          <Form>
                            <Row className='mb-4'>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='hours'>Input Time (hours)</Label>
                                  <Field
                                    id="hours"
                                    name="hours"
                                    placeholder="Enter hours"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <Label htmlFor='procedure'>Input Procedure</Label>
                                  <Field 
                                    id='procdure'
                                    name='procedure'
                                    placeholder='Enter Procedure'
                                    className='form-control'
                                  />
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
    </div>
  )
}

export default StaffDashboard