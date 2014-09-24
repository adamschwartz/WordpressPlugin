ui = require('../utils/ui')
resets = require('../utils/reset')
{extend} = require('../utils/general')
{Evented} = require('../utils/events')

class WelcomeDialogView extends Evented
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
    @el.setAttribute 'src', "//embedded.eager.io/pages/welcome-dialog##{ @appName or '' }"

  setAppName: (@appName) ->
    @setIframeURL()

module.exports = {WelcomeDialogView}
