import React from "react";

export default function ValidatorQueryNav({
  queries = [],
  selectedIndex = 0,
  onChange,
}) {
  let selectedStyle = {
    background: "var(--accent)",
    border: "2px solid var(--text)",
  };
  let queryNavButtons = [];
  for (let i = 0; i < queries.length; i++) {
    let statusClass = queries[i].validated ? " validated" : "";
    queryNavButtons.push(
      <button
        className={`query-nav${statusClass}`}
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
