import React, { useState, useRef } from "react";
import Token from "./Token";
export default function ValidatorField({
  placeholder,
  changed,
  value = "",
  title,
}) {
  let field = useRef(null);
  let [isFocused, setFocused] = useState(false);
  let toggleFocus = () => {
    setFocused((focused) => !focused);
  };

  let focusedBlock = {
    background: "var(--accent)",
    transform: "scaleX(1.4) translateX(-2px)",
  };

  let changeFieldSelection = (i) => {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(field.current.childNodes[0], i);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  let handleTextInput = (e) => {
    console.log("input");
    if (e.nativeEvent.data === "{") {
      e.target.innerText += "}";
      let text = e.target.innerText;
      changeFieldSelection(text.length - 1);
    }
    let val = e.target.innerText;
    changed(val);
    console.log(value);
  };
  let evenTokens = value.length && value[0] === "{";
  let fieldContent = value.split(/[\{\}]/).map((section, i) => {
    if ((evenTokens && !(i % 2)) || (!evenTokens && i % 2)) {
      return <Token>{section}</Token>;
    } else return section;
  });
  console.log(fieldContent);
  console.log(value);
  if (field.current) field.current.innerHTML = "";

  return (
    <div className="ValidatorField">
      <div className="block" style={isFocused ? focusedBlock : null}></div>
      <h3 className="field-title">{title}</h3>
      <div
        ref={field}
        className="text-field"
        role="textbox"
        onInput={handleTextInput}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        value={value}
        placeholder={placeholder}
        contentEditable
      >
        {fieldContent}
      </div>
    </div>
  );
}
