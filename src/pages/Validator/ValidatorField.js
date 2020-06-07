import React, { useState } from "react";

export default function ValidatorField({ placeholder, changed, value, title }) {
  let [isFocused, setFocused] = useState(false);
  let toggleFocus = () => {
    setFocused((focused) => !focused);
  };
  let focusedBlock = {
    background: "var(--accent)",
    transform: "scaleX(1.4) translateX(-2px)",
  };

  return (
    <div className="ValidatorField">
      <div className="block" style={isFocused ? focusedBlock : null}></div>
      <h3 className="field-title">{title}</h3>
      <div
        className="text-field"
        role="textbox"
        onChange={(e) => changed(e.target.value)}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        value={value}
        placeholder={placeholder}
        contentEditable
      />
    </div>
  );
}
