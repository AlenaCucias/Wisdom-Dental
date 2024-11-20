import React from "react";
import { Link } from "react-router-dom";
// import { ChevronDown } from "./ChevronDown";
// import { ChevronUp } from "./ChevronUp";
// import arrow2 from "./arrow-2.svg";
// import frame4273188172 from "./frame-427318817-2.svg";
// import frame427318817 from "./frame-427318817.svg";
// import image from "./image.svg";
// import "./style.css";
// import vector200 from "./vector-200.svg";
// import websiteIconPic1 from "./website-icon-pic-1.png";

export const FeedbackPage = () => {
  return (
    <div className="feedback-page-copy">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="navbar-design">
            <div className="back-button">
              <div className="overlap-group">
                <div className="ellipse-wrapper">
                  <div className="ellipse" />
                </div>

                {/* <img className="arrow" alt="Arrow" src={arrow2} /> */}
              </div>
            </div>

            <div className="navigation-pill-list">
              <button className="button">
                <div className="navigation-pill">
                  <div className="text-wrapper">Home</div>
                </div>
              </button>

              <button className="button">
                <div className="navigation-pill">
                  <div className="text-wrapper">About Us</div>
                </div>
              </button>

              <Link to="/feedback-page-u40copyu41">
                <button className="button">
                  <div className="navigation-pill">
                    <div className="text-wrapper">Feedback/FAQs</div>
                  </div>
                </button>
              </Link>

              <button className="button">
                <div className="navigation-pill">
                  <div className="text-wrapper">Sign in</div>
                </div>
              </button>
            </div>

            {/* <img
              className="website-icon-pic"
              alt="Website icon pic"
              src={websiteIconPic1}
            /> */}
          </div>

          <div className="section">
            <div className="container">
              <div className="title">Feedback</div>
            </div>
          </div>
            {/* <img className="vector" alt="Vector" src={image} /> */}
          </div>
          <div className="div">
            <div className="overlap-group-wrapper">
              <div className="overlap-group-2">
                <div className="rectangle" />
                  <div className="list">
                    <div className="container-2">
                      <div className="title-2">How Did We Do?</div>
                    <p className="description">
                      Please leave us a review of your experience
                    </p>
                  </div>

                  <div className="row">
                    <div className="input">
                      <div className="title-3">Name</div>

                      <div className="textfield">
                        <div className="text">Your Name</div>
                      </div>
                    </div>
                  </div>

                  <div className="input-wrapper">
                    <div className="input">
                      <p className="title-3">
                        Email (Optional, Required for a Response)
                      </p>

                      <div className="textfield">
                        <div className="text">Email</div>
                      </div>
                    </div>
                  </div>

                  <div className="div-wrapper">
                    <div className="input">
                      <div className="title-3">Comments</div>

                      <div className="textfield">
                        <div className="text">Write your comments here</div>
                      </div>
                    </div>
                  </div>

                  <div className="selection-wrapper">
                    <div className="selection">
                      <div className="title-3">Patient Status</div>

                      <div className="chip-group">
                        <div className="chip">
                          <div className="text-2">Current Patient</div>
                        </div>

                        <div className="chip-2">
                          <div className="text-2">Former Patient</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row-2">
                    <div className="selection">
                      <div className="title-3">Overall Rating</div>

                      <div className="chip-group">
                        <div className="chip-3">
                          <div className="text-3">⭐</div>
                        </div>

                        <div className="chip-4">
                          <div className="text-4">⭐⭐</div>
                        </div>

                        <div className="chip-5">
                          <div className="text-5">⭐⭐⭐</div>
                        </div>

                        <div className="chip-6">
                          <div className="text-6">⭐⭐⭐⭐</div>
                        </div>

                        <div className="chip-7">
                          <div className="text-6">⭐⭐⭐⭐⭐</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="button-2">
                    <div className="seconday">
                      <div className="title-4">Clear</div>
                    </div>

                    <div className="primary">
                      <div className="title-5">Submit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="frame-2">
              <div className="reviews">
                <div className="container-3">
                  <div className="title-6">Latest Reviews</div>

                  <p className="p">See what others have said</p>
                </div>

                {/* <img className="img" alt="Vector" src={vector200} /> */}
              </div>

              <div className="card">
                <div className="user">
                  <div className="avatar">
                    <div className="avatar-2" />

                    <div className="title-wrapper">
                      <div className="title-7">John Doe</div>
                    </div>
                  </div>
                </div>

                <p className="title-8">
                  Great service and friendly staff. Highly recommend!
                </p>

                {/* <img className="frame-3" alt="Frame" src={frame427318817} /> */}
              </div>

              <div className="card">
                <div className="user">
                  <div className="avatar">
                    <div className="avatar-2" />

                    <div className="title-wrapper">
                      <div className="title-7">John Doe</div>
                    </div>
                  </div>
                </div>

                <p className="title-8">
                  Had a wonderful experience! Will definitely visit again.
                </p>

                {/* <img className="frame-3" alt="Frame" src={frame4273188172} /> */}
              </div>
            </div>
          </div>

          <div className="FAQ-section">
            <div className="container-wrapper">
              <div className="container-4">
                <div className="FAQ-heading">FAQs</div>

                <div className="accordion">
                  <div className="accordion-item">
                    <div className="accordion-title">
                      <p className="title-9">
                        What services are offered at Wisdom Dental?
                      </p>

                      {/* <ChevronDown className="icon-instance-node" /> */}
                    </div>
                  </div>
                </div>

                <div className="accordion">
                  <div className="accordion-item">
                    <div className="accordion-title">
                      <p className="title-9">
                        What are the prices of services?
                      </p>

                      {/* <ChevronDown className="icon-instance-node" /> */}
                    </div>
                  </div>
                </div>

                <div className="accordion">
                  <div className="accordion-item">
                    <div className="accordion-title">
                      <p className="title-9">How do I pay for my procedure?</p>

                      {/* <ChevronDown className="icon-instance-node" /> */}
                    </div>
                  </div>
                </div>

                <div className="accordion">
                  <div className="accordion-item">
                    <div className="accordion-title">
                      <p className="title-9">
                        Can I cancel or reschedule my appointment online?
                      </p>

                      {/* <ChevronDown className="icon-instance-node" /> */}
                    </div>
                  </div>
                </div>

                <div className="accordion">
                  <div className="accordion-item-2">
                    <div className="accordion-title-2">
                      <p className="title-10">
                        What are the operating hours of Wisdom Dental Clinic?
                      </p>

                      {/* <ChevronUp className="icon-instance-node" /> */}
                    <div className="accordion-content">
                      <p className="body">
                        We are open from 9:00 am - 5:00 pm on weekdays. We are
                        closed on the weekends.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;