import React, { useState, useRef } from "react";
import ValidatorField from "./ValidatorField";
import ValidatorToggle from "./ValidatorToggle";
import ValidatorSelector from "./ValidatorSelector";
export default function ValidatorForm(props) {
  let [question, setQuestion] = useState("");
  let [answer, setAnswer] = useState("");
  let [isAnswerable, setAnswerable] = useState("No");
  let [questionType, setQuestionType] = useState("");

  let uploadValidation = (e) => {
    let shouldSubmit = [question, answer, isAnswerable, questionType].every(
      Boolean
    );
    if (!shouldSubmit) return;
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <form className="ValidatorForm" onSubmit={(e) => e.preventDefault()}>
      <ValidatorField
        title="Question"
        value={question}
        onChange={setQuestion}
      />
      <ValidatorField title="Answer" value={answer} onChange={setAnswer} />
      <div className="query-properties">
        <ValidatorToggle
          title="Can we answer?"
          options={["Yes", "No"]}
          onChange={setAnswerable}
          value={isAnswerable}
        />
        <ValidatorSelector
          title="Type"
          options={["Fact", "Related", "Statistics", "Other"]}
          onChange={setQuestionType}
        />
      </div>
      <div className="submit-options">
        <button className="validator-submit-button">Submit</button>
        <button className="validator-deny-button">Delete</button>
      </div>
    </form>
  );
}
