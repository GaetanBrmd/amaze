const parser = require("posthtml-parser");

const generate = require("@babel/generator").default;
const t = require("@babel/types");

const fs = require("fs");

/**
 * WIP:
 * Compile the HTML-like template into a rendering function from snabbdom.
 */

// PARSER AND OPTIMISER

function visit(ast) {
  const childs = ast.content;

  let children = [];

  for (let i = 0; i < childs.length; i++) {
    if (typeof childs[i] === "object") {
      // console.log("NODE :", childs[i]);
      children.push(visit(childs[i]));
    } else {
      // console.log("STRING :", childs[i].trim(), childs[i].trim() == "");
      childs[i].trim() == "" ? "" : children.push(htext(childs[i].trim()));
    }
  }

  if (!ast.skip) {
    // TODO: do something with this node
    // console.log("NODE",ast);
  }

  // return current node with childrens
  // return { tag: ast.tag, childs: children };
  return ast.tag ? hnode(ast.tag,children) : program(hnode("component",children));
}

// GENERATOR

function program(main_node) {
  return t.file(
    t.program([
      t.importDeclaration(
        [t.importSpecifier(t.identifier("h"), t.identifier("h"))],
        t.stringLiteral("snabbdom/build/package/h")
      ),
      t.exportNamedDeclaration(
        t.functionDeclaration(
          t.identifier("renderFn"),
          [t.identifier("component")],
          t.blockStatement([t.returnStatement(main_node)])
        )
      ),
    ])
  );
}

function hnode(div_type, childrens) {
  return t.callExpression(t.identifier("h"), [
    t.stringLiteral(div_type),
    t.arrayExpression(childrens),
  ]);
}

function htext(text) {
  let quasis = text.split(/{{[ 	]\w[ 	]}}/g).map( e => t.templateElement({raw:e}))
  let expressions = text.match(/{{[   ]\w[  ]}}/g)
  expressions = expressions ? expressions.map(m=> m.slice(2,-2).trim()).map( e => t.memberExpression(t.memberExpression(t.identifier("component"),t.identifier("state")),t.identifier("e"))) : []
  console.log(quasis,expressions);
  return t.templateLiteral(quasis,expressions);
}

// INDEX

const html = fs.readFileSync("test.html", "utf-8");

const ast = { skip: true, content: parser(html) };

// console.log(JSON.stringify(ast)); // Logs a PostHTML AST

const generated = generate(visit(ast)).code;

console.log(generated);

fs.writeFile("test.js", generated, () => {});