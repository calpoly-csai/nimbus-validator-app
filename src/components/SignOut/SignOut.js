import React from "react";
import { useHistory } from "react-router-dom";
import "./SignOut.scss";
import { auth } from "../../firebase";

export default function SignOut(props) {
  let history = useHistory();

  let signOutUser = async () => {
    auth
      .signOut()
      .then(() => {
        history.push("/login");
      })
      .catch((err) => {
        alert(err.message);
        return;
      });
  };

  return (
    <div className="SignOut">
      <p className="signOut-button" onClick={signOutUser}>
        Sign Out
      </p>
    </div>
  );
}
