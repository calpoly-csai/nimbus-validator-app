import React, { Component } from "react";
import Token from "./Token";
import ContentEditable from "react-contenteditable";
import AutocompleteList from "./AutocompleteList";
export default class ValidatorField extends Component {
  state = {
    html: "",
    isFocused: false,
    fieldRef: React.createRef(),
    showAutocomplete: false,
    tokenVal: ""
  };

  componentDidMount() {
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
    this.updateAutocomplete();
    this.checkTokenValidity();
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  }

  checkTokenValidity() {
    let val = this.state.html;
    if (!val) return;
    let isFieldValid = true;
    let tokenInHTML = /(?<=>)[^<>]*(?=<\/u>)/g;
    let matchArr;
    while ((matchArr = tokenInHTML.exec(val)) !== null) {
      let tokenText = matchArr[0];
      let entity = this.getEntityFromToken(tokenText);
      let attribute = this.getAttributeFromToken(entity, tokenText);
      let isTokenValid = (
        tokenText === entity ||
        (entity !== "" && attribute !== "")
      );
      if (!isTokenValid)
        isFieldValid = false;
    }
    if (isFieldValid !== this.props.isValid)
      this.props.onValidationChange(isFieldValid);
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
   * Replaces the partial entity name typed by the user with the complete
   * entity name provided by 'val'
   */
  autocompleteVal(val) {
    let updatedContent = this.state.html.replace(
      `>${this.state.tokenVal}</u>`, `>${val}</u>`
    );
    debugger
    updatedContent = this.updateTokenColor(updatedContent, val);
    this.setState({ html: updatedContent });
  }

  /** If the name of an entity exists at the start of the token, returns that 
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

  /**
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
  * Returns natural index of the token that starts at the provided index in the 
  * html string.
  * Takes an html string and slices from it start up to the endIndex
  */
  getTokenChildIndex(html, endIndex) {
    let precedingText = html.slice(0, endIndex);
    let closingTag = /<\/u>/g;
    let matchCount = precedingText.match(closingTag)

    // matchCount is either null or an array
    return (matchCount) ? matchCount.length + 1 : 1;
  }

  /*
   * Changes a token's color if it is valid by adding/removing inline styles.
   * Takes the current field's html and token text, and updates the color if 
   * the token:
   * - doesn't contain an entity in the list of queried entities
   * - contains a valid entity followed by a dot, but has an invalid attribute
   */
  updateTokenColor(html, tokenVal) {
    let entity = this.getEntityFromToken(tokenVal);
    let attr = this.getAttributeFromToken(entity, tokenVal);
    let tagWithStyle = `<u style="background:var(--invalid);">${tokenVal}</u>`;
    let plainTag = `<u>${tokenVal}</u>`;
    let isValidToken = (
      (tokenVal === entity && entity !== "") ||
      (tokenVal === `${entity}.${attr}` && entity !== "" && attr !== "")
    );
    // if (isValidToken && html.indexOf(tagWithStyle) > -1) {
    //   // html = html.replace(tagWithStyle, plainTag);
    // } else if (!isValidToken && html.indexOf(plainTag) > -1) {
    //   // html = html.replace(plainTag, tagWithStyle);
    // }
    let tokenIndex;
    if (tokenVal !== "") {
      tokenIndex = this.getTokenChildIndex(html, html.indexOf(plainTag))
      console.log(tokenIndex)
      // TODO: use the token index with nth-child to style the token
        /*

        .text-field {
          u:nth-child(2) {
            --token-color: red;
          }
        }

        */
    }
    return html;
  }

  createToken(title) {
    console.log("Create a token with title", title);
  }

  updateQueryData(html) {
    // Reformat phrase to meet database standards
    // (e.g. braces, double dot, spacing)
    html = html
      .replace(/<u[^>]*>/g, "[")
      .replace(/<\/u>/g, "]")
      .replace(/&nbsp;/g, " ");
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
    const selectedToken = this.getSelectedToken();
    // Why is this line causing the component to re-render?
    newHTML = this.updateTokenColor(newHTML, selectedToken);
   // this.updateAutocomplete(selectedToken);
    this.setState({ html: newHTML });
    this.updateQueryData(newHTML);
  };

  render() {
    let focusedBlock = {
      background: "var(--accent)",
      transform: "scaleX(1.4) translateX(-2px)",
    };

    return (
      <div className="ValidatorField">
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
