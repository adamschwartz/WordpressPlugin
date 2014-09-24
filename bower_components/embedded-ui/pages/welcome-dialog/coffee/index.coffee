updateAppName = ->
  name = document.location.hash.substring(1)

  if name
    cta = "Back to installing #{ name }"
  else
    cta = "Let's install an app!"

  document.querySelector('.install-cta').textContent = cta

document.addEventListener 'DOMContentLoaded', ->
  document.querySelector('.install-cta').addEventListener 'click', (event) ->
    event.preventDefault()

    window.parent.postMessage 'eager-welcome-dialog:ok:click', '*'

  updateAppName()
  window.addEventListener 'hashchange', updateAppName
