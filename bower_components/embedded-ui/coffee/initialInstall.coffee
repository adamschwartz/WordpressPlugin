{WelcomeDialogView} = require('./views/welcomeDialog')

Bus = require('../bower_components/bus/coffee/client')

show = ->
  pendingInstall = undefined

  dialog = new WelcomeDialogView
  dialog.on 'click:ok', ->
    url = 'https://eager.io/home'

    if pendingInstall?.app?.id
      url = "https://eager.io/app/#{ pendingInstall.app.id }/install?version=#{ encodeURIComponent pendingInstall.version }&options=#{ encodeURIComponent JSON.stringify(pendingInstall.options) }"

    window.open url

  previewBus = Bus.createClient('preview')
  previewBus.frame.ready.then ->
    dialog.render()

  previewBus.on 'set:pendingInstall', ({value}) ->
    pendingInstall = value

    dialog.setAppName(value.app?.title)

module.exports = {show}
