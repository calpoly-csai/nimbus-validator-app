import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import LoginHero from "../../components/LoginHero/LoginHero";
import "./SignUp.scss";
import { auth } from "../../firebase";
import { isEmail } from "../../modules/validators";
import cpcsaiLogo from '../../assets/cpcsai_blackfull.png';

export default function SignUp(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [entryCode, setEntryCode] = useState("");

  const formIsValid = () =>
    [email, password, confirmPassword, entryCode].every(Boolean) &&
    isEmail(email) &&
    password === confirmPassword;

  const signUp = async (e) => {
    e.preventDefault();
    if (formIsValid()) {
      try {
        await auth.createUserWithEmailAndPassword(email, password);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      alert("Please enter a valid email and password.");
    }
  };

  return (
    <div className="SignUp">
      <div className="account-container">
        <Link to="/login">
          <img className="cpcsaiLogo" src={cpcsaiLogo} alt="cpcsaiLogo"/>
        </Link>
        <div className="account-title">
          <h2>Sign Up</h2>
        </div>
        <form onSubmit={signUp}>
          <TextField
            type="text"
            placeholder="Email"
            onChange={setEmail}
            value={email}
            icon="person-outline"
          />
          <TextField
            type="password"
            placeholder="Password"
            onChange={setPassword}
            value={password}
            icon="lock-closed-outline"
          />
          <TextField
            type="password"
            placeholder="Confirm Password"
            onChange={setConfirmPassword}
            value={confirmPassword}
            icon="lock-closed-outline"
          />
          <TextField
            type="password"
            placeholder="Entry Code"
            onChange={setEntryCode}
            value={entryCode}
            icon="key-outline"
          />
          <button
            className="arrow-icon"
            aria-label="Sign Up"
            type="submit"
          >
            <ion-icon
            name="arrow-forward-circle-outline"
            style={{fontSize: "40px", "--ionicon-stroke-width": "40px"}}
            ></ion-icon>
          </button>
        </form>
        <div className="acccount-links">
          <Link className="link" to="/login">
            Already have an account? Login
          </Link>
        </div>
      </div>
      <LoginHero />
    </div>
  );
}
