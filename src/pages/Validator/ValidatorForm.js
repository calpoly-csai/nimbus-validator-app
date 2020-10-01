import React, { useState, useEffect } from "react";
import ValidatorField from "./ValidatorField";
import ValidatorToggle from "./ValidatorToggle";
import ValidatorSelector from "./ValidatorSelector";
import axios from 'axios';

export default function ValidatorForm({ query, onDelete, onSubmit }) {
  let [question, setQuestion] = useState(query.question);
  let [answer, setAnswer] = useState(query.answer);
  // TODO: Passing in 'true' for validity is not entirely safe-
  // This makes the assumption that the fetched phrases are valid
  let [questionValid, setQuestionValid] = useState(true);
  let [answerValid, setAnswerValid] = useState(true);
  let [isAnswerable, setAnswerable] = useState(
    query.isAnswerable ? "Yes" : "No"
  );
  let [entities, setEntities] = useState(null);
  let [questionType, setQuestionType] = useState(query.type);
  let [selectorOptions] = useState([
    { title: "Fact", value: "fact" },
    { title: "Related", value: "related" },
    { title: "Statistics", value: "statistics" },
    { title: "Other", value: "other" },
  ]);
  /** Fetch autcomplete information for tokens */
  let fetchAutoComplete = async () => {
    let { data } = await axios.get('/entity_structure');
    setEntities(data);
  };
  useEffect(() => { fetchAutoComplete(); }, []);

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
        value={question}
        onChange={setQuestion}
        queryId={query.id}
        entities={entities}
        onValidationChange={setQuestionValid}
      />
      <ValidatorField
        title="Answer"
        value={answer}
        onChange={setAnswer}
        queryId={query.id}
        entities={entities}
        onValidationChange={setAnswerValid}
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
          disabled={!questionValid || !answerValid}
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
