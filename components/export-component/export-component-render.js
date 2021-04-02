import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("h1.bidule.prout", [`My First Heading`]), h("button#a", {
    on: {
      click: () => setTimeout(component.print())
    }
  }, [`My first button.`]), ...(component.state.e > 10 ? [h("div", [`abc`, h("h2", [`Title`]), h("p", [`azeaze ${component.state.e.toString()}`]), h("ul", [...component.state.array.map(e => h("li", {
    on: {
      click: () => setTimeout(e++)
    }
  }, [`item ${e}`, h("a", [`link`])]))])])] : [])]);
}