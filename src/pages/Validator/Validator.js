import React from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import TokenBar from "./TokenBar";

import SignOut from "../../components/SignOut/SignOut";

export default function Validator(props) {
  return (
    <div className="ValidatorPage">
      <h1 className="title">Validate</h1>
      <ValidatorForm />
      <TokenBar />
    </div>
  );
}
