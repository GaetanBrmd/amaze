import { h } from "snabbdom/build/package/h";
export function renderFn(component) {
  return h("component", [h("h1.bidule.prout", [`My First Heading`]), h("p#a", {
    on: {
      click: () => setTimeout(component.print())
    }
  }, [`My first paragraph.`]), ...(component.state.e > 10 ? [`abc`, ...(component.isTrue() ? [`Title`] : []), h("p", {
    on: {
      click: () => setTimeout(component.print())
    }
  }, [`azeaze ${component.state.e.toString()}`]), h("ul", [h("li", [`item ${component.isTrue()}`])])] : [])]);
}