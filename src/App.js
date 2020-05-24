import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import "./App.scss";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

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

  let shownScreen = signedIn ? <h1>Welcome</h1> : <Login />;

  return (
    <div className="page">
      <div className="content">{shownScreen}</div>
    </div>
  );
}

export default App;
