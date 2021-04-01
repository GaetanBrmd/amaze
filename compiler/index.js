const parser = require("posthtml-parser");

const generate = require("@babel/generator").default;
const t = require("@babel/types");
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;

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

  // return current node with childrens
  let node;

  if (ast.tag) {
    if (ast.attrs) {
      console.log(ast.attrs);
      if (ast.attrs.class) {
        ast.tag += "." + ast.attrs.class.split(" ").join(".");
      }
      if (ast.attrs.id) {
        ast.tag += "#" + ast.attrs.id;
      }
      if (ast.attrs.if) {
        return ifStatement(ast.attrs.if, children);
      }
    }
    node = hnode(ast.tag, children);
  } else {
    node = program(hnode("component", children));
  }

  return node;
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
  let quasis = text
    .split(/{{[ 	]*[\w.()]+[ 	]*}}/g)
    .map((e) => t.templateElement({ raw: e }));
  let expressions = text.match(/{{[   ]*[\w.()]+[  ]*}}/g);
  expressions = expressions
    ? expressions.map((m) => attach(m.slice(2, -2).trim()))
    : [];
  return t.templateLiteral(quasis, expressions);
}

function ifStatement(condition, childrens) {
  return t.spreadElement(
    t.conditionalExpression(
      // attach(babel.parse(condition)),
      attach(condition),
      t.arrayExpression(childrens),
      t.arrayExpression()
    )
  );
}

function attach(expression) {
  //console.log(JSON.stringify(expression, null, 2));
  let env = ["c"];
  let res = babel.transformSync(expression, {
    ast: true,
    code: false,
    plugins: [
      function myCustomPlugin() {
        return {
          visitor: {
            Identifier(path) {
              // If it's the second item of property don't touch it
              if (
                !t.isMemberExpression(path.parent) ||
                (t.isMemberExpression(path.parent) &&
                  path.node != path.parent.property)
              ) {
                // Attach functions to component
                if (t.isCallExpression(path.parent)) {
                  path.node.name = "component." + path.node.name;
                }
                // Attach property to component.state
                else if (!env.includes(path.node.name)) {
                  // TODO: Verify if the property is a local var in the env
                  path.node.name = "component.state." + path.node.name;
                }
              }
            },
          },
        };
      },
    ],
  });
  return res.ast.program.body[0].expression;
}

// INDEX

const html = fs.readFileSync(
  "../components/export-component/export-component.html",
  "utf-8"
);

const ast = { content: parser(html) };

// console.log(JSON.stringify(ast)); // Logs a HTML AST

const generated = generate(visit(ast)).code;

console.log(generated);

fs.writeFile(
  "../components/export-component/export-component-render.js",
  generated,
  () => {}
);
