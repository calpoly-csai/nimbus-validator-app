import React from "react";

export default function ValidatorQueryNav({
  bufferLength = 0,
  selectedIndex = 0,
  onChange,
}) {
  let selectedStyle = {
    background: "var(--accent)",
    border: "2px solid var(--text)",
  };
  let queryNavButtons = [];
  for (let i = 0; i < bufferLength; i++) {
    queryNavButtons.push(
      <button
        className="query-nav"
        style={i === selectedIndex ? selectedStyle : null}
        key={i}
        onClick={() => onChange(i)}
      ></button>
    );
  }

  return (
    <div className="ValidatorQueryNav">
      <hr className="center-line" />
      {queryNavButtons}
    </div>
  );
}
