protractorInstance = protractor.getInstance()

describe 'Placement', ->

  it 'Should enter placement mode', ->
    browser.get '/'
