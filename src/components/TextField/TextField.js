import React, { useState } from "react";
import "./TextField.scss";
export default function TextField(props) {
  let [isValid, setValid] = useState(true);
  let labelStyle;
  let errorStyle;

  let validate = () =>
    setValid(props.validator && props.validator(props.value));
  if (props.value.length) {
    labelStyle = {
      opacity: "1",
      transform: "translateY(0)",
    };
  } else {
    labelStyle = {
      opacity: "0",
      transform: "translateY(100%)",
    };
  }

  if (!isValid) {
    errorStyle = { border: "3px solid red" };
  }
  return (
    <div className="TextField">
      <p className="label" style={labelStyle}>
        {props.placeholder}
      </p>
      <input
        type={props.type}
        placeholder={props.placeholder}
        style={errorStyle}
        className="input-field"
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={validate}
        value={props.value}
      />
    </div>
  );
}
