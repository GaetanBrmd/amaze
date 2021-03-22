import { h } from "snabbdom/build/package/h";
import { components } from "..";

export function renderFn(component) {
  return h("div#app", [
    h(
      "button",
      {
        style: { fontWeight: "bold" },
        on: { click: () => setTimeout(component.increment()) },
      },
      "Click On Me ! "
    ),
    h(
      "span",
      { style: { fontDtyle: "italic" } },
      `You've clicked ${component.state.count} times... `
    ),
    (() => {
      if (!(component.state.count % 2))
        return h(
          "span",
          { on: { click: () => setTimeout(component.nestedListAndObject()) } },
          "Even number of clicks here."
        );
    })(),
    h("div", `My inserted text here : ${component.state.text}`),
    h(
      "ul",
      (() => {
        let array = [];
        for (let o of component.state.list)
          array.push(
            h("li", { on: { click: () => setTimeout(component.popPig()) } }, o)
          );
        return array;
      })()
    ),
  ]);
}
