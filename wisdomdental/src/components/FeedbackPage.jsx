import React from 'react';
import './FeedbackPage.css';


export const FeedbackPageCopy = () => {
    return (
      <div className="feedback-page-copy">
        <div className="frame-wrapper">
          <div className="frame-2">
            <NavbarDesign
              arrow="arrow-2-2.svg"
              arrowClassName="navbar-design-instance"
              className="navbar-design-2-final-for-now"
              websiteIconPic="image.png"
            />
            <div className="section">
              <div className="container">
                <div className="title-3">Feedback</div>
              </div>
  
              <img className="vector" alt="Vector" src={image1} />
            </div>
  
            <div className="frame-3">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <div className="rectangle" />
  
                  <div className="list">
                    <div className="container-2">
                      <div className="title-4">How Did We Do?</div>
  
                      <p className="description">
                        Please leave us a review of your experience
                      </p>
                    </div>
  
                    <div className="row">
                      <div className="input">
                        <div className="title-5">Name</div>
  
                        <div className="textfield">
                          <div className="text">Your Name</div>
                        </div>
                      </div>
                    </div>
  
                    <div className="input-wrapper">
                      <div className="input">
                        <p className="title-5">
                          Email (Optional, Required for a Response)
                        </p>
  
                        <div className="textfield">
                          <div className="text">Email</div>
                        </div>
                      </div>
                    </div>
  
                    <div className="div-wrapper">
                      <div className="input">
                        <div className="title-5">Comments</div>
  
                        <div className="textfield">
                          <div className="text">Write your comments here</div>
                        </div>
                      </div>
                    </div>
  
                    <div className="selection-wrapper">
                      <div className="selection">
                        <div className="title-5">Patient Status</div>
  
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
                        <div className="title-5">Overall Rating</div>
  
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
                        <div className="title-6">Clear</div>
                      </div>
  
                      <div className="primary">
                        <div className="title-7">Submit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="frame-4">
                <div className="reviews">
                  <div className="container-3">
                    <div className="title-8">Latest Reviews</div>
  
                    <p className="p">See what others have said</p>
                  </div>
  
                  <img className="img" alt="Vector" src={vector200} />
                </div>
  
                <div className="card">
                  <div className="user">
                    <div className="avatar">
                      <div className="avatar-2" />
  
                      <div className="title-wrapper">
                        <div className="title-9">John Doe</div>
                      </div>
                    </div>
                  </div>
  
                  <p className="title-10">
                    Great service and friendly staff. Highly recommend!
                  </p>
  
                  <img className="frame-5" alt="Frame" src={frame427318817} />
                </div>
  
                <div className="card">
                  <div className="user">
                    <div className="avatar">
                      <div className="avatar-2" />
  
                      <div className="title-wrapper">
                        <div className="title-9">John Doe</div>
                      </div>
                    </div>
                  </div>
  
                  <p className="title-10">
                    Had a wonderful experience! Will definitely visit again.
                  </p>
  
                  <img className="frame-5" alt="Frame" src={frame4273188172} />
                </div>
              </div>
            </div>
  
            <div className="FAQ-section">
              <div className="container-wrapper">
                <div className="container-4">
                  <div className="FAQ-heading">FAQs</div>
  
                  <Accordion
                    accordionItemTitle="What services are offered at Wisdom Dental?"
                    className="accordion-instance"
                    stateProp="default"
                  />
                  <Accordion
                    accordionItemTitle="What are the prices of services?"
                    className="accordion-instance"
                    stateProp="default"
                  />
                  <Accordion
                    accordionItemTitle="How do I pay for my procedure?"
                    className="accordion-instance"
                    stateProp="default"
                  />
                  <Accordion
                    accordionItemTitle="Can I cancel or reschedule my appointment online?"
                    className="accordion-instance"
                    stateProp="default"
                  />
                  <Accordion
                    accordionItemTitle="What are the operating hours of Wisdom Dental Clinic?"
                    className="accordion-instance"
                    stateProp="default"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };