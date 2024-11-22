import React from 'react'
import logo from "../components/logo.png";
import { Row, Col } from 'reactstrap';
import smile from "../components/homeSmile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Core React component
import { faBookmark, faStar } from '@fortawesome/free-regular-svg-icons'; // Specific icon
import { faFileWaveform } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';



const HomePage = () => {
  return (
    <div className='home-page mt-5'>
      <Row className='mb-5'>
        <Col md="5" className='my-auto pe-4'>
          <div className="image-container">
            <img
              className="screenshot"
              alt="logo"
              src={logo}
            />
          </div>
        </Col>
        <Col md="7" className='my-auto'>
          <Row>
            <div className="text-wrapper text-start pb-1">Welcome to</div>
          </Row>
          <Row>
            <div className="div gruppo-regular text-start pb-2">Wisdom Dental</div>
          </Row>
          <Row>
            <p className="description text-start">
              Providing quality dental care for you and your family
            </p>
          </Row>
          <Row>
            <Link to='/login' className='text-start'>
              <button className="primary-wrapper btn rounded shadow text-start">
                <div className="primary">
                  <div className="title-2">Book An Appointment</div>
                </div>
              </button>
            </Link>
            
          </Row>
        </Col>
      </Row>
      <Row className="my-5">
        <Col md='6' className='pe-5 d-flex justify-contents-center'>
          <div className="list">
            <div className="container-2">
              <Row>
                <div className="title-3">Why Choose Us</div>

              </Row>
              <Row>
                <p className="description">
                  Reasons to trust us with your dental care
                </p>
              </Row>
              <div className="list-2">
                <Row>
                  <div className="row">
                    <Col>
                      <div className="item ">
                        <div className="frame-2">
                          <div className="size-48"><FontAwesomeIcon icon={faBookmark} size='4x' /></div>
                        </div>
                        <div className="frame-3">
                          <div className="title-4">Experienced Dentists</div>
                          <div className="subtitle">Years of expertise</div>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="item ">
                        <div className="activity-wrapper">
                          <div className="size-48" >
                            <FontAwesomeIcon icon={faFileWaveform} size='4x' />
                          </div>
                        </div>
                        <div className="frame-3">
                          <div className="title-4">State-of-the-art Technology</div>
                          <div className="subtitle">Advanced dental equipment</div>
                        </div>
                      </div>
                    </Col>
                  </div>
                </Row>
                <Row>
                    <div>
                  <div className="item">
                    <div className="frame-2">
                      <div className="d-flex justify-content-center pt-3">
                        <div className=""><FontAwesomeIcon icon={faStar} size='4x' /></div>
                      </div>
                    </div>
                    <div className="frame-3">
                      <div className="title-4">Excellent Patient Care</div>
                      <p className="subtitle">Your comfort is our priority</p>
                    </div>
                  </div>
                </div>
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col md="6" className='d-flex align-items-center'>
          <img
            className='image-wrappe image img-fluid'
            alt='home page image, girl smiling'
            src={smile}
          />
        </Col>
      </Row>
      <div className="div-wrapper">
        <div className="rounded shadow">
          <Link to="/about">
            <button type='button' className='btn shadow rounded btn-lg title-wrapper title-5'>Learn More About Us!</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage;