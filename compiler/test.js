import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("div", [h("h1", [`My First Heading`]), h("p", [`My first paragraph.`]), h("div", [h("h2", [`Title`]), h("ul", [h("li", [`item ${component.state.e}`])])])])]);
}