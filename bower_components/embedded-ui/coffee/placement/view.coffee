selectorEngine = require('./selector')
finder = require('./valid')
ui = require('../utils/ui')
resets = require('../utils/reset')
brand = require('../utils/brand')
{extend} = require('../utils/general')
{Evented} = require('../utils/events')

{PotentialView} = require('./potential')

class PlaceView extends Evented
  constructor: ->
    @placing = false

    @addStyle()
    @bindEvents()

    @mediator = new Evented

  render: ->

  bindEvents: ->
    lastMouseMoveTarget = undefined
    showPotentialTimeout = undefined

    window.addEventListener 'mousemove', (event) =>
      return unless @placing

      if lastMouseMoveTarget isnt event.target
        clearTimeout showPotentialTimeout
        showPotentialTimeout = setTimeout =>
          @showPotential event.target
        , 35

      lastMouseMoveTarget = event.target

    window.addEventListener 'click', (event) =>
      return unless @placing

      event.stopPropagation()
      event.preventDefault()
      @attemptPlacement event.target

  addStyle: ->
    document.body.insertAdjacentHTML 'beforeEnd', """
      <style data-eager="true">
        *[data-eager-placement-potential-container] {
          position: relative;
          cursor: pointer !important;
          -webkit-box-shadow: inset 0 0 0 3px #{ brand.pink }, inset 0 0 0 99999px rgba(#{ brand.pinkRGB }, .07) !important;
          -moz-box-shadow: inset 0 0 0 3px #{ brand.pink }, inset 0 0 0 99999px rgba(#{ brand.pinkRGB }, .07) !important;
          box-shadow: inset 0 0 0 3px #{ brand.pink }, inset 0 0 0 99999px rgba(#{ brand.pinkRGB }, .07) !important
        }

        eager[data-eager-placement-potential-selector] {
          display: none !important
        }

        *[data-eager-placement-potential-container] > eager[data-eager-placement-potential-selector] {
          display: block !important
        }
      </style>
    """

  showPotential: (target) ->
    if not @potential
      @potential = new PotentialView {@mediator}
      @potential.render()

    @potential.setElement(target)
    @potential.show()

  hidePotential: ->
    @potential?.hide()

  start: ->
    @placing = true

    @trigger 'start'

  finish: (element) ->
    @stop()

    selector = selectorEngine.generate element

    @trigger 'success', {element, selector}

  stop: ->
    @placing = false
    @hidePotential()

    @trigger 'stop'

  attemptPlacement: (element) ->
    return unless element = finder.findInParents element

    @doPlacement element
    @finish element

  doPlacement: (element) =>
    if element is document.documentElement
      element = document.body

    @trigger 'placement', {element}

module.exports = {PlaceView}
