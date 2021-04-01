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
                [
                  t.templateElement({ raw: "mon texte super " }),
                  t.templateElement({ raw: "bbbbbbb" }),
                  t.templateElement({ raw: "ccc" }),
                ],
                [
                  t.memberExpression(
                    t.identifier("component"),
                    t.identifier("state")
                  ),
                  t.memberExpression(
                    t.memberExpression(
                      t.identifier("component"),
                      t.identifier("state")
                    ),
                    t.identifier("b")
                  ),
                ]
              ),
              t.spreadElement(
                t.conditionalExpression(
                  babel.parse("isTrue()").program.body[0].expression,
                  hnode("div", []),
                  t.nullLiteral()
                )
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
[...(component.state.count % 2)
      ? [h()]
      : []]
`);

console.log(parsed.program.body[0].expression.elements[0]);

console.log(
  JSON.stringify(parsed.program.body, null, 2),
  "VVVVVVVVVVVVSSSSSSSSSSS",
  t.expressionStatement(
    t.conditionalExpression(
      babel.parse("component.state.a == 2").program.body[0].expression,
      hnode("div", []),
      t.nullLiteral()
    )
  )
);

const generated = generate(custom).code;

console.log(generated);

fs.writeFile("output.js", generated, () => {});
