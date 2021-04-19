import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("div#app", [h("button", {
    on: {
      click: () => setTimeout(component.increment())
    }
  }, [`Click On Me`]), h("span", [`You have clicked ${component.state.count} times...`]), ...(component.odd(component.state.count) ? [h("span", [`Even number of clicks here.`])] : []), h("div", [`My inserted text here : ${component.state.text}`]), h("ul", [...component.state.list.map(o => h("li", [`${o}`]))]), h("input", {
    on: {
      keypress: () => setTimeout(component.increment())
    }
  }, [])])]);
}