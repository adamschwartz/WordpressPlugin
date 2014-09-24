resets = require('./reset')

inlineStyles = (styleObj) ->
  styles = ''
  for prop, value of styleObj
    styles += "#{ prop }:#{ value }!important;"
  styles

removeElement = (element) ->
  element.parentNode?.removeChild element

createIframe = ->
  iframe = document.createElement('iframe')
  iframe.setAttribute 'data-eager-element', true
  iframe.setAttribute 'style', inlineStyles resets.IFRAME
  iframe.setAttribute 'allowTransparency', true
  iframe

createElement = ->
  element = document.createElement('eager')
  element.setAttribute 'data-eager-element', true
  element

module.exports = {inlineStyles, removeElement, createIframe, createElement}
