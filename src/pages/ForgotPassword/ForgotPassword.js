import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.scss";
import { auth } from "../../firebase";
import TextField from "../../components/TextField/TextField";
import { isEmail } from "../../modules/validators";
import cpcsaiLogo from '../../assets/cpcsai_blackfull.png';

export default function ForgotPassword(props) {
  let [email, setEmail] = useState("");

  let forgotPassword = (e) => {
    e.preventDefault();
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
      <div className="account-container">
        <img className="cpcsaiLogo" src={cpcsaiLogo} alt="cpcsaiLogo"/>
        <div className="account-title">
          <h2>Reset Password</h2>
        </div>
        <h4>Enter your email to reset your password.</h4>
        <form onSubmit={forgotPassword}>
          <TextField
            type="text"
            placeholder="Email"
            onChange={setEmail}
            value={email}
            validator={(value) => value && isEmail(value)}
            icon="person-outline"
          />
          <button className="submit-button" type="submit">
            Send
          </button>
        </form>
        <div className="acccount-links">
          <Link className="link" to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}