import React from 'react';
import { Link } from "react-router-dom";
import { Row, Col } from 'reactstrap';
import LoginForm from "../components/LoginForm";



const LoginPage = () => {
  return (
    <div className='login-page'>
        <Row>
            <div className="section">
                <div className="container-2">
                    <div className="title-3">New Patient? Click Here</div>

                    <p className="description">
                        Click New Patient to create a new account
                    </p>
                    <Link to='/createAccount'>
                        <button className="seconday-wrapper btn shadow rounded mb-5">
                            <div className="seconday">
                                <div className="">New Patient</div>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </Row>
        <div style={{ borderTop: "1px solid #ccc" }}></div>
        <Row>
            <div className="form">           
                <Col md='4' className='leftSplit left'>
                    <div className="title mx-5 py-5 my-5 ps-3">Login To Your Account</div>
                </Col>
                <Col className='rightSplit' >    
                        <LoginForm />
                </Col>
            </div>
        </Row>
        
    </div>
  )
}

export default LoginPage