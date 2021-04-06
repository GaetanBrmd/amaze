import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("h1.bidule.prout", [`My First Heading`]), h("p#a", [`My first paragraph.`]), h("div", [h("h2", [`Title`]), h("ul", [h("li", [`item ${component.state.e}`])])])]);
}