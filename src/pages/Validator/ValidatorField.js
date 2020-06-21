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
    tokenVal: "",
  };

  componentDidMount() {
    this.setState({ html: this.formatQueryHTML(this.props.value) });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value === this.props.value) return;
    let html = this.formatQueryHTML(this.props.value);
    this.setState({ html });
  }

  formatQueryHTML(query) {
    return query.replace(/\{/g, "<u>").replace(/\}/g, "</u>");
  }

  toggleToken(e) {
    let tokenKeys = /\{|\}|\bEnter/;
    if (!tokenKeys.test(e.key)) return;
    document.execCommand("underline");
    document.execCommand("insertText", true, " ");
    e.preventDefault();
  }

  toggleFocus() {
    this.updateAutocomplete();
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
  }

  autocompleteVal(val) {
    //TODO: This replaces first element that matches, even if outside token. Maybe keep track token index and replace only token's innerHTML
    let updatedContent = this.state.html.replace(this.state.tokenVal, val);
    this.setState({ html: updatedContent });
  }

  createToken(title) {
    console.log("Create a token with title", title);
  }

  handleTextInput = (e) => {
    let val = this.formatHTML(e.target.value);
    this.setState({ html: val });
    this.updateAutocomplete();
    val = val
      .replace(/<u>/g, "{")
      .replace(/<\/u>/g, "}")
      .replace(/&nbsp;/g, "");
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
            options={this.props.autocompleteOptions}
            inputVal={this.state.tokenVal}
            onSelect={this.autocompleteVal.bind(this)}
            onCreate={this.createToken.bind(this)}
          />
        )}
      </div>
    );
  }
}
