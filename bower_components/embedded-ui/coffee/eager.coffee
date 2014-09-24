{PreviewInfoView} = require('./views/previewInfo')
{PlacementInfoView} = require('./views/placementInfo')
{PlaceView} = require('./placement/view')
{loadApp} = require('./api/app')

Bus = require('../bower_components/bus/coffee/client')

initialInstall = require('./initialInstall')

menu = undefined
placement = undefined
previewInfo = null
placementInfo = null
appPromise = null

bus = Bus.createClient(Eager.siteId)

showPreviewInfo = ->
  if window.Eager.installs?.preview
    appPromise?.then (app) ->
      previewInfo = new PreviewInfoView {app}
      previewInfo.render()

showPlacementInfo = ->
  placement.on 'start', (info) ->
    if not appPromise
      console.error "Placement without app info"
      return

    appPromise.then (app) ->
      placementInfo = new PlacementInfoView {
        app,
        cancelHandler: ->
          placement.stop()

          placementInfo.destroy()
      }

      placementInfo.render()

init = ->
  placement = new PlaceView()

  isIframe = true
  try
    if window.self is window.top
      isIframe = false

  if window.Eager.installs?.preview
    appPromise = loadApp(Eager.installs.preview.appId)

  unless isIframe
    showPreviewInfo()

  showPlacementInfo()

  placement.on 'success', ({element, selector}) ->
    bus.flash 'placement', {selector}
    bus.clear 'placing'

    placement.stop()

    placementInfo?.destroy()

    if window.opener
      window.close()

  bus.on 'set:placing', startPlacement
  bus.on 'set:placement', ->
    placement.stop()

    placementInfo?.destroy()

    if window.opener
      window.close()

  if window.Eager?.config?.initialInstall
    initialInstall.show()

startPlacement = ->
  placement.render()

  placement.start()

document.addEventListener 'DOMContentLoaded', init
