import React, { useState, useEffect, useCallback } from "react";
import ValidatorField from "./ValidatorField";
import ValidatorToggle from "./ValidatorToggle";
import ValidatorSelector from "./ValidatorSelector";
import axios from 'axios';

export default function ValidatorForm({ query, onDelete, onSubmit }) {
  let [question, setQuestion] = useState(query.question);
  let [answer, setAnswer] = useState(query.answer);
  let [isAnswerable, setAnswerable] = useState(
    query.isAnswerable ? "Yes" : "No"
  );
  //TODO: Make this React controlled state when we actually fetch
  let [autoCompleteOptions, setautoCompleteOptions] = useState(null);
  let [questionType, setQuestionType] = useState(query.type);
  let [selectorOptions] = useState([
    { title: "Fact", value: "fact" },
    { title: "Related", value: "related" },
    { title: "Statistics", value: "statistics" },
    { title: "Other", value: "other" },
  ]);
  let fetchAutoComplete = async () => {
    let {data} = await axios.get('/entity_structure');
    setautoCompleteOptions(Object.keys(data));
    console.log(data)
  };
  useEffect(fetchAutoComplete, []);

  /** When Query changes, update the internal state of the form */
  let updateQueryState = () => {
    setQuestion(query.question);
    setAnswer(query.answer);
    setAnswerable(query.isAnswerable ? "Yes" : "No");
    setQuestionType(query.type);
  };
  useEffect(updateQueryState, [query]);

  /**Uploads query payload when the updated query is valid */
  let uploadValidatedQuery = () => {
    let shouldSubmit = [question, answer, isAnswerable, questionType].every(
      Boolean
    );
    if (!shouldSubmit) return;
    let payload = {
      question,
      answer,
      isAnswerable,
      type: questionType,
      id: query.id,
    };
    console.log("This will add the edited query to the database", payload);
    onSubmit(payload);
  };
  /**Deletes query from the server and removes it locally */
  let deleteQuery = () => {
    onDelete();
    console.log(
      "This will delete the currently selected query in server as well:",
      query.id
    );
  };

  return (
    <form className="ValidatorForm" onSubmit={(e) => e.preventDefault()}>
      <ValidatorField
        title="Question"
        value={query.question}
        onChange={setQuestion}
        queryId={query.id}
        autocompleteOptions={autoCompleteOptions}
      />
      <ValidatorField
        title="Answer"
        value={query.answer}
        onChange={setAnswer}
        queryId={query.id}
        autocompleteOptions={autoCompleteOptions}
      />
      <div className="query-properties">
        <ValidatorToggle
          title="Can we answer?"
          options={["Yes", "No"]}
          onChange={setAnswerable}
          value={isAnswerable}
        />
        <ValidatorSelector
          title="Type"
          options={selectorOptions}
          onChange={setQuestionType}
          value={questionType}
        />
      </div>
      <div className="submit-options">
        <button
          className="validator-submit-button"
          onClick={uploadValidatedQuery}
        >
          Submit
        </button>
        <button className="validator-deny-button" onClick={deleteQuery}>
          Delete
        </button>
      </div>
    </form>
  );
}
