import { Component } from "../component";
import { renderFn } from "./export-component-render";

export class ExportComponent extends Component {
  static selector = "export-component";

  constructor() {
    super();

    this.state = {
      e: 10,
      array: [1, 2, 3],
    };

    this.renderFn = () => renderFn(this);
  }

  isTrue() {
    return true;
  }

  print() {
    console.log("Je print");
    this.state.e++;
    this.state.array.push(this.state.e);
  }
}
