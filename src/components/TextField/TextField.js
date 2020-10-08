import React, { useState } from "react";
import "./TextField.scss";
export default React.forwardRef((props, ref) => {
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
    errorStyle = { borderBottom: "2px solid var(--deny)" };
  }
  return (
    <div className="TextField" ref={ref}>
      <p className="label" style={labelStyle}>
        {props.placeholder}
      </p>
      <div className="field-container">
        <ion-icon
          name={props.icon}
          className="icon"
          style={{ fontSize: "40px" }}
        ></ion-icon>
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
    </div>
  );
});
