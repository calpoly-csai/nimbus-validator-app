import React, { useMemo } from "react";

export default function AutocompleteList({
  entities = {},
  entityName,
  inputVal,
  onSelect,
  onCreateEntity
}) {
  // Map entities and their synonyms to their correct entity
  const synonyms = useMemo(() => {
    let synonymEntityMapping = {};
    for (let entity in entities) {
      synonymEntityMapping[entity] = entity;
      for (let syn of entities[entity]['synonyms']) {
        synonymEntityMapping[syn] = entity;
      }
    }
    return synonymEntityMapping;
  }, [entities]);

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
    let entitiesMatched = new Set();
    return (
      Object.keys(synonyms)
      .filter(syn => syn.toUpperCase().startsWith(inputVal.toUpperCase()))
      .map(syn => {
        if (!entitiesMatched.has(synonyms[syn])) {
          entitiesMatched.add(synonyms[syn]);
          return (
            <li key={syn} onClick={handleSelect.bind(this, synonyms[syn])} >
              {synonyms[syn]}
            </li >
          );
        }
      })
    );
  };

  /*
   * Returns a list of attribute autocomplete options, filtered by the input
   */
  let listAttributes = () => {
    let entity = entityName;
    let inputAttr = inputVal.match(/(?<=\.).*/);
    if(!entities[entity]){
      return;
    }
    return entities[entity]['attributes']
      .filter((attr) => attr.includes(inputAttr))
      .map((attr) => {
      return (
        <li key={attr} onClick={handleSelect.bind(this, `${entity}.${attr}`)} >
          {attr}
        </li >
      );
    });
  }

  let showOptions = entityName ? listAttributes() : listSynonyms();

  /* 
   * Render the list of tokens, if not display an add token button
   */
  return (
    <ul className="AutocompleteList">
      {showOptions.length ? (
        showOptions
      ) : (
          <li className="add-token" onClick={() => onCreateEntity(inputVal)}>
            Add Token
          </li>
        )}
    </ul>
  );
}
