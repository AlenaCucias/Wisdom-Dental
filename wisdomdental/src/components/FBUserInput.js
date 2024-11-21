import React, { useState } from "react";

const FBUserInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  return (
    <div className="feedback-page-copy">
      <div className="row">
        <div className="input">
          <div className="title-3">Name</div>
          <div className="textfield">
            <input
              type="text"
              className="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="input-wrapper">
        <div className="input">
          <p className="title-3">Email (Optional, Required for a Response)</p>
          <div className="textfield">
            <input
              type="email"
              className="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="div-wrapper">
        <div className="input">
          <div className="title-3">Comments</div>
          <div className="textfield">
            <textarea
              className="text"
              placeholder="Write your comments here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FBUserInput;
