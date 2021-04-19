import { Component } from "../component";
import { renderFn } from "./export-component-render";

export class ExportComponent extends Component {
  static selector = "export-component";

  constructor() {
    super();

    this.state = {
      e: 10,
      array: ['🦓', '🦍', '🐶'],
    };

    this.renderFn = () => renderFn(this);
  }

  isTrue() {
    return true;
  }

  test(e) {
    return e > 10;
  }

  foo() {
    console.log("foo");
  }

  print() {
    let array = ['🦊','🦝','🐮','🐷','🐑','🦛','🐻','🐨','🐼']
    console.log("Je print");
    this.state.e++;
    this.state.array.push(array[Math.floor(Math.random() * array.length)]);
  }
}
