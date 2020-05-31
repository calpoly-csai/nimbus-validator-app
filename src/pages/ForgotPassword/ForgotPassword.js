import React, { useState } from "react";
import "./ForgotPassword.scss";
import { auth } from "../../firebase";
import TextField from "../../components/TextField/TextField";
import { isEmail } from "../../modules/validators";

export default function ForgotPassword(props) {
  let [email, setEmail] = useState("");

  let forgotPassword = () => {
    if (isEmail(email)) {
      auth.sendPasswordResetEmail(email).then(function() {
        // Email sent.
      }).catch(function(err) {
        alert(err.message);
        return;
      });
    } else {
      alert("Please enter a valid email.");
    }
  }

  return (
    <div className="ForgotPassword">
      <div className="forgotPassword-container">
        <div className="title">
          <h2>Forgot Password</h2>
          <div className="header-hr"></div>
        </div>
        <h4>Enter your email to reset your password.</h4>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            type="text"
            placeholder="Email"
            onChange={setEmail}
            value={email}
            validator={(value) => value && isEmail(value)}
          />
          <button className="submit-button" onClick={forgotPassword}>
            Send
          </button>
        </form>
        <div className="links">
          <a>Back to Log In</a>
        </div>
      </div>
    </div>
  )
}