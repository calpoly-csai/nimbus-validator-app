import React, { useState } from "react";
import "./Validator.scss";
import ValidatorForm from "./ValidatorForm";
import TokenBar from "./TokenBar";
import ValidatorQueryNav from "./ValidatorQueryNav";

import SignOut from "../../components/SignOut/SignOut";

export default function Validator(props) {
  let [queries, setQueries] = useState([
    {
      question: "What is Professor X email",
      answer: "Professor X will communicate to you with his mind.",
      type: "fact",
      isAnswerable: false,
    },
    2,
    3,
    4,
  ]);

  let [selectedQuery, setSelectedQuery] = useState(queries[0]);
  return (
    <div className="ValidatorPage">
      <h1 className="title">Validate</h1>
      <ValidatorForm />
      <TokenBar />
      <ValidatorQueryNav
        bufferLength={queries.length}
        selectedIndex={queries.indexOf(selectedQuery)}
        onChange={(i) => setSelectedQuery(queries[i])}
      />
    </div>
  );
}
