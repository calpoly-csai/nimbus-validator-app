import React from "react";

export default function AutocompleteList({
  entities = {},
  inputVal,
  onSelect,
  onCreate,
}) {
  // Calls onSelect to insert token into the UI
  let handleSelect = (entity) => {
    onSelect(entity);
  };

  let entitiesSeen = [];

  // Create a list of synonyms, filter them with the input value, and then return a token if the entity isn't already displayed
  let shownOptions = Object.keys(entities)
    .filter((entity) => entity.toUpperCase().startsWith(inputVal.toUpperCase()))
    .map((entity) => {
      if (!entitiesSeen.includes(entities[entity])) {
        entitiesSeen.push(entities[entity])
        return (
          <li key={entity} onClick={handleSelect.bind(this, entities[entity])} >
            {entities[entity]}
          </li >
        )
      }
    });

  // Render the list of tokens, if not display an add token button
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
