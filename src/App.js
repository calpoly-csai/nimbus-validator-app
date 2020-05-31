import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { auth } from "./firebase";

import "./App.scss";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import SignOut from "./components/SignOut/SignOut";

function App() {
  let [user, setUser] = useState("");
  let [signedIn, setSignedIn] = useState(false);

  let mountFirebaseAuth = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else setSignedIn(false);
    });
  };

  useEffect(mountFirebaseAuth, []);

  let shownScreen = signedIn ? 
                    <div>
                      <h1>Welcome</h1>
                      <SignOut />
                    </div> : 
                    <Login />;

  return (
    <div className="page">
      <div className="content">
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/signUp">Register</Link>
                </li>
                <li>
                  <Link to="/forgotPassword">Forgot Password</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/signUp">
                <SignUp />
              </Route>
              <Route path="/forgotPassword">
                <ForgotPassword />
              </Route>
              <Route path="/">
                {shownScreen}
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
