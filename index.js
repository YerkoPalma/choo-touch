const Hammer = require('hammerjs')

module.exports = touch

function touch (selector, handlers) {
  var gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe', 'doubletap']
  var directions = ['up', 'down', 'left', 'right', 'horizontal', 'vertical', 'all']

  return function (state, emitter, app) {
    emitter.on(state.events.DOMCONTENTLOADED, () => {
      var elements = document.querySelectorAll(selector)
      if (elements && elements.length > 0) {
        Array.prototype.forEach.call(elements, element => {
          var mc = new Hammer.Manager(element)
          // get element gestures
          var _gestures = []
          var _directions = {}
          for (var gesture in element.dataset) {
            var _gesture = gesture.split('.')
            if (gestures.indexOf(_gesture[0]) > -1) {
              _gestures.push(_gesture[0])
            }
            if (_gesture.length > 1) {
              _directions[_gesture[0]] = _gesture[1]
            }
          }
          // get Hammer recognizer
          _gestures.forEach(gesture => {
            // create recognizer if not ready
            if (!mc.get(gesture)) {
              var recognizer = new Hammer[capitalize(gesture)]()
              recognizer.recognizeWith(mc.recognizers)
              mc.add(recognizer)
            }
            // set directions
            if (_directions[gesture]) {
              var hammerDirection = 'DIRECTION_' + _directions[gesture].toUpperCase()
              if (directions.indexOf(_directions[gesture]) && Hammer.hasOwnProperty(hammerDirection)) {
                recognizer.set({ direction: Hammer[hammerDirection] })
              }
            }
            // set handlers
            if (handlers[element.dataset[gesture]]) {
              mc.on(gesture, e => {
                handlers[element.dataset[gesture]](e)
              })
            } else {
              mc.on(gesture, e => {
                emitter.emit(element.dataset[gesture], e)
              })
            }
          })
        })
      }
    })
  }
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
