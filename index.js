const Hammer = require('hammerjs')

module.exports = touch

function touch (selector, handlers) {
  var gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe', 'doubletap']
  // options per gesture
  var options = {
    tap: {
      time: 200,
      interval: 350,
      threshold: 5
    },
    pan: {
      threshold: 0
    },
    pinch: {
      threshold: 0
    },
    press: {
      threshold: 9,
      time: 400
    },
    rotate: {
      threshold: 0
    },
    swipe: {
      threshold: 10
    },
    doubletap: {
      threshold: 0
    }
  }

  return function (state, emitter, app) {
    emitter.on(state.events.DOMCONTENTLOADED, () => {
      var elements = document.querySelectorAll(selector)
      if (elements && elements.length > 0) {
        Array.prototype.forEach.call(elements, element => {
          var mc = new Hammer.Manager(element)
          // get element gestures
          var recognizers = element.dataset.recognize.split(' ').filter(gesture => gestures.indexOf(gesture) > -1)
          delete element.dataset.recognize

          // get Hammer recognizer
          recognizers.forEach(gesture => {
            // create recognizer if not ready
            if (!mc.get(gesture)) {
              var recognizer = new Hammer[capitalize(gesture)](options[gesture])
              recognizer.recognizeWith(mc.recognizers)
              mc.add(recognizer)
            }
          })
          // set events
          for (var event in element.dataset) {
            // set handlers
            if (handlers[element.dataset[event]]) {
              mc.on(event, e => {
                handlers[element.dataset[event]](e)
              })
            } else {
              mc.on(event, e => {
                emitter.emit(element.dataset[e.type], e)
              })
            }
          }
          // for login
          mc.on('hammer.input', e => {
            emitter.emit('log:debug', JSON.stringify(e))
          })
        })
      }
    })
  }
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
