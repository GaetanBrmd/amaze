%lex
%%
\s+                           /* skip whitespace */
"<"                           return "<"
">"                           return ">"
"/"                           return "/"
"="                           return "="
'"' return '"'
'@' return '@'
'{' return '{'
'}' return '{'
[a-zA-Z0-9\(\){}.+-/\*]+                  return "IDENT"
<<EOF>>                       return "EOF"
.                             return "INVALID"
/lex

%ebnf
%start Document
%%
Document
  : ElementList EOF {return $$}
  ;

ElementList
  : Element -> [$1]
  | ElementList Element -> [...$1,$2]
     ;

Element
     : "<" IDENT AttrList "/" ">" -> {element:$2,...$3}
     | "<" IDENT AttrList ">" "<" "/" IDENT ">" -> {element: $2,...3}
     | "<" IDENT AttrList ">" ElementList  "<" "/" IDENT ">" -> {element:$2,...$3,childs:$5}
     | IdentList -> $1.join(' ')
     ;

AttrList
     : Attr -> {attrs:[$1],on:[]}
     | On -> {on:[$1] ,attrs:[]}
     | AttrList Attr 
        {
           $1.attrs.push($2)
           $$ = $1
        }              
     | AttrList On 
        {
           $1.on.push($2)
           $$ = $1
        }     
     |
     ; 

Attr
     : IDENT "=" '"' IdentList '"' -> {key:$1,value:$4}
     ;

On
     : '@' IDENT "=" '"' IdentList '"' -> {on:true,key:$2,value : $5}
;

IdentList
    : IDENT -> [$1]
    | IdentList IDENT -> [...$1,$2]
;