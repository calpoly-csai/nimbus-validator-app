import React, { Fragment } from "react";

export default function ValidatorSelector({
  title,
  options = [],
  value,
  onChange,
}) {
  let handleSelect = (e) => onChange(e.target.value);

  return (
    <div className="ValidatorSelector">
      <h3 className="field-title">{title}</h3>
      <select onChange={handleSelect} value={value}>
        {options.map((option) => (
          <option key={option.title} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
}
