import { components } from "../components";

import { init } from "snabbdom/build/package/init";
import { classModule } from "snabbdom/build/package/modules/class";
import { propsModule } from "snabbdom/build/package/modules/props";
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";

/**
 * WIP:
 * - Render the component
 * - Manage rendering queue
 * - Observe changes
 */

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

function render(componentObject) {
  console.log("RENDER FUNCTION CALLED");

  let newNode = componentObject.component.renderFn();

  patch(componentObject.node, newNode);

  componentObject.node = newNode;
}

let renderQueue = new Set();
let rendering = false;

function queue(componentObject) {
  renderQueue.add(componentObject);
  if (!rendering) {
    queueMicrotask(consumeQueue);
    rendering = true;
  }
}

function consumeQueue() {
  console.log("CONSUMING");
  for (let fn of [...renderQueue]) {
    render(fn);
    renderQueue.delete(fn);
  }
  rendering = false;
}

export default function initRendering() {
  let instantiatedComponents = [];
  for (let comp of components) {
    let containers = Array.from(document.getElementsByTagName(comp.selector));

    //TODO : Manage nested components
    for (let cont of containers) {
      //Create an object with the component instance and it's node
      let currentComponent = { component: new comp(), node: cont };

      //For each property of the state object add a setter
      for (let propertyKey of Object.keys(currentComponent.component.state)) {
        //TODO: Managing nested objects and lists

        if (Array.isArray(currentComponent.component.state[propertyKey])) {
          currentComponent.component.state[propertyKey] = new Proxy(
            currentComponent.component.state[propertyKey],
            {
              apply: function (target, thisArg, argumentsList) {
                return thisArg[target].apply(this, argumentList);
              },
              deleteProperty: function (target, property) {
                console.log("Deleted %s", property);
                queue(currentComponent);
                return true;
              },
              set: function (target, property, value, receiver) {
                target[property] = value;
                console.log("Set %s to %o", property, value);
                queue(currentComponent);
                return true;
              },
            }
          );
        } else {
          let temp = currentComponent.component.state[propertyKey];

          Object.defineProperty(currentComponent.component.state, propertyKey, {
            get: function () {
              return temp;
            },
            set: function (x) {
              temp = x;
              console.log("UPDATED :", propertyKey);
              queue(currentComponent);
            },
          });
        }
      }

      //Add it to the components list
      instantiatedComponents.push(currentComponent);

      //First render with initial state
      render(currentComponent);
    }
  }
}
