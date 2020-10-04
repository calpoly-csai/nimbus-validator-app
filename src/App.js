import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { auth } from "./firebase";
import "./axios";

import "./App.scss";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Validator from "./pages/Validator/Validator";

function App() {
  // Currently, we are not using the user, but we could in the future.
  // let [user, setUser] = useState(null);
  let [signedIn, setSignedIn] = useState(false);

  let mountFirebaseAuth = () => {
    auth.onAuthStateChanged((user) => {
      // setUser(auth.currentUser);
      user ? setSignedIn(true) : setSignedIn(false);
    });
  };

  useEffect(mountFirebaseAuth, []);

  return (
    <div className="page">
      <Switch>
        <Route path="/signUp" exact component={SignUp} />
        <Route path="/forgotPassword" exact component={ForgotPassword} />
        <Route path="/login" exact component={Login} />
        {signedIn && <Route path="/validator" exact component={Validator} />}
        <Route
          path="/"
          exact
          render={() =>
            signedIn ? <Redirect to="/validator" /> : <Redirect to="/login" />
          }
        />
      </Switch>
    </div>
  );
}

export default App;
