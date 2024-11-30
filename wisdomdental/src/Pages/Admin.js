import axios from "axios";
import React, { useState } from "react";
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
  

  const toggleModal = (modalName) => {
    setModal((prevState) => ({
      ...prevState,
      [modalName]: !prevState[modalName],
    }));
  };

  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });

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

  const handleSubmit = () => {
    const handleTimesheet = async () => {
      try{
        const response = await axios.post("http:\\127.0.0.1:5000/admin/update_time_and_pay", {timesheetIDs: selectedTimesheets,
        });
        console.log(response);
      } catch(error) {
        console.error("error updating timesheet: ", error);
      }
    };
    handleTimesheet();
  }

  return (
    <div className="admin-page">
      <div className="text-buttons-wrapper">
        <div className="title">Admin Dashboard</div>
        <p className="description">
          Welcome back! View and manage Patient and Staff Information here.
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
          <div className="avatar" />
          <div className="label-normal">
            <div className="label-text">Admin</div>
          </div>
          <div className="title-2">{user?.First_Name || 'N/A'}{' '}{user?.Last_Name || 'N/A'}</div>
        </div>

        <p className="email-johndoe-gmail">
          <span className="span">Email: </span>
          <span className="text-wrapper-2">
            {user?.Email || 'N/A'}
            <br />
            <br />
          </span>
          <span className="span">Phone Number: <br /></span>
          <span className="text-wrapper-2">{user?.Phone_Number || 'N/A'}</span>
        </p>
      </div>

      {/* Modals for each button */}
      <Modal isOpen={modal.patientRecords} toggle={() => toggleModal("patientRecords")}>
        <ModalHeader toggle={() => toggleModal("patientRecords")}>All Patient Records</ModalHeader>
        <ModalBody>
          <p>Display Patient Records here...</p>
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
                  <Row className="mb-1">
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
                {timesheetDisplay.map((timesheet, key) => (
                  <Row className="ms-2">
                    <Row
                      key={timesheet.timesheetID}
                      className={`mb-1 text-bg-light my-1 ${selectedTimesheets.includes(timesheet.timesheetID) ? 'selected' : ''}`}
                      onClick={() => toggleTimesheetSelection(timesheet.timesheetID)}
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
        <ModalHeader toggle={() => toggleModal("staffPerformance")}>View Staff Performance</ModalHeader>
        <ModalBody>
          <p>Display Staff Performance here...</p>
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
