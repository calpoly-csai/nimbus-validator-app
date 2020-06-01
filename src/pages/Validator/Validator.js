import React, { useState } from "react";
import "./Validator.scss";

import SignOut from "../../components/SignOut/SignOut";

export default function Validator(props) {
  let [isTokenizerShown, setIsTokenizerShown] = useState(true);

  let tokenizer = (
    <div className="tokenizer">
      {" "}
      <h1>Tokenizer</h1>
      <button
        className="primary"
        onClick={() => {
          setIsTokenizerShown((prev) => !prev);
        }}
      >
        Edit Text
      </button>
    </div>
  );

  let textEditor = (
    <div className="text-editor">
      <h3 className="field-label">Question</h3>
      <div className="text-input" contentEditable="true"></div>
      <h3 className="field-label">Answer</h3>
      <div className="text-input" contentEditable="true"></div>
      <div className="validator-buttons">
        <button
          className="primary"
          onClick={() => {
            setIsTokenizerShown((prev) => !prev);
          }}
        >
          Edit Text
        </button>
        <button className="primary">Tokenize</button>
        <button className="primary">Remove Question</button>
      </div>
      <div>
        <select>
          <option value="0">Select Label:</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="Validator">
      <div className="signOut">
        <SignOut setSignedIn={props.setSignedIn} />
      </div>

      <div className="validator-content">
        <h1 className="title">Welcome to the Validator!</h1>
        {isTokenizerShown ? tokenizer : textEditor}
      </div>
    </div>
  );
}
