generate = (element) ->
  if element is document.documentElement
    element = document.body

  if element is document.body
    return 'body'

  if id = element.getAttribute 'id'
    return "##{ id }"

  selector = ''

  node = element
  while node and node.parentNode and node isnt document.documentElement
    tagName = node.tagName.toLowerCase()

    if node is document.body
      selectorAdditions = tagName
    else if node.className?.length
      selectorAdditions = ".#{ node.className.trim().split(/\s+/).join('.') }"
    else
      selectorAdditions = tagName

      if tagName isnt 'body'
        nodeIndex = Array.prototype.slice.call(node.parentNode.children).indexOf node

        if nodeIndex is 0
          selectorAdditions += ':first-child'
        else if nodeIndex is node.parentNode.children.length - 1
          selectorAdditions += ':last-child'
        else
          selectorAdditions += ":nth-child(#{ nodeIndex + 1})"

    if selector is ''
      selector = selectorAdditions
    else
      selector = "#{ selectorAdditions } > #{ selector }"

    node = node.parentNode

  return selector

ellipsize = (selector) ->
  if selector.length < 100
    return selector

  split = selector.split(' > ')

  if split.length > 4
    selectorStart = ''
    selectorEnd = ''

    for i in [0...Math.floor(split.length / 2)]
      selectorStart += "#{ if i > 0 then ' > ' else '' }#{ split[i] }"
      selectorEnd = "#{ split[split.length - (1 + i)] }#{ if i > 0 then ' > ' else '' }#{ selectorEnd }"

      potentialSelector = "#{ selectorStart } > ... > #{ selectorEnd }"
      if potentialSelector.length < 100
        selector = potentialSelector
      else
        break

  if selector.length > 100
    return "#{ selector.substr(0, 100) }..."

  return selector

module.exports = {generate, ellipsize}
