import { Component } from "../component";
import { renderFn } from "./export-component-render";

export class ExportComponent extends Component {
  static selector = "export-component";

  constructor() {
    super();

    this.state = {};

    this.renderFn = () => renderFn(this);
  }
}
