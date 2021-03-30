// GENERATOR

const babel = require("@babel/core");
const template = require("@babel/template");
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const fs = require("fs");

function hnode(div_type, childrens) {
  return t.callExpression(t.identifier("h"), [
    t.stringLiteral(div_type),
    t.arrayExpression(childrens),
  ]);
}

function htext(text) {
  return t.stringLiteral(text);
}

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
        t.blockStatement([t.returnStatement(hnode("div", [htext("text")]))])
      )
    ),
  ])
);

const parsed = babel.parse(`
import { h } from "snabbdom/build/package/h";

export function renderFn(component) {
  return h("div", [
    h("prout")
  ])
}
`);

console.log(
  parsed.program.body[1].declaration.body.body[0].argument.arguments[1].elements
);

const generated = generate(custom).code;

console.log(generated);

fs.writeFile("output.js", generated, () => {});
