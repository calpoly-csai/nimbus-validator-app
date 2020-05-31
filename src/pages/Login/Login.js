import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";

import "./Login.scss";
import TextField from "../../components/TextField/TextField";
import { isEmail } from "../../modules/validators";

export default function Login(props) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let formIsValid = () =>
    username && password && password.length > 7 && isEmail(username);

  let logInUser = async () => {
    if (!formIsValid()) return;
    try {
      const user = await auth.signInWithEmailAndPassword(username, password);
    } catch (err) {
      alert(err.message);
      return;
    }
  };

  return (
    <div className="Login">
      <div className="login-container">
        <div className="title">
          <h2>Log In</h2>
          <div className="header-hr"></div>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            type="text"
            placeholder="Username"
            onChange={setUsername}
            value={username}
            validator={(value) => value && isEmail(value)}
          />
          <TextField
            type="password"
            placeholder="Password"
            onChange={setPassword}
            value={password}
            validator={(value) => value && value.length > 7}
          />
          <button className="submit-button" onClick={logInUser}>
            Log In
          </button>
        </form>
        <div className="links">
          <Link className="link" to="/forgotPassword">Forgot Password</Link>
          <Link className="link" to="/signUp">New here? Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
