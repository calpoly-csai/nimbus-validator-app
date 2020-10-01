 /** @jsx jsx */

import React, { Component } from "react";
import { css, jsx } from '@emotion/core'
import Token from "./Token";
import ContentEditable from "react-contenteditable";
import AutocompleteList from "./AutocompleteList";
export default class ValidatorField extends Component {
  state = {
    html: "",
    isFocused: false,
    fieldRef: React.createRef(),
    showAutocomplete: false,
    tokenVal: "",
    tokenStates: []
  };

  componentDidMount() {
    this.setState({ html: this.formatQueryHTML(this.props.value) });
  }

  /* If a different query is navigated to, display the new text. */
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps)
      this.setState({ html: this.formatQueryHTML(this.props.value) });
  }

  formatQueryHTML(query) {
    return query.replace(/\[/g, "<u>")
                .replace(/\]/g, "</u>")
                .replace(/\.\./g, ".");
  }

  toggleToken(e) {
    let tokenKeys = /\[|\]|\bEnter/;
    if (!tokenKeys.test(e.key)) return;
    document.execCommand("underline");
    document.execCommand("insertText", true, " ");
    e.preventDefault();
  }

  toggleFocus() {
    this.updateAutocomplete(this.getSelectedToken());
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  }

  formatHTML(innerHTML) {
    return this.eliminateFontElement(innerHTML).replace(
      /<u>&nbsp;(?=\w+)/g,
      "<u>"
    );
  }

  eliminateFontElement(innerHTML) {
    let fontStart = innerHTML.indexOf("<font");
    if (fontStart === -1) return innerHTML;
    let uStart = innerHTML.indexOf("<u", fontStart);
    let uEnd = innerHTML.indexOf("</u>", uStart) + 4;
    let fontEnd = innerHTML.indexOf("</font", uEnd) + 7;
    let filteredHTML =
      innerHTML.slice(0, fontStart) +
      innerHTML.slice(uStart, uEnd) +
      innerHTML.slice(fontEnd);
    return filteredHTML;
  }

  getSelectedToken() {
    let sel = window.getSelection();
    let isToken = sel?.anchorNode?.parentElement?.nodeName === "U";
    return isToken ? sel.anchorNode.wholeText : "";
  }

  updateAutocomplete(tokenVal) {
    if (tokenVal) {
      this.setState({ showAutocomplete: true });
      this.setState({ tokenVal: tokenVal });
    } else {
      this.setState({ showAutocomplete: false });
      this.setState({ tokenVal: "" });
    }
  }

  /*
   * Replaces the partial entity/attribute name typed by the user with the 
   * complete name provided by 'val'.
   * Hides the autocomplete options after replacement.
   */
  autocompleteVal(val) {
    let updatedHTML = this.state.html.replace(
      `>${this.state.tokenVal}</u>`, `>${val}</u>`
    );
    this.updateTokenColor(updatedHTML);
    this.updateQueryData(updatedHTML);
    this.setState({ html: updatedHTML, showAutocomplete: false });
  }

/*
 * If the name of an entity exists at the start of the token, returns that 
 * entity's name. Else, returns empty string.
 */
 getEntityFromToken(tokenVal) {
  for (let entity in this.props.entities) {
    let startsWithEntityName = new RegExp(`^${entity}`);
      if (startsWithEntityName.test(tokenVal))
        return entity;
    }
    return "";
  }

  /*
   * If the token contains an entity, followed by a dot, followed by a complete 
   * attribute name, returns that attribute's name. Else, returns an empty 
   * string.
   */
  getAttributeFromToken(entity, tokenVal) {
    let tokenAttr = "";
    if (!entity) return tokenAttr;
    this.props.entities[entity]['attributes'].forEach(attr => {
      let attrMatch = new RegExp(`(?<=\\.)${attr}`);
      if (attrMatch.test(tokenVal))
        tokenAttr = attr;
    });
    return tokenAttr;
  }

  /*
   * Updates the color of each token to match whether it's text is valid.
   * Additionally, it disables the submission button if an invalid token exists
   *  (or re-enables it if all tokens are valid).
   * Takes the current field's html, and updates a token's color if it:
   *   - doesn't contain an entity in the list of queried entities
   *   - contains a valid entity followed by a dot, but has an invalid attribute
   */
  updateTokenColor(html) {
    let isFieldValid = true;
    let tokenStates = [];
    let taggedTokenRegex = /<u>[^<]*<\/u>/g;
    let tokenValRegex = /(?<=<u>)[^<]*(?=<\/u>)/g;
    let taggedToken = taggedTokenRegex.exec(html);
    while (taggedToken) {
      let tokenVal = taggedToken[0].match(tokenValRegex)[0];
      let entity = this.getEntityFromToken(tokenVal);
      let attr = this.getAttributeFromToken(entity, tokenVal);
      let isValidToken = (
        (tokenVal === entity && entity !== "") ||
        (tokenVal === `${entity}.${attr}` && entity !== "" && attr !== "")
      );
      tokenStates.push(isValidToken);
      if (!isValidToken)
        isFieldValid = false;
      taggedToken = taggedTokenRegex.exec(html);
    }
    if (isFieldValid !== this.props.isValid)
      this.props.onValidationChange(isFieldValid);
    this.setState({ tokenStates });
  }

  createToken(title) {
    console.log("Create a token with title", title);
  }

  updateQueryData(html) {
    // Reformat phrase to follow database syntax
    // (e.g. braces, double dot, spacing)
    html = html
      .replace(/<u[^>]*>/g, "[")
      .replace(/<\/u>/g, "]")
      .replace(/&nbsp;/g, " ")
      .replace(/<\/?span[^>]*>/g, "");
    let dotInToken = /(?<!\.)\.(?!\.)[^\.\[\]]*\]/g;
    let match = dotInToken.exec(html);
    while (match) {
      html = html.slice(0, match.index) + "." + html.slice(match.index);
      match = dotInToken.exec(html);
    }
    this.props.onChange(html);
  }

  handleTextInput = (e) => {
    let newHTML = this.formatHTML(e.target.value);
    this.updateTokenColor(newHTML);
    const selectedToken = this.getSelectedToken();
    this.updateAutocomplete(selectedToken);
    this.setState({ html: newHTML });
    this.updateQueryData(newHTML);
  };

  render() {
    let focusedBlock = {
      background: "var(--accent)",
      transform: "scaleX(1.4) translateX(-2px)",
    };
    const tokenStyles = this.state.tokenStates.map((isValid, i) => {
      return `
      .text-field > u:nth-of-type(${i + 1}) {
        background: ${isValid ? "var(--accent)": "var(--invalid)"};
      }
      `
    }).join("\n");

    const parentStyles = css`
      ${tokenStyles}
    `

    return (
      <div className="ValidatorField" css={parentStyles}>
        <div
          className="block"
          style={this.state.isFocused ? focusedBlock : null}
        ></div>
        <h3 className="field-title">{this.props.title}</h3>
        <ContentEditable
          onBlur={this.toggleFocus.bind(this)}
          onClick={() => this.updateAutocomplete(this.getSelectedToken())}
          onFocus={this.toggleFocus.bind(this)}
          onKeyDown={this.toggleToken.bind(this)}
          className="text-field"
          innerRef={this.state.fieldRef}
          onChange={this.handleTextInput.bind(this)}
          html={this.state.html} // innerHTML of the editable div
          disabled={false} // use true to disable editing
        />
        {this.state.showAutocomplete && (
          <AutocompleteList   
            entities={this.props.entities}
            entityName={this.getEntityFromToken(this.state.tokenVal)}
            inputVal={this.state.tokenVal}
            onSelect={this.autocompleteVal.bind(this)}
            onCreateEntity={this.createToken.bind(this)}
          />
        )}
      </div>
    );
  }
}
