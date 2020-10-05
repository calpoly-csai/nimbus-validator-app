import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import LoginHero from "../../components/LoginHero/LoginHero";
import "./SignUp.scss";
import { isEmail } from "../../modules/validators";
import cpcsaiLogo from "../../assets/cpcsai_blackfull.png";
import axios from "axios";

const shakeElement = (el) =>
  el.animate(
    {
      transform: [
        "translateX(0)",
        "translateX(20px)",
        "translateX(0)",
        "translateX(-20px)",
        "translateX(0)",
      ],
    },
    { duration: 500, easing: "ease-in-out" }
  );

export default function SignUp(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [entryCode, setEntryCode] = useState("");

  const history = useHistory();

  const entryField = useRef(null);

  const formIsValid = () =>
    [email, password, confirmPassword, entryCode].every(Boolean) &&
    isEmail(email) &&
    password === confirmPassword;

  const signUp = async (e) => {
    e.preventDefault();
    if (formIsValid()) {
      try {
        await axios.post(
          "https://us-central1-csai-b408c.cloudfunctions.net/signUpWithCode",
          { email, password, code: entryCode }
        );
      } catch (err) {
        if (entryField.current) shakeElement(entryField.current);
        return console.error(err.message);
      }
      history.push("/login");
    } else {
      alert("Please enter a valid email and password.");
    }
  };

  return (
    <div className="SignUp">
      <div className="account-container">
        <Link to="/login">
          <img className="cpcsaiLogo" src={cpcsaiLogo} alt="cpcsaiLogo" />
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
            ref={entryField}
            placeholder="Entry Code"
            onChange={setEntryCode}
            value={entryCode}
            icon="key-outline"
          />
          <button className="submit-button" type="submit">
            Register
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
