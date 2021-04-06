import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("h1.bidule.prout", [`My First Heading`]), h("button#a", {
    on: {
      click: () => setTimeout(component.print())
    }
  }, [`My first button.`]), ...(component.test(component.state.e) ? [h("div", [`abc`, h("h2", [`Title`]), h("p", {
    on: {
      dblclick: () => setTimeout(component.foo())
    }
  }, [`azeaze ${component.state.e.toString()}`]), h("ul", [...component.state.array.map(e => h("li", [`item ${e}`, h("a", [`link`])]))])])] : [])]);
}