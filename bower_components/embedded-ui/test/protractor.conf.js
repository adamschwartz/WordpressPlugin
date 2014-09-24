var config = {
  seleniumAddress: 'http://hub.browserstack.com/wd/hub',
  //seleniumAddress: 'http://localhost:4444/wd/hub', // For local testing

  specs: [
    '../build/js/tests.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'browserstack.user' : 'zackbloom1',
    'browserstack.key' : 'WjXTqUoTXWwqySG74tPd'
  },

  rootElement: 'html',
  framework: 'jasmine',

  plugins: [
    'protractor-coffee-preprocessor'
  ],

  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};

var env = (process.env.ENV || 'dev').toLowerCase();
if (env == 'local') {
  console.log('Make sure you are running gulp on port 9000 and the tunnel.js file');

  config.baseUrl = 'http://localhost:9000';
} else if (env == 'dev') {
  config.baseUrl = 'http://dev.embedded.eager.io';
} else if (env == 'staging') {
  config.baseUrl = 'http://staging.embedded.eager.io';
} else {
  config.baseUrl = 'http://embedded.eager.io';
};

module.exports.config = config;
