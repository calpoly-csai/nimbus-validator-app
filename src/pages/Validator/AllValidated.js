import React from "react";
import { ReactComponent as FinishedHiro } from "../../assets/undraw_check_boxes.svg";
import SignOut from "../../components/SignOut/SignOut.js";
export default function AllValidated() {
  let hiroStyles = {
    width: "200px",
    maxWidth: "100%",
    height: "auto",
  };

  let signOut = () => console.log("sign out");
  return (
    <div className="AllValidated">
      <FinishedHiro style={hiroStyles} />
      <h3>All Queries Have Been Validated</h3>
      <SignOut />
    </div>
  );
}
