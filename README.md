<p align="center"><a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img src="logo.png" alt="Amaze logo" width="200"/></a></p>

<h1 align="center">Amaze</h1>

💡 My own small frontend framework for learning purpose.

# Introduction

### Why build my own framework?

🔍 I've been working with frontend frameworks for a while now (mainly Angular) and I would like to know a little bit more about the deeper mechanism behind this amazing maze.

### Does it work?

⚙️ I don't think that this framework will be functionnal any time soon, that's just a personnal project with learning purpose. I'm trying my best to play around with differents optimisations but I'm far from a full featured framework.

# Get Started

```
//Download dependencies
npm i

// Run server on localhost:1234
npm run dev

// Auto compile components
cd compiler
nodemon -e html,js --watch ../components/ --ignore *-render.js --watch .  index.js
```

# Documentation

To create a component you need a directory _mycomponent-component_ with a _mycomponent-component.html_ and a _mycomponent-component.js_.

In the template _mycomponent-component.html_ you can use :

- all your regular _HTML tags_ with _class_ and _id_ :

```html
<h1 class="my_class" id="my_id">My First Heading</h1>
```

- _if_ statement linked to your component state :

```html
<div if="e > 10">Here component.state.e is greater than 10</div>
```

- _for_ loops to iterate :

```html
<ul>
  <li for="i of array">Item {{ i }}</li>
</ul>
```

- events such as _click_, _change_ etc. to interact with your component methods :

```html
<button click="print()">This will call component.print() when clicked</button>
```

## Inspiration

📚 I have read quite a lot about the underlying mechanism of frontend frameworks and finally decided to take Vue's approach.

You can find more about the sources here :

<ul>
    <li><a href="https://medium.com/js-imaginea/the-vue-js-internals-7b76f76813e3">Demystrifying Vue.js internals</a></li>
    <li><a href="https://mfrachet.github.io/create-frontend-framework/">Create a frontend framework</a></li>
</ul>
