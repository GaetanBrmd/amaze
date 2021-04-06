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

function visit(ast, env) {
  const childs = ast.content;

  let children = [];

  // Build current node with childrens
  let node;

  if (ast.tag) {
    ast.options = {};
    if (ast.attrs) {
      console.log(ast.attrs);
      // TODO : Rework with iterating over attrs and then check what attrs it is, event with on must be set like (event)
      if (ast.attrs.class) {
        ast.tag += "." + ast.attrs.class.split(" ").join(".");
      }
      if (ast.attrs.id) {
        ast.tag += "#" + ast.attrs.id;
      }
      if (ast.attrs.click) {
        if (!ast.options.on) ast.options.on = {};
        ast.options.on.click = ast.attrs.click;
      }

      if (ast.attrs.if) {
        node = ifStatement(ast.tag, ast.options, children, ast.attrs.if, env);
      }
      if (ast.attrs.for) {
        node = forStatement(ast.tag, ast.options, children, ast.attrs.for, env);
      }
    }
    node = node ? node : hnode(ast.tag, ast.options, children, env);
  } else {
    node = program(hnode("component", {}, children, env));
  }

  for (let i = 0; i < childs.length; i++) {
    if (typeof childs[i] === "object") {
      // console.log("NODE :", childs[i]);
      children.push(visit(childs[i], env.slice(0)));
    } else {
      // console.log("STRING :", childs[i].trim(), childs[i].trim() == "");
      childs[i].trim() == "" ? "" : children.push(htext(childs[i].trim(), env));
    }
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

function hnode(div_type, options, childrens, env) {
  return t.callExpression(t.identifier("h"), [
    t.stringLiteral(div_type),
    // If options add an argument
    ...Object.keys(options).map((o) =>
      t.objectExpression([
        ...(o == "on"
          ? [
              t.objectProperty(
                t.identifier("on"),
                t.objectExpression([
                  ...Object.keys(options[o]).map((n) =>
                    t.objectProperty(
                      t.identifier(n),
                      t.arrowFunctionExpression(
                        [],
                        t.callExpression(t.identifier("setTimeout"), [
                          attach(options.on[n], env),
                        ])
                      )
                    )
                  ),
                ])
              ),
            ]
          : []),
      ])
    ),
    t.arrayExpression(childrens),
  ]);
}

function htext(text, env) {
  let quasis = text
    .split(/{{[ 	]*[\w.()]+[ 	]*}}/g)
    .map((e) => t.templateElement({ raw: e }));
  let expressions = text.match(/{{[   ]*[\w.()]+[  ]*}}/g);

  expressions = expressions
    ? expressions.map((m) => attach(m.slice(2, -2).trim(), env))
    : [];
  return t.templateLiteral(quasis, expressions);
}

function ifStatement(tag, options, childrens, condition, env) {
  return t.spreadElement(
    t.conditionalExpression(
      attach(condition, env),
      t.arrayExpression([hnode(tag, options, childrens, env)]),
      t.arrayExpression()
    )
  );
}

function forStatement(tag, options, childrens, loop, env) {
  loop = loop.split(" of ");
  env.push(loop[0]);
  let res = t.spreadElement(
    t.callExpression(
      t.memberExpression(attach(loop[1], env), t.identifier("map")),
      [
        t.arrowFunctionExpression(
          [t.identifier(loop[0])],
          hnode(tag, options, childrens, env)
        ),
      ]
    )
  );
  return res;
}

function attach(expression, env) {
  //console.log(JSON.stringify(expression, null, 2));
  console.log(env);
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
                // Attach property to component.state if not in the nev
                else if (!env.includes(path.node.name)) {
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

console.log(JSON.stringify(ast)); // Logs a HTML AST

const generated = generate(visit(ast, [])).code;

console.log(generated);

fs.writeFile(
  "../components/export-component/export-component-render.js",
  generated,
  () => {}
);
