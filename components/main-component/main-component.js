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
      objectList: [{ p1: 1, p2: 3 }],
    };

    this.renderFn = () => renderFn(this);
  }

  increment() {
    this.state.count++;
    this.state.text = "o" + this.state.count;
  }

  popPig() {
    this.state.list[0];
  }

  nestedList() {
    this.state.objectList[0].p1++;
  }
}
