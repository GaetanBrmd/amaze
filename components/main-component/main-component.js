import { Component } from "../component";
import { renderFn } from "./main-component-render";

export class MainComponent extends Component {
  static selector = "main-component";

  constructor() {
    super();

    this.state = {
      count: 0,
      text: "My Text Inserted",
      list: ["🦄", "🦊", "🐶"],
      objectList: [{ p1: 1, p2: 3 }, { p3: 5 }],
      nestedObject: { l1: { l2: false }, bool: true },
    };

    this.renderFn = () => renderFn(this);
  }

  increment() {
    this.state.count++;
    this.state.text = "o" + this.state.count;
    this.popPig();
  }

  popPig() {
    this.state.list.push("pig");
  }

  nestedListAndObject() {
    this.state.objectList[0].p1++;
    this.state.nestedObject.l1.l2 = true;
  }

  odd(o) {
    return !o % 2
  }
}
