// GENERATOR

const babel = require("@babel/core");
const template = require("@babel/template");
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const fs = require("fs");

const custom = t.file(
  t.program([
    t.importDeclaration(
      [t.importSpecifier(t.identifier("h"), t.identifier("h"))],
      t.stringLiteral("snabbdom/build/package/h")
    ),
    t.exportNamedDeclaration(
      t.functionDeclaration(
        t.identifier("renderFn"),
        [t.identifier("component")],
        t.blockStatement([
          t.returnStatement(
            hnode("div", [
              t.templateLiteral(
                [t.templateElement({ raw: "mon texte super " }),t.templateElement({ raw: "bbbbbbb" }),t.templateElement({ raw: "ccc" })],
                [t.memberExpression(
                  t.identifier("component"),
                  t.identifier("state")
                ),t.memberExpression(t.memberExpression(
                  t.identifier("component"),
                  t.identifier("state"),
                ),t.identifier("b"))]
              ),
            ])
          ),
        ])
      )
    ),
  ])
);

function hnode(div_type, childrens) {
  return t.callExpression(t.identifier("h"), [
    t.stringLiteral(div_type),
    t.arrayExpression(childrens),
  ]);
}

function htext(text) {
  return t.stringLiteral(text);
}

const parsed = babel.parse(`
import { h } from "snabbdom/build/package/h";

export function renderFn(component) {
  return h("div", [
    h(\`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA \$\{component.state.b\}\ bbbbbbb \$\{component.state.c\}\`)
  ])
}
`);

console.log(
  JSON.stringify(
    parsed.program.body[1].declaration.body.body[0].argument.arguments[1]
      .elements[0].arguments,
    null,
    2
  )
);

const generated = generate(custom).code;

console.log(generated);

fs.writeFile("output.js", generated, () => {});
