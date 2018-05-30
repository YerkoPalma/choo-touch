var html = require('choo/html')
var touch = require('.')
var choo = require('choo')

var app = choo()
app.use(require('choo-devtools')())
app.use(touch('button', {
  fn: () => {
    alert('easy pal!')
  }
}))
app.use((state, emitter) => {
  emitter.on('log:tap', event => {
    state.__log__ = state.__log__ || []
    state.__log__.push(event.type)
    emitter.emit('render')
  })
})
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>You can tap or press</h1>
      <button data-recognize="tap press" data-tap="log:tap" data-press="fn">Touch!</button>
      <pre>${state.__log__ ? state.__log__ : ''}</pre>
    </body>
  `
}
