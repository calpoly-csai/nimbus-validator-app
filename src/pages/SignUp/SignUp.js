import React, { useState } from "react";
import TextField from "../../components/TextField/TextField";
import "./SignUp.scss";
import { auth } from "../../firebase";
import { isEmail } from "../../modules/validators";
export default function SignUp(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [entryCode, setEntryCode] = useState("");

  const formIsValid = () =>
    [email, password, confirmPassword, entryCode].every(Boolean) &&
    isEmail(email) &&
    password === confirmPassword;

  const signUp = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="SignUp">
      <div className="signUp-container">
        <div className="title">
          <h2>Sign Up</h2>
          <div className="header-hr"></div>
        </div>
        <form>
          <TextField
            type="text"
            placeholder="Email"
            onChange={setEmail}
            value={email}
          />
          <TextField
            type="password"
            placeholder="Password"
            onChange={setPassword}
            value={password}
          />
          <TextField
            type="password"
            placeholder="Confirm Password"
            onChange={setConfirmPassword}
            value={confirmPassword}
          />
          <TextField
            type="password"
            placeholder="Entry Code"
            onChange={setEntryCode}
            value={entryCode}
          />
          <button className="submit-button" onClick={signUp}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
