import React from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PatientSelection from "../components/Patientselection";
import {useState} from 'react'
import FBUserInput from "../components/FBUserInput";
import RatingSelection from "../components/Ratingselection";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios'; // Import Axios
import {useEffect} from "react";

export const FeedbackPage = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [name, setName] = useState(""); // State for Name input
  const [email, setEmail] = useState(""); // State for Email input
  const [comments, setComments] = useState(""); // State for Comments input
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_latest_reviews"); // Replace with your backend API
      if (response.status === 200) {
        setReviews(response.data);
      } else {
        console.error("Failed to fetch reviews:", response);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  // Fetch reviews on component mount
    useEffect(() => {
    fetchReviews();
  }, []);
  // Handle input changes in FBUserInput
  const handleUserInputChange = (setter) => (value) => {
    setter(value);
  };
  // Handle clearing all input fields
  const handleClear = () => {
    setSelectedRating(0);
    setSelectedStatus("");
    setName("");
    setEmail("");
    setComments("");
  };
  // Handle form submission (just a placeholder function)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");
    // Validate form fields
    if (!name || !comments || !selectedStatus || selectedRating === 0) {
      alert("Please fill in all required fields and select a rating.");
      return;
    }

    const formData = {
      Name: name,
      contact_email: email,
      comments: comments,
      patient_status: selectedStatus,
      star_rating: selectedRating,
    };
    console.log("Submitting form data:", formData); 
    try {
      // Replace `http://127.0.0.1:5000/submit_feedback` with your backend API URL
      const response = await axios.post('http://127.0.0.1:5000/submit_feedback', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log("Response:", response); 
    if (response.status === 201) {
        setThankYouModalOpen(true);
        handleClear(); 
      } else {
        console.error('Error:', response);
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };
  const [expandedIndex, setExpandedIndex] = useState(null); 
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <div className="feedback-page-copy">
      <div className="frame-wrapper">
        <div className="frame">
         
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
                <div className="greyrectangle" />
                  <div className="list">
                    <div className="container-2">
                      <div className="title-2">How Did We Do?</div>
                    <p className="description">
                      Please leave us a review of your experience
                    </p>
                  </div>
                  <div className="row">
                    <FBUserInput
                      label="Name"
                      placeholder="Your Name"
                      value={name}
                      onInputChange={handleUserInputChange(setName)}
                    />
                  </div>

                  <div className="input-wrapper">
                    <FBUserInput
                      label="Email (Optional, Required for a Response)"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onInputChange={handleUserInputChange(setEmail)}
                    />
                  </div>
                  <div className="div-wrapper">
                    <FBUserInput
                      label="Comments"
                      placeholder="Write your comments here"
                      value={comments}
                      onInputChange={handleUserInputChange(setComments)}
                    />
                  </div>
                  <PatientSelection selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}/> 
                  <div className="overallrating">Overall Rating</div>
                  <RatingSelection selectedRating={selectedRating} setSelectedRating={setSelectedRating}/>
                  <div className="button-2">
                  <button className='secondary'onClick={handleClear}>
                  <span className='clear'>Clear</span>
                </button>
                    <button className='primary'onClick={handleSubmit}>
                      <span className="title-5">Submit</span>
                    </button>
                  </div>
                </div>
              </div>
              <Modal isOpen={thankYouModalOpen}>
              <ModalHeader toggle={() => setThankYouModalOpen(false)}>Thank You!</ModalHeader>
              <ModalBody>Your feedback has been successfully submitted. We value your input!</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => setThankYouModalOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
            <div className="frame-2">
              <div className="reviews">
                <div className="container-3">
                  <div className="title-6">Latest Reviews</div>
                  <p className="p">See what others have said</p>
                </div>
                {reviews.length > 0 ? (
    reviews.map((review, index) => (
        <div className="card" key={index}>
            <div className="user">
                <div className="avatar">
                    <div className="avatar-2" />
                    <div className="title-wrapper">
                        <div className="title-7">{review.Name || "Anonymous"}</div>
                    </div>
                </div>
            </div>
            <p className="title-8">{review.Comments || "No comments"}</p>
            <p className="rating">Rating: {review.Rating} ⭐</p>
        </div>
    ))
) : (
    <p>No reviews available.</p>
)}
              </div>
            </div>
          </div>
          <div class="faq-section">
  <div class="frame-33">
    <div class="container-34">
      <span class="faq-heading">FAQs</span>
      <div class="accordion" id="faqAccordion">
        <div class="accordion-item-88">
          <h2 class="accordion-title">
            <button
              class="title-35 btn btn-link"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              What services are offered at Wisdom Dental?
            </button>
            <div class="chevron-down">
              <div class="icon"></div>
            </div>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse show"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
            Our clinic offers a wide variety of services, including consutations, teeth cleaning, dental crowns, dental fillings, dentures, root canals, and tooth extractions.
            </div>
          </div>
        </div>

        <div class="accordion-item-37">
          <h2 class="accordion-title-38">
            <button
              class="title-39 btn btn-link"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              What are the prices of services?
            </button>
            <div class="chevron-down-3a">
              <div class="icon-3b"></div>
            </div>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
              Service prices vary; please contact the clinic for a detailed quote.
            </div>
          </div>
        </div>
        <div class="accordion-item-3d">
          <h2 class="accordion-title-3e">
            <button
              class="title-3f btn btn-link"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              How do I pay for my procedure?
            </button>
            <div class="chevron-down-40">
              <div class="icon-41"></div>
            </div>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
            You can pay through our website Juet leg in to yotr assaunt and you willid thel Make a Payment option on your dashboard.
            </div>
          </div>
        </div>

        <div class="accordion-item-43">
          <h2 class="accordion-title-44">
            <button
              class="title-45 btn btn-link"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Can I cancel or reschedule my appointment online?
            </button>
            <div class="chevron-down-46">
              <div class="icon-47"></div>
            </div>
          </h2>
          <div
            id="collapseFour"
            class="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
            Your petient dastiacare al ant you the eaten to cancel er reschedule your account Just log in to your account, click on your upcoming appointments then select which option youd like.
            </div>
          </div>
        </div>
        <div class="accordion-item-49">
          <h2 class="accordion-title-4a">
            <button
              class="title-4b btn btn-link"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              What are the operating hours of Wisdom Dental Clinic?
            </button>
            <div class="chevron-down-4c">
              <div class="icon-4d"></div>
            </div>
          </h2>
          <div
            id="collapseFive"
            class="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div class="accordion-body">
              The clinic is open from 9 AM to 5 PM, Monday to Saturday.
            </div>
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