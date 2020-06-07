import React, { Fragment } from "react";

export default function ValidatorSelector({ title, options = [], onChange }) {
  let handleSelect = (e) => onChange(e.target.value);

  return (
    <div className="ValidatorSelector">
      <h3 className="field-title">{title}</h3>
      <select onChange={handleSelect}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
