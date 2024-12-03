import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button, Row, Col, CardBody, Card } from "reactstrap";

export const AdminPage = () => {
  const [modal, setModal] = useState({
    patientRecords: false,
    payrollInfo: false,
    staffPerformance: false,
    payrollTimesheet: false,
    feedback: false,
  });

  const [payrollInfo, setPayrollInfo] = useState([]);
  const [timesheetDisplay, setTimeSheetDisplay] = useState([]);
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
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
  const formatDate = (dataString) => {
    const [month, day, year] = dataString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
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

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/admin/view_feedback");
        if (response.status === 200) {
          setFeedbackList(response.data.feedback || []);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  const getPayroll = async (userID) => {
    toggleModal('payrollTimesheet');
    try {
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
    } catch (error) {
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
    } catch (error) {
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
      try {
        const response = await axios.post("http://127.0.0.1:5000/admin/update_time", { timesheetIDs: selectedTimesheets, });
        const timeInfo = response.data;
        setStaffPerfID(timeInfo.staff_id);
        setStaffPayID(timeInfo.staff_id);
        setPayDate(timeInfo.today);
        setPayAmount(timeInfo.total_amount_owed);
      } catch (error) {
        console.error("error updating timesheet: ", error);
      }
    };
    const handlePerformance = async (staffPerfID) => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/admin/update_performance", { staffPerfID })
        console.log(response);
      } catch (error) {
        console.log("error setting performance: ", error);
      }
    };
    const handlePayroll = async (staffPayID, payDate, payAmount) => {
      const paydayInfo = {
        staffID: staffPayID,
        date: payDate,
        paid: payAmount
      }
      try {
        const response = await axios.post("http://127.0.0.1:5000/admin/update_payroll", paydayInfo)
        console.log(response);
      } catch (error) {
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


      <div className="group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">
              <button onClick={() => toggleModal("feedback")}>
                View Feedback
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
          <span className="span" style={{ fontWeight: "bold" }}>Email: </span>
          <span className="text-wrapper-2">
            {user?.Email || 'N/A'}
            <br />
            <br />
          </span>
          <span className="span" style={{ fontWeight: "bold" }}>Phone Number: <br /></span>
          <span className="text-wrapper-2">{user?.Phone_Number || 'N/A'}</span>
        </p>
      </div>

      {/* Modals for each button */}
      <Modal
        isOpen={modal.patientRecords}
        toggle={() => toggleModal("patientRecords")}
        style={{ maxWidth: '800px', width: '80%' }}
      >
        <ModalHeader toggle={() => toggleModal("patientRecords")}>
          {selectedPatientName
            ? `Dental History for ${selectedPatientName}`
            : "All Patient Records"}
        </ModalHeader>
        <ModalBody>
          {!selectedPatientName ? (
            <div>
              <h5>Select a Patient</h5>
              <div className="button-grid-container">
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
            </div>
          ) : (
            <div>
              <Button
                className="btn btn-secondary mb-3"
                onClick={() => setSelectedPatientName("")}
              >
                Back to Patient List
              </Button>
              {selectedPatientHistory.length > 0 ? (
                <table style={{ width: "100%", textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #ddd", width: "25%", textAlign: "center", padding: "10px" }}>Date</th>
                      <th style={{ borderBottom: "1px solid #ddd", width: "50%", textAlign: "center", padding: "10px" }}>Treatment</th>
                      <th style={{ borderBottom: "1px solid #ddd", width: "75%", textAlign: "center", padding: "10px" }}>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatientHistory.map((history, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px" }}>{formatDate(history[0])}</td>
                        <td>{history[1]}</td>
                        <td>{history[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No dental history available for this patient.</p>
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.payrollInfo} toggle={() => toggleModal("payrollInfo")} style={{ maxWidth: '800px', width: '80%' }}>
        <ModalHeader toggle={() => toggleModal("payrollInfo")}>View Payroll Information</ModalHeader>
        <ModalBody>
          {!selectedStaffName ? (
            <div>
              <h5>Select a Staff Member</h5>
              <div className="button-grid-container">
                {staffList.map((staff) => (
                  <Button
                    key={staff.Staff_ID}
                    className="btn shadow rounded my-2"
                    onClick={() => getPayroll(staff.Staff_ID)}
                  >
                    {staff.Name}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h5>Selected Staff: {selectedStaffName}</h5>
              <Button className="btn shadow rounded" onClick={() => setSelectedStaffName(null)}>
                Reset Selection
              </Button>
            </div>
          )}
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

      <Modal isOpen={modal.staffPerformance} toggle={() => toggleModal("staffPerformance")} style={{ maxWidth: '800px', width: '80%' }}>
        <ModalHeader toggle={() => toggleModal("staffPerformance")}>
          {selectedStaffName ? `Performance of ${selectedStaffName}` : "Staff List"}
        </ModalHeader>
        <ModalBody>
          {/* Show Staff List if no staff is selected */}
          {!selectedStaffName ? (
            <div className="button-grid-container">
              {staffList.map((staff) => (
                <Button
                  key={staff.Staff_ID}
                  className="btn shadow rounded my-2"
                  onClick={() => fetchStaffPerformance(staff.Staff_ID, staff.Name)}
                >
                  {staff.Name}
                </Button>
              ))}
            </div>
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
                <table style={{ width: "100%", textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #ddd", width: "30%", textAlign: "center", padding: "10px" }}>Date</th>
                      <th style={{ borderBottom: "1px solid #ddd", width: "20%", textAlign: "center", padding: "10px" }}>Time</th>
                      <th style={{ borderBottom: "1px solid #ddd", width: "30%", textAlign: "center", padding: "10px" }}>Procedure</th>
                      <th style={{ borderBottom: "1px solid #ddd", width: "20%", textAlign: "center", padding: "10px" }}>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffPerformance.map((performance, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px" }}>{performance.Date}</td>
                        <td>{performance.Time}</td>
                        <td>{performance.Procedure}</td>
                        <td>{performance.Performance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No performance data available for this staff member.</p>
              )}
            </>
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modal.feedback}
        toggle={() => toggleModal("feedback")}
        style={{ maxWidth: "1200px", width: "80%" }}
      >
        <ModalHeader toggle={() => toggleModal("feedback")}>
          Feedback List
        </ModalHeader>
        <ModalBody>
          {feedbackList.length > 0 ? (
            <table style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Date</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Name</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Rating</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Comments</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Role</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((feedback, index) => (
                  <tr key={index}>
                    <td style={{ width: "10%", padding: "10px" }}>{feedback.Date}</td>
                    <td style={{ padding: "10px" }}>{feedback.Name}</td>
                    <td style={{ padding: "10px" }}>{feedback.Rating}</td>
                    <td style={{ padding: "10px" }}>{feedback.Comments}</td>
                    <td style={{ width: "15%", padding: "10px" }}>{feedback.Role}</td>
                    <td style={{ padding: "10px" }}>{feedback.Email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No feedback available.</p>
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
