const parser = require("posthtml-parser");
const fs = require("fs");

/**
 * WIP:
 * Compile the HTML-like template into a rendering function from snabbdom.
 */

// PARSER AND OPTIMISER

const html = fs.readFileSync("test.html", "utf-8");

const ast = { skip: true, content: parser(html) };

console.log(JSON.stringify(ast)); // Logs a PostHTML AST

function visit(ast) {
  const childs = ast.content;

  let children = [];

  for (let i = 0; i < childs.length; i++) {
    if (typeof childs[i] === "object") {
      // console.log("NODE :", childs[i]);
      children.push(visit(childs[i]));
    } else {
      // console.log("STRING :", childs[i].trim(), childs[i].trim() == "");
      childs[i].trim() == "" ? "" : children.push(childs[i].trim());
    }
  }

  if (!ast.skip) {
    // TODO: do something with this node
    console.log(children);
  }

  //return current node with childrens
  return { tag: ast.tag, childs: children };
}

console.log(JSON.stringify(visit(ast), null, 2));
