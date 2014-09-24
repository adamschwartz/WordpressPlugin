ui = require('../utils/ui')
resets = require('../utils/reset')
{extend} = require('../utils/general')
{Evented} = require('../utils/events')

class WelcomeDialogView extends Evented
  constructor: (@options={}) ->

  render: ->
    @el = ui.createIframe()
    document.body.appendChild @el

    @el.addEventListener 'load', =>
      @el.setAttribute('style', ui.inlineStyles(extend {}, resets.IFRAME,
        width: '100%'
        height: '100%'
      ))

    @setIframeURL()

    window.addEventListener 'message', (messageEvent) =>
      if messageEvent.data is 'eager-welcome-dialog:ok:click'
        @trigger 'click:ok'

        ui.removeElement @el

  setIframeURL: ->
    slug = @appName or ''
    if @options.wordpress
      slug = "wp!#{ slug }"

    @el.setAttribute 'src', "//embedded.eager.io/pages/welcome-dialog##{ slug }"

  setAppName: (@appName) ->
    @setIframeURL()

module.exports = {WelcomeDialogView}
