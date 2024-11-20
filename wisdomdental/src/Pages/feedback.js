import React from "react";
import { Link } from "react-router-dom";
import {Accordation} from "./Accordtion";
import { ChevronDown } from "./ChevronDown";
import { ChevronUp } from "./ChevronUp";
import arrow2 from "./arrow-2.svg";
import frame4273188172 from "./frame-427318817-2.svg";
import frame427318817 from "./frame-427318817.svg";
import image from "./image.svg";
import "./style.css";
import vector200 from "./vector-200.svg";
import websiteIconPic1 from "./website-icon-pic-1.png";

export const FeedbackPageCopy = () => {
  return (
    <div className="feedback-page-copy">
      <div className="frame">
          <div className="back-button">
            <div className="overlap-group">
              <div className="ellipse-wrapper">
                <div className="ellipse" />
                </div>
                <img className="arrow" alt="Arrow" src={arrow2} />
              </div>
            </div>
          <div className="section">
            <div className="container">
              <div className="title">Feedback</div>
            </div>
            <img className="vector" alt="Vector" src={image} />
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
                      <span className="title-3">Patient Status</span>
                      <div className="chip-group">
                        <div className="chip">
                          <span className="text-2">Current Patient</span>
                        </button>
                        <button className="chip-2">
                          <span className="text-2">Former Patient</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row-2">
                    <div className="selection-1d">
                      <div className="title-3">Overall Rating</div>
                      <div className="chip-group">
                        <div className="chip-3">
                          <span className="text-3">⭐</span>
                        </div>
                        <div className="chip-4">
                          <span className="text-4">⭐⭐</span>
                        </div>
                        <div className="chip-5">
                          <span className="text-5">⭐⭐⭐</span>
                        </div>
                        <div className="chip-6">
                          <span className="text-6">⭐⭐⭐⭐</span>
                        </div>
                        <div className="chip-7">
                          <span className="text-6">⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="button-2">
                    <div className="seconday">
                      <span className="title-4">Clear</span>
                    </button>
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

                <img className="img" alt="Vector" src={vector200} />
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

                <img className="frame-3" alt="Frame" src={frame427318817} />
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

                <img className="frame-3" alt="Frame" src={frame4273188172} />
              </div>
            </div>
          </div>
          <div className='faq-section'>
          <div className='frame-33'>
            <div className='container-34'>
              <span className='faq-heading'>FAQs</span>
              <div className='accordion'>
                <div className='accordion-item'>
                  <div className='accordion-title'>
                    <span className='title-35'>
                      What services are offered at Wisdom Dental?
                    </span>
                    <div className='chevron-down'>
                      <div className='icon' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='accordion-36'>
                <div className='accordion-item-37'>
                  <div className='accordion-title-38'>
                    <span className='title-39'>
                      What are the prices of services?
                    </span>
                    <div className='chevron-down-3a'>
                      <div className='icon-3b' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='accordion-3c'>
                <div className='accordion-item-3d'>
                  <div className='accordion-title-3e'>
                    <span className='title-3f'>
                      How do I pay for my procedure?
                    </span>
                    <div className='chevron-down-40'>
                      <div className='icon-41' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='accordion-42'>
                <div className='accordion-item-43'>
                  <div className='accordion-title-44'>
                    <span className='title-45'>
                      Can I cancel or reschedule my appointment online?
                    </span>
                    <div className='chevron-down-46'>
                      <div className='icon-47' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='accordion-48'>
                <div className='accordion-item-49'>
                  <div className='accordion-title-4a'>
                    <span className='title-4b'>
                      What are the operating hours of Wisdom Dental Clinic?
                    </span>
                    <div className='chevron-down-4c'>
                      <div className='icon-4d' />
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
}