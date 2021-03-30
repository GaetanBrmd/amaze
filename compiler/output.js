import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("div", [`mon texte super ${component.state}bbbbbbb${component.state.b}ccc`]);
}