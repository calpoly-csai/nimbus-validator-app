import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
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
      } else setSignedIn(false);
    });
  };

  useEffect(mountFirebaseAuth, []);

  let shownScreen = signedIn ? <Validator /> : <Login />;

  return (
    <div className="page">
      <div className="content">
        <Switch>
          <Route path="/signUp" render={()=><SignUp/>} />
          <Route path="/forgotPassword" render={()=><ForgotPassword/>}/>
          <Route path="/" render={()=>shownScreen}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
