{extend, each} = require('../utils/general')
ui = require('../utils/ui')
resets = require('../utils/reset')
brand = require('../utils/brand')
valid = require('./valid')
selectorEngine = require('./selector')

class PotentialView
  constructor: ({@mediator}) ->

  render: ->
    @placeholder = ui.createElement()
    @placeholder.setAttribute 'data-eager-placement-potential-selector', true
    @placeholder.setAttribute 'style', ui.inlineStyles(extend {}, resets.ELEMENT,
      'position': 'absolute'
      'z-index': 1000000000
      'background-color': brand.pink
      'background': brand.pink
      'color': '#fff'
      'padding': '.25em .4em'
      'padding-top': '.25em'
      'padding-right': '.4em'
      'padding-bottom': '.25em'
      'padding-left': '.4em'
      'line-height': '1.4em'
      'pointer-events': 'none'
      'left': '0'
      'right': 'auto'
      'bottom': '100%'
      'height': '23px'
      'font-family': 'Monaco, \'Bitstream Vera Sans Mono\', \'Lucida Console\', Terminal, monospace'
      'font-size': '12px'
      'max-width': '85%'
      'overflow': 'hidden'
      'overflow-x': 'hidden'
      'overflow-y': 'hidden'
      'white-space': 'nowrap'
      'text-overflow': 'ellipsis'
    )

  setElement: (element) ->
    @reset()

    element = valid.findInParents element
    if not element
      return

    @mediator.trigger 'potential', {element}

    element.setAttribute 'data-eager-placement-potential-container', true

    @placeholder.innerHTML = selectorEngine.ellipsize selectorEngine.generate element
    element.appendChild @placeholder

  reset: ->
    each document.querySelectorAll('[data-eager-placement-potential-container]'), (element) ->
      element.removeAttribute 'data-eager-placement-potential-container'

    each document.querySelectorAll('[data-eager-placement-potential-selector]'), (element) ->
      ui.removeElement element

  remove: ->
    ui.removeElement @placeholder

  show: ->
    @setElement @placeholder.parentNode

  hide: ->
    @reset()

module.exports = {PotentialView}
