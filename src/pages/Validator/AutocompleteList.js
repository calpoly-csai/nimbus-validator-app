import React from "react";

export default function AutocompleteList({
  entities = {},
  synonyms = {},
  showAttributes,
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
  let showOptions = Object.keys(synonyms)
    .filter((entity) => entity.toUpperCase().startsWith(inputVal.toUpperCase()))
    .map((entity) => {
      if (!entitiesSeen.includes(synonyms[entity])) {
        entitiesSeen.push(synonyms[entity])
        return (
          <li key={entity} onClick={handleSelect.bind(this, synonyms[entity])} >
            {synonyms[entity]}
          </li >
        )
      }
    });

    // TODO: filter the attribute names
    // TODO: fix the onclick handler
  let listAttributes = () => {
    let entity = showAttributes;
    if(!entities[entity]){
      return
    }
    return entities[entity]['attributes'].map((attr) => {
      return (
        <li key={attr} onClick={handleSelect.bind(this, synonyms[entity])} >
          {attr}
        </li >
      )
    })
  }
  
  if (showAttributes) {
    showOptions = listAttributes()
  }

  // Render the list of tokens, if not display an add token button
  return (
    <ul className="AutocompleteList">
      {showOptions.length ? (
        showOptions
      ) : (
          <li className="add-token" onClick={() => onCreate(inputVal)}>
            Add Token
          </li>
        )}
    </ul>
  );
}
