import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { auth } from "./firebase";

import "./App.scss";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Validator from "./pages/Validator/Validator";

function App() {
  let [user, setUser] = useState("");
  let [signedIn, setSignedIn] = useState(false);

  let mountFirebaseAuth = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
        setUser(auth.currentUser);
      } else {
        setSignedIn(false);
        setUser(""); 
      }
    });
  };

  useEffect(mountFirebaseAuth, []);

  return (
    <div className="page">
      <div className="content">
        <Switch>
          <Route path="/signUp" exact component={SignUp} />
          <Route path="/forgotPassword" exact component={ForgotPassword} />
          <Route path="/login" exact component={Login} />
          { signedIn && 
            <Route path="/validator" exact component={Validator} />
          }
          <Route path="/" exact render={() => (
                    signedIn ?
                    <Redirect to="/validator" /> :
                    <Redirect to="/login" /> 
                )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
