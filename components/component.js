import { h } from "snabbdom/build/package/h";

export class Component {
  //HTML selector to find where you need to insert the component
  static selector = "app";

  constructor() {
    //Render function of the component that must return a snabbdom virtual tree of vnode
    this.renderFn = () => {
      "div", "Component working !";
    };

    //Component internal state (every variable used in the rendering must be here)
    this.state;
  }
}
