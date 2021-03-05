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

function watchFor(object, currentComponent) {
  //For each property of the object add a setter
  for (let propertyKey of Object.keys(object)) {
    //If it's a nested object or array
    if (object[propertyKey] instanceof Object) {
      //Call itself recursively for nested objects
      object[propertyKey] = watchFor(object[propertyKey], currentComponent);
    }
    //If it's a primitive type
    else {
      let temp = object[propertyKey];

      Object.defineProperty(object, propertyKey, {
        get: function () {
          return temp;
        },
        set: function (x) {
          console.log("UPDATED :", propertyKey, " WITH :", x);

          temp = x;
          queue(currentComponent);
        },
      });
    }
  }

  //Specific treatment for array because we have to watch for push, slice etc.
  if (Array.isArray(object)) {
    object = new Proxy(object, {
      apply: function (target, thisArg, argumentsList) {
        console.log(thisArg, target, argumentsList);

        return thisArg[target].apply(this, argumentList);
      },
      deleteProperty: function (target, property) {
        console.log("Deleted %s", property);

        queue(currentComponent);
        return true;
      },
      set: function (target, property, value, receiver) {
        console.log("UPDATED :", property, " WITH :", value);

        target[property] = value;
        queue(currentComponent);
        return true;
      },
    });
  }

  //Return the watched object for recursive calls
  return object;
}

export default function initRendering() {
  let instantiatedComponents = [];
  for (let comp of components) {
    let containers = Array.from(document.getElementsByTagName(comp.selector));

    //TODO : Manage nested components
    for (let cont of containers) {
      //Create an object with the component instance and it's node
      let currentComponent = { component: new comp(), node: cont };

      watchFor(currentComponent.component.state, currentComponent);

      //Add it to the components list
      instantiatedComponents.push(currentComponent);

      //First render with initial state
      render(currentComponent);
    }
  }
}
