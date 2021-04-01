import { h } from "snabbdom/build/package/h";

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
    ...(!(component.state.count % 2)
      ? [
          h(
            "span",
            {
              on: { click: () => setTimeout(component.nestedListAndObject()) },
            },
            "Even number of clicks here."
          ),
        ]
      : []),
    h("div", `My inserted text here : ${component.state.text}`),
    h("ul", [
      ...(() =>
        component.state.list.map((o) =>
          h("li", { on: { click: () => setTimeout(component.popPig()) } }, o)
        ))(),
    ]),
    h("input", {
      on: {
        keypress: console.log,
      },
    }),
  ]);
}
