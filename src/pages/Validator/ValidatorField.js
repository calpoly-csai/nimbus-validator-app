import React, { Component } from "react";
import Token from "./Token";
import ContentEditable from "react-contenteditable";
export default class ValidatorField extends Component {
  state = {
    html: "",
    isFocused: false,
    fieldRef: React.createRef(),
  };
  render() {
    let focusedBlock = {
      background: "var(--accent)",
      transform: "scaleX(1.4) translateX(-2px)",
    };

    // let changeFieldSelection = (i) => {
    //   let range = document.createRange();
    //   let sel = window.getSelection();
    //   range.setStart(field.current.childNodes[0], i);
    //   range.collapse(true);
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    // };

    // let handleTextInput = (e) => {
    //   let val = e.target.value;
    //   if (e.nativeEvent.data === "{") {
    //     val += "}";
    //   }
    //   console.log("val", val);
    //   field.current = val;
    //   // onChange("heelo" + val);
    // };
    // let evenTokens = value.length && value[0] === "{";
    // let fieldContent = value.split(/[\{\}]/).map((section, i) => {
    //   if ((evenTokens && !(i % 2)) || (!evenTokens && i % 2)) {
    //     return <Token>{section}</Token>;
    //   } else return section;
    // });
    // console.log("FieldContent:", field.current, value);
    // if (field.current) field.current.innerHTML = "";

    return (
      <div className="ValidatorField">
        <div
          className="block"
          style={this.state.isFocused ? focusedBlock : null}
        ></div>
        <h3 className="field-title">{this.props.title}</h3>
        <ContentEditable
          onBlur={this.toggleFocus.bind(this)}
          onFocus={this.toggleFocus.bind(this)}
          onKeyDown={this.toggleToken.bind(this)}
          className="text-field"
          onChange={this.handleTextInput.bind(this)}
          html={this.state.html} // innerHTML of the editable div
          innerRef={this.state.fieldRef}
          disabled={false} // use true to disable editing
        />
      </div>
    );
  }

  toggleToken(e) {
    let tokenKeys = /\{|\}|\bTab|\bEnter/;
    if (!tokenKeys.test(e.key)) return;
    document.execCommand("underline");
    document.execCommand("insertText", true, " ");
    e.preventDefault();
    console.log("insert");
  }

  toggleFocus() {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
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
    console.log("filtered html", filteredHTML);
    return filteredHTML;
  }

  handleTextInput = (e) => {
    let val = this.eliminateFontElement(e.target.value);
    this.setState({ html: val });
    val = val
      .replace(/<u>/g, "{")
      .replace(/<\/u>/g, "}")
      .replace(/&nbsp;/g, "");
    this.props.onChange(val);
  };
}
