import React from "react";

export default function AutocompleteList({
  entities = {},
  synonyms = {},
  showAttributes,
  inputVal,
  onSelect,
  onCreate,
}) {
  /*
   * Inserts token into the UI, replacing whatever text the user already wrote 
   * in the token
   */
  let handleSelect = (entity) => {
    onSelect(entity);
  };

  
  /*
   * Returns a list of synonym autocomplete options, filtered by the input
   */
  let listSynonyms = () => {
    let entitiesSeen = [];
    return (
      Object.keys(synonyms)
      .filter(entity => entity.toUpperCase().startsWith(inputVal.toUpperCase()))
      .map((entity) => {
        if (!entitiesSeen.includes(synonyms[entity])) {
          entitiesSeen.push(synonyms[entity])
          return (
            <li key={entity} onClick={handleSelect.bind(this, synonyms[entity])} >
              {synonyms[entity]}
            </li >
          )
        }
      })
    );
  };

  /*
   * Returns a list of attribute autocomplete options, filtered by the input
   */
  let listAttributes = () => {
    let entity = showAttributes;
    let inputAttr = inputVal.match(/(?<=\.).*/);
    if(!entities[entity]){
      return
    }
    return entities[entity]['attributes']
      .filter((attr) => attr.includes(inputAttr))
      .map((attr) => {
      return (
        <li key={attr} onClick={handleSelect.bind(this, `${entity}.${attr}`)} >
          {attr}
        </li >
      )
    })
  }

  let showOptions = showAttributes ? listAttributes() : listSynonyms();

  /* 
   * Render the list of tokens, if not display an add token button
   */
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
