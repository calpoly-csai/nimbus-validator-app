import React from "react";
import { Link } from "react-router-dom";
import "./SignOut.scss";
import { auth } from "../../firebase";

export default function SignOut(props) {
  let signOutUser = async () => {
    auth
      .signOut()
      .then(() => {
        props.setSignedIn(false);
      })
      .catch((err) => {
        alert(err.message);
        return;
      });
  };

  return (
    <div className="SignOut">
      <Link to="/login">
        <button className="signOut-button" onClick={signOutUser}>
          Sign Out
        </button>
      </Link>
    </div>
  );
}
