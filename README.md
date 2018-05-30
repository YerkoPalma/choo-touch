# choo-touch

## Usage
```js
var html = require('choo/html')
var touch = require('choo-touch')
var choo = require('choo')

var app = choo()
app.use(touch('button', { fn: () => alert('easy pal!') }))
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button data-recognize="tap pan" data-tap="fn" data-panstart.panmove="fn2">Increment</button>
    </body>
  `
}
```

## API
### `var store = require('choo-touce')(selector [, handlers])`

This package expose a function that return a store for choo. The function to 
generate the store expect two arguments:

- selector (required): A string representing a css selector. Listeners are binded 
if the element has any `data-<event>` attribute on it (`data-tap`, `data-press`, 
`data-swipe.left`, etc). The attribute must be assigned to any of the handler 
functions provided, or to the name of an event registered by other store. For 
example:

```js
// this works
app.use(touch('button', { fn: () => alert('easy pal!') })) // <button data-tap="fn">Increment</button>

// this also work
app.use(touch('button'))
app.use((state, emitter) => {
  emitter.emit('custom-event', event => console.log(event))
  emitter.emit('render')
})
// <button data-tap="custom-event">Increment</button>
```

- handlers (optional): An object where every property is a function handlers.
Each handler has a single argument, the element itself.

## License
MIT