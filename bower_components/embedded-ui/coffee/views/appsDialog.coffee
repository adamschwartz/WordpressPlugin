ui = require('../utils/ui')
resets = require('../utils/reset')
{extend} = require('../utils/general')

class AppsDialogView
  render: ->
    @el = ui.createIframe()
    document.body.appendChild @el

    @el.addEventListener 'load', =>
      @el.setAttribute('style', ui.inlineStyles(extend {}, resets.IFRAME,
        width: '100%'
        height: '100%'
      ))

    @el.setAttribute 'src', '//embedded.eager.io/pages/apps-dialog'

    window.addEventListener 'message', (messageEvent) =>
      if messageEvent.data is 'eager-apps-dialog:ok:click'
        ui.removeElement @el

module.exports = {AppsDialogView}
