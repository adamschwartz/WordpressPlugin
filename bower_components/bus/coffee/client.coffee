{Promise} = require('./promise')
{Evented} = require('./events')

clientId = (Math.random() * 1000000)|0
debug = require('debug')("bus:client(#{ clientId })")

class Frame extends Evented
  constructor: ->
    @ready = new Promise

    if not document.body
      document.addEventListener 'DOMContentLoaded', @createIframe.bind(@)
    else
      @createIframe()

  createIframe: ->
    @frame = document.createElement 'iframe'
    @frame.style.display = 'none'
    @addListener(@frame)

    @frame.src = "https://bus.eager.io##{ clientId }"

    document.body.appendChild @frame

  addListener: (frame) ->
    window.addEventListener 'message', ({data, source}) =>
      return unless source is frame.contentWindow

      switch data.type
        when 'bus:ready'
          debug("Ready")
          @ready.resolve()

        when 'bus:set'
          debug("Received", data.key)
          @trigger 'set', data
          @trigger "set:#{ data.key }", data

  send: (body) ->
    @ready.then =>
      debug("Sending", body)

      @frame.contentWindow.postMessage body, '*'

  client: (siteId) ->
    new Client @, siteId

class Client extends Evented
  constructor: (@frame, @siteId) ->
    @frame.on 'set', (data) =>
      splitPos = data.key.indexOf(':')
      siteId = data.key.substring(0, splitPos)
      key = data.key.substring(splitPos + 1)

      if siteId is @siteId
        data.key = key

        @trigger 'set', data
        @trigger "set:#{ key }", data

  set: (key, value) ->
    key = "#{ @siteId }:#{ key }"
    debug("Setting", key, "to", value)

    @frame.send {type: 'bus:set', key, value}

  clear: (key) ->
    key = "#{ @siteId }:#{ key }"
    debug("Clearing", key)

    @frame.send {type: 'bus:clear', key}

  flash: (key, value) ->
    key = "#{ @siteId }:#{ key }"
    debug("Flashing", key, "to", value)

    @frame.send {type: 'bus:flash', key, value}

# We keep a cache to make sure clients which bind events are the
# same that trigger them.
cache = {}
frame = null
createClient = (siteId) ->
  if not cache[siteId]
    if not frame
      frame = new Frame

    cache[siteId] = new Client frame, siteId

  cache[siteId]

module.exports = {Client, Frame, createClient}
