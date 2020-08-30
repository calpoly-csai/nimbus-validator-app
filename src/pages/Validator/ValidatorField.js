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

  updateAutocomplete() {
    let sel = window.getSelection();
    let isToken = sel?.anchorNode?.parentElement?.nodeName === "U";
    if (isToken) {
      this.setState({ showAutocomplete: true });
      this.setState({ tokenVal: sel.anchorNode.wholeText });
    } else {
      this.setState({ showAutocomplete: false });
      this.setState({ tokenVal: "" });
    }
    return isToken ? sel.anchorNode.wholeText : "";
  }

  /*
   * Replaces the partial entity name typed by the user with the complete
   * entity name provided by 'val'
   */
  autocompleteVal(val) {
    let updatedContent = this.state.html.replace(
      `>${this.state.tokenVal}</u>`, `>${val}</u>`
    );
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
   * Changes a token's color if it is valid by adding/removing inline styles.
   * Takes the current field's html and token text, and updates the color if 
   * the token:
   * - doesn't contain an entity in the list of queried entities
   * - contains a valid entity followed by a dot, but has an invalid attribute
   */
  updateTokenColor(html, tokenVal) {
    let entity = this.getEntityFromToken(tokenVal);
    let attr = this.getAttributeFromToken(entity, tokenVal);
    let tagWithStyle = `<u style="background:var(--invalid);">${tokenVal}<`;
    let plainTag = `<u>${tokenVal}<`;
    let isValidToken = (
      (tokenVal === entity && entity !== "") ||
      (tokenVal === `${entity}.${attr}` && entity !== "" && attr !== "")
    );
    let mustUpdateStyle = (
      (html.indexOf(tagWithStyle) > -1 || html.indexOf(plainTag) > -1) &&
      tokenVal.length > 1
    );

    // console.log(`HTML: ${html}`)
    // console.log(`tokenVal: ${tokenVal}`)
    // console.log(`entity: ${entity}`)
    // console.log(`attribute: ${attr}`)

    if (isValidToken && mustUpdateStyle) {
      html = html.replace(tagWithStyle, plainTag);
    } else if (!isValidToken && mustUpdateStyle) {
      html = html.replace(plainTag, tagWithStyle);
    }
    return html;
  }

  createToken(title) {
    console.log("Create a token with title", title);
  }

  handleTextInput = (e) => {
    let val = this.formatHTML(e.target.value);
    let newTokenVal = this.updateAutocomplete();
    val = this.updateTokenColor(val, newTokenVal);
    this.setState({ html: val });
    // Reformat phrase to meet database standards
    // (e.g. braces, double dot, spacing)
    val = val
      .replace(/<u[^>]*>/g, "[")
      .replace(/<\/u>/g, "]")
      .replace(/&nbsp;/g, " ");
    let dotInToken = /(?<!\.)\.(?!\.)[^\.\[\]]*\]/g;
    let match = dotInToken.exec(val);
    while (match) {
      val = val.slice(0, match.index) + "." + val.slice(match.index);
      match = dotInToken.exec(val);
    }
    this.props.onChange(val);
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
          onClick={this.updateAutocomplete.bind(this)}
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
