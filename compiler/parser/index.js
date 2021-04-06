var parser = require("./parser").parser;

function exec(input) {
  return parser.parse(input);
}

var twenty = exec(
  '<h1 class="bidule prout">My First Heading</h1> <button id="a" click="print()">My first button.</button>  <div if="test(e)">     abc     <h2>Title</h2>     <p>azeaze {{ e.toString() }}azeaz</p>     <ul>         <li for="e of array" click="e++">item {{ e }}             <a>link</a>         </li>     </ul> </div>'
);

console.log(JSON.stringify(twenty, null, 2));
