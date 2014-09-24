selectorEngine = require('./selector')
resets = require('../utils/reset')
ui = require('../utils/ui')
{extend} = require('../utils/general')

findInParents = (element) ->
  if not element
    return null

  if isPlaceable element
    return element
  else
    return findInParents element.parentNode

isPlaceable = (element) ->
  if element.hasAttribute 'data-eager-cancel-button'
    return false

  if element.hasAttribute 'data-eager-placement'
    return false

  if element.tagName.toLowerCase() is 'a'
    return false

  if element.tagName.toLowerCase() in ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'video', 'iframe']
    return false

  if getComputedStyle(element).overflow is 'hidden' and element.style.minHeight not in ['auto', ''] and element.style.height not in ['auto', '']
      return false

  if parseInt(getComputedStyle(element).width, 10) < 200
    return false

  if getComputedStyle(element).display not in ['block', 'flex']
    return false

  if not selectorEngine.generate element
    return false

  someParentOverflowHidden = false
  node = element
  while node.parentNode
    if getComputedStyle(node).overflow is 'hidden'
      someParentOverflowHidden = true
      break
    node = node.parentNode

  if someParentOverflowHidden
    childVisibleTest = ui.createElement()
    childVisibleTest.innerHTML = '&nbsp;'
    childVisibleTest.setAttribute 'data-eager-placement-test', true
    childVisibleTest.setAttribute 'style', ui.inlineStyles(extend {}, resets.ELEMENT,
      'height': '10px'
      'width': '100%'
      'clear': 'both'
      'position': 'relative'
      'z-index': 5000
    )
    element.appendChild childVisibleTest
    element.clientHeight

    if childVisibleTest.offsetTop >= parseInt(getComputedStyle(element).height, 10)
      ui.removeElement childVisibleTest
      return false

    ui.removeElement childVisibleTest

  return true

module.exports = {isPlaceable, findInParents}
