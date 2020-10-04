import React from "react";

export default function ValidatorToggle({
  title,
  options = [],
  value,
  onChange,
}) {
  let optionEls = options.map((option) => (
    <button className="option" onClick={() => onChange(option)} key={option} style={option === value ? {color:"var(--text)"}: {color: "white"}}>
      {option}
    </button>
  ));
  let selectionIndex = optionEls.findIndex((option) => option.key === value);
  let indicatorStyles = {
    width: `${100 / optionEls.length}%`,
    left: `${(selectionIndex / optionEls.length) * 100}%`,
  };

  return (
    <div className="ValidatorToggle">
      <h3 className="field-title">{title}</h3>
      <ul className="options">
        {optionEls}
        <div className="selection-indicator" style={indicatorStyles}></div>
      </ul>
    </div>
  );
}
