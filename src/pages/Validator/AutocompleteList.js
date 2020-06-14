import React from "react";

export default function AutocompleteList({
  options = [],
  inputVal,
  onSelect,
  onCreate,
}) {
  let handleSelect = (i) => {
    onSelect(options[i]);
  };

  let shownOptions = options
    .filter((option) => option.toLowerCase().startsWith(inputVal.toLowerCase()))
    .map((option, i) => (
      <li key={option} onClick={handleSelect.bind(this, i)}>
        {option}
      </li>
    ));

  return (
    <ul className="AutocompleteList">
      {shownOptions.length ? (
        shownOptions
      ) : (
        <li className="add-token" onClick={() => onCreate(inputVal)}>
          Add Token
        </li>
      )}
    </ul>
  );
}
