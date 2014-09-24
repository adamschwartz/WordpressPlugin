document.addEventListener 'DOMContentLoaded', ->
  message = document.querySelector '.message'
  appNameSplit = location.search?.split '?appName='

  if appNameSplit.length is 2 and appNameSplit[1] not in ['undefined', 'null']
    appName = document.createTextNode decodeURIComponent appNameSplit[1]
    message.innerHTML = "You are currently previewing <strong></strong>."
    message.querySelector('strong').appendChild appName

  else
    message.style.display = 'none'
