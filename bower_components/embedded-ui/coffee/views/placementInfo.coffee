ui = require('../utils/ui')
resets = require('../utils/reset')
brand = require('../utils/brand')
{extend} = require('../utils/general')

class PlacementInfoView
  constructor: (@options={}) ->

  render: ->
    @el = ui.createIframe()
    document.body.appendChild @el

    @el.addEventListener 'load', @show.bind(@)

    @el.setAttribute 'src', "//embedded.eager.io/pages/placement-info/?appName=#{ decodeURIComponent @options.app.title }"

    window.addEventListener 'message', (messageEvent) =>
      if messageEvent.data is 'eager-placement-info:cancel:click'
        @options.cancelHandler()

  hide: ->
    @el?.setAttribute 'style', ui.inlineStyles resets.IFRAME

    @

  show: ->
    if not @el
      @render()

    @el.setAttribute('style', ui.inlineStyles(extend {}, resets.IFRAME,
      'top': 0
      'left': 'auto'
      'right': 'auto'
      'background': 'pink'
      'margin': 'auto'
      'margin-left': 'auto'
      'margin-right': 'auto'
      'height': '48px'
      'width': '100%'
      'opacity': '.97'
    ))

    @

  destroy: ->
    if @el?
      ui.removeElement @el

module.exports = {PlacementInfoView}
