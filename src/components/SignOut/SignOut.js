import React from "react";
import "./SignOut.scss";
import { auth } from "../../firebase";

export default function SignOut(props) {
  let signOutUser = async () => {
    auth
      .signOut()
      .then(() => {
        //navigate to Login
      })
      .catch((err) => {
        alert(err.message);
        return;
      });
  };

  return (
    <div className="SignOut">
      <button className="signOut-button" onClick={signOutUser}>
        Sign Out
      </button>
    </div>
  );
}
