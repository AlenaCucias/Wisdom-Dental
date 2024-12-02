import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button, Row, Col, CardBody, Card } from "reactstrap";

export const AdminPage = () => {
  const [modal, setModal] = useState({
    patientRecords: false,
    payrollInfo: false,
    staffPerformance: false,
    payrollTimesheet: false,
  });

  const [payrollInfo, setPayrollInfo] = useState([]);
  const [timesheetDisplay, setTimeSheetDisplay] = useState([]);
  const [selectedTimesheets, setSelectedTimesheets] = useState([]); 
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [staffPerfID, setStaffPerfID] = useState(null);
  const [staffPayID, setStaffPayID] = useState(null);
  const [payDate, setPayDate] = useState(null);
  const [payAmount, setPayAmount] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");



  const toggleModal = (modalName) => {
    setModal((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/admin/view_staff_list");
        if (response.status === 200) {
          setStaffList(response.data.staff_list || []);
        }
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    fetchStaffList();
  }, []);

  const fetchPatientList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/view_patient_list");
      if (response.status === 200) {
        setPatientList(response.data.patients || []);
      }
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  };
  
  const fetchDentalHistory = async (patientID, patientName) => {
    setSelectedPatientName(patientName);
    try {
      const response = await axios.get("http://127.0.0.1:5000/patients/get_dental_history", {
        params: { patient_id: patientID },
      });
      if (response.status === 200) {
        setSelectedPatientHistory(response.data.appointments || []);
      }
    } catch (error) {
      console.error("Error fetching dental history:", error);
    }
  };
  const getPayroll = async (userID) => {
    toggleModal('payrollTimesheet');
    try{
      const response = await axios.post('http://127.0.0.1:5000/admin/view_payroll_data', { userID })
      const payInfo = response.data
        .map((pay) => ({
          date: pay[0],
          amount: pay[1],
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        })
        .slice(0, 4);
      setPayrollInfo(payInfo);
    } catch(error) {
      console.error("error fetching payroll: ", error);
    }
    getTimesheets(userID);
  }
  const getTimesheets = async (userID) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/admin/view_timesheet', { userID })
      const timesheetInfo = response.data
        .map((timesheet) => ({
          timesheetID: timesheet[0],
          date: timesheet[1],
          time: timesheet[2],
          procedure: timesheet[3],
          hours: timesheet[4]
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        })
        .slice(0, 4);
        setTimeSheetDisplay(timesheetInfo);
    } catch(error) {
      console.error('error fetching timesheet', error);
    }
  }

  const toggleTimesheetSelection = (id) => {
    setSelectedTimesheets((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id) 
        : [...prevSelected, id] 
    );
  };

  const handleSubmit = async () => {
    const handleTimesheet = async () => {
      try{
        const response = await axios.post("http://127.0.0.1:5000/admin/update_time", {timesheetIDs: selectedTimesheets,});
        const timeInfo = response.data;
        setStaffPerfID(timeInfo.staff_id);
        setStaffPayID(timeInfo.staff_id);
        setPayDate(timeInfo.today);
        setPayAmount(timeInfo.total_amount_owed);
      } catch(error) {
        console.error("error updating timesheet: ", error);
      }
    };
    const handlePerformance = async (staffPerfID) => {
      try {  
        const response = await axios.post("http://127.0.0.1:5000/admin/update_performance", { staffPerfID })
        console.log(response);
      } catch(error) {
        console.log("error setting performance: ", error);
      }
    };
    const handlePayroll = async (staffPayID, payDate, payAmount) => {
      const paydayInfo = {
        staffID: staffPayID,
        date: payDate,
        paid: payAmount
      }
      try{
        const response = await axios.post("http://127.0.0.1:5000/admin/update_payroll", paydayInfo)
        console.log(response);
      } catch(error) {
        console.log("error updating payroll", error);
      }
    }
    await handleTimesheet();
    await handlePerformance(staffPerfID);
    await handlePayroll(staffPayID, payDate, payAmount)
    setModal((prevModal) => ({
      ...prevModal,
      payrollTimesheet: false,
    }));

  }
  const fetchStaffPerformance = async (staffID, staffName) => {
    setSelectedStaffName(staffName); // Set the staff name for display
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/view_staff_performance", {
        params: { staff_id: staffID },  // Pass staff_id as a query parameter
      });
      if (response.status === 200) {
        setStaffPerformance(response.data.staff_performance || []);
      }
    } catch (error) {
      console.error("Error fetching staff performance:", error);
    }
  };
  useEffect(() => {
    if (modal.patientRecords) fetchPatientList();
  }, [modal.patientRecords]);

  return (
    <div className="admin-page">
      <div className="text-buttons-wrapper">
        <div className="title">Admin Dashboard</div>
        <p className="description">
          Welcome back, {user?.First_Name || 'N/A'}! View and manage Patient and Staff Information here.
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
          <div className="avatar-container">
            <div className="avatar" />
          </div>
          <div className="title-2">{user?.First_Name || 'N/A'}{' '}{user?.Last_Name || 'N/A'}</div>
          <div className="label-normal">
            <div className="label-text">Admin</div>
          </div>
        </div>

        <p className="email-johndoe-gmail">
          <span className="span" style={{fontWeight: "bold"}}>Email: </span>
          <span className="text-wrapper-2">
            {user?.Email || 'N/A'}
            <br />
            <br />
          </span>
          <span className="span" style={{fontWeight: "bold"}}>Phone Number: <br /></span>
          <span className="text-wrapper-2">{user?.Phone_Number || 'N/A'}</span>
        </p>
      </div>

      {/* Modals for each button */}
       <Modal
        isOpen={modal.patientRecords}
        toggle={() => toggleModal("patientRecords")}
      >
        <ModalHeader toggle={() => toggleModal("patientRecords")}>
          {selectedPatientName
            ? `Dental History of ${selectedPatientName}`
            : "All Patient Records"}
        </ModalHeader>
        <ModalBody>
          {!selectedPatientName ? (
            <div>
              <h5>Select a Patient</h5>
              {patientList.map((patient) => (
                <Button
                  key={patient.Patient_ID}
                  className="btn shadow rounded my-2"
                  onClick={() =>
                    fetchDentalHistory(patient.Patient_ID, patient.Name)
                  }
                >
                  {patient.Name}
                </Button>
              ))}
            </div>
          ) : (
            <div>
              <Button
                className="btn btn-secondary mb-3"
                onClick={() => setSelectedPatientName("")}
              >
                Back to Patient List
              </Button>
              <h5>Dental History for {selectedPatientName}</h5>
              {selectedPatientHistory.length > 0 ? (
                selectedPatientHistory.map((history, index) => (
                  <Card key={index} className="mb-2 text-bg-secondary">
                    <CardBody>
                      <p>
                        <strong>Date:</strong> {history[0]}
                      </p>
                      <p>
                        <strong>Treatment:</strong> {history[1]}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {history[2]}
                      </p>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p>No dental history available for this patient.</p>
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.payrollInfo} toggle={() => toggleModal("payrollInfo")}>
        <ModalHeader toggle={() => toggleModal("payrollInfo")}>View Payroll Information</ModalHeader>
        <ModalBody>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2001);
                }}
              >
                James Bunt
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2002);
                }}
              >
                Joesphine Darakjy
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2003);
                }}
              >
                Art	Venere
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2004);
                }}
              >
                Jane Smith
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2005);
                }}
              >
                Donette	Foller
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2006);
                }}
              >
                Simona	Morasca
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2007);
                }}
              >
                Mitsue	Tollner
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2008);
                }}
              >
                Leota	Dilliard
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2009);
                }}
              >
                Sage	Wieser
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2010);
                }}
              >
                Kris	Marrier
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2011);
                }}
              >
                Minna	Amigon
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2012);
                }}
              >
                Abel	Maclead
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2013);
                }}
              >
                Kiley	Caldarera
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2014);
                }}
              >
                Graciela	Ruta
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2015);
                }}
              >
                Cammy	Albares
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2016);
                }}
              >
                Mattie	Poquette
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2017);
                }}
              >
                Meaghan	Garufi
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2018);
                }}
              >
                Gladys	Rim
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2019);
                }}
              >
                Yuki	Whobrey
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2020);
                }}
              >
                Fletcher	Flosi
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2021);
                }}
              >
                Bette	Nicka
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2022);
                }}
              >
                Veronika	Inouye
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2023);
                }}
              >
                Willard	Kolmetz
              </Button>
            </Col>
            <Col>
              <Button
                className="btn shadow rounded"
                onClick={() => {
                  getPayroll(2024);
                }}
              >
                Maryann	Royster
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className="modal-lg" isOpen={modal.payrollTimesheet} toggle={() => toggleModal("payrollTimesheet")}>
        <ModalHeader toggle={() => toggleModal("payrollTimesheet")}>Staff Payroll and Time Sheet</ModalHeader>
        <ModalBody>
          <Row>
            <Col className="mx-3">
              <Row className="mb-3">
                <Col className="text-start">Date</Col>
                <Col className="text-center">Pay</Col>
              </Row>
              <Row>
                {payrollInfo.map((pay, index) => (
                  <Row className="mb-1" key={pay}>
                    <Card className="text-bg-secondary">
                      <CardBody>
                        <Row>
                          <Col>{pay.date}</Col>
                          <Col className="text-end">$ {pay.amount}</Col>
                        </Row>
                        
                      </CardBody>
                    </Card>
                  </Row>
                ))}
                  
              </Row>
            </Col>
            <Col className="mx-3">
              <Row className="mb-1 text-bg-light my-1 rounded">
                <Col className="px-1 text-center">#</Col>
                <Col className="px-1 text-center">Date</Col>
                <Col className="px-1 text-center">Time</Col>
                <Col className="px-1 text-center">Procedure</Col>
                <Col className="px-1 text-center">Hours</Col>
              </Row>
                {timesheetDisplay.map((timesheet, index) => (
                  <Row className="ms-2">
                    <Row
                      key={timesheet.timesheetID}
                      className={`mb-1 text-bg-light my-1 ${selectedTimesheets.includes(timesheet.timesheetID) ? 'selected' : ''}`}
                      onClick={(e) => {
                        toggleTimesheetSelection(timesheet.timesheetID)
                        const currentBorder = e.currentTarget.style.border;
                        e.currentTarget.style.border = currentBorder ? '' : '2px solid black';
                      }}
                    >
                      <Col className="px-1 text-center"> 
                        {timesheet.timesheetID}
                      </Col>
                      <Col className="px-1 text-center">
                        {timesheet.date}
                      </Col>
                      <Col className="px-1 text-center">
                        {timesheet.time}
                      </Col>
                      <Col className="px-1 text-center">
                        {timesheet.procedure}
                      </Col>
                      <Col className="px-1 text-center">
                        {timesheet.hours}
                      </Col>
                  </Row>
                </Row>
                ))}  
              <Row className="mt-3">
                <Button className="btn shadow rounded" onClick={handleSubmit}>Submit</Button>
              </Row>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal.staffPerformance} toggle={() => toggleModal("staffPerformance")}>
        <ModalHeader toggle={() => toggleModal("staffPerformance")}>
          {selectedStaffName ? `Performance of ${selectedStaffName}` : "Staff List"}
        </ModalHeader>
        <ModalBody>
          {/* Show Staff List if no staff is selected */}
          {!selectedStaffName ? (
            <Row className="mb-2">
              {staffList.map((staff) => (
                <Col key={staff.Staff_ID} className="mb-2">
                  <Button
                    className="btn shadow rounded"
                    onClick={() => fetchStaffPerformance(staff.Staff_ID, staff.Name)}
                  >
                    {staff.Name}
                  </Button>
                </Col>
              ))}
            </Row>
          ) : (
            <>
              {/* Show Performance Data for the selected staff */}
              <Button
                className="btn btn-secondary mb-3"
                onClick={() => setSelectedStaffName(null)} // Back to staff list
              >
                Back to Staff List
              </Button>
              {staffPerformance.length > 0 ? (
                staffPerformance.map((performance, index) => (
                  <Row key={index} className="mb-2">
                    <Card className="text-bg-secondary">
                      <CardBody>
                        <Row>
                          <Col className="text-start">
                            <strong>Date:</strong> {performance.Date}
                          </Col>
                          <Col className="text-center">
                            <strong>Time:</strong> {performance.Time}
                          </Col>
                          <Col className="text-center">
                            <strong>Procedure:</strong> {performance.Procedure}
                          </Col>
                          <Col className="text-end">
                            <strong>Score:</strong> {performance.Performance}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Row>
                ))
              ) : (
                <p>No performance data available for this staff member.</p>
              )}
            </>
          )}
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