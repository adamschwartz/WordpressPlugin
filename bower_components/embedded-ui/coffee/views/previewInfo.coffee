ui = require('../utils/ui')
resets = require('../utils/reset')
brand = require('../utils/brand')
{extend} = require('../utils/general')

class PreviewInfoView
  constructor: (@options={}) ->

  render: ->
    @el = ui.createIframe()
    document.body.appendChild @el

    @el.addEventListener 'load', @show.bind(@)

    @el.setAttribute 'src', "//embedded.eager.io/pages/preview-info/?appName=#{ decodeURIComponent @options.app.title }"

  hide: ->
    @el?.setAttribute 'style', ui.inlineStyles resets.IFRAME

    @

  show: ->
    if not @el
      @render()

    @el.setAttribute('style', ui.inlineStyles(extend {}, resets.IFRAME,
      'top': 0
      'left': 0
      'right': 0
      'margin': 'auto'
      'margin-left': 'auto'
      'margin-right': 'auto'
      'height': '48px'
      'width': '100%'
      'pointer-events': 'none'
      'opacity': '.97'
    ))

    @

  destroy: ->
    if @el?
      ui.removeElement @el

module.exports = {PreviewInfoView}
