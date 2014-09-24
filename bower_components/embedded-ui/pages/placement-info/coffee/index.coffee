document.addEventListener 'DOMContentLoaded', ->
  message = document.querySelector '.message'
  appNameSplit = location.search?.split '?appName='

  if appNameSplit.length is 2 and appNameSplit[1] not in ['undefined', 'null']
    appName = document.createTextNode decodeURIComponent appNameSplit[1]
    message.innerHTML = """Choose a location for <strong></strong>. <a class="button primary">Cancel</a>"""
    message.querySelector('strong').appendChild appName

    message.querySelector('a').addEventListener 'click', (event) ->
      event.preventDefault()

      window.parent.postMessage 'eager-placement-info:cancel:click', '*'

  else
    message.style.display = 'none'
