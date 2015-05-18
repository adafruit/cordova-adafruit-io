module.exports = {
  connect: function(key, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'AdafruitIO', 'connect', [key]);
  },
  disconnect: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'AdafruitIO', 'disconnect');
  },
  setListener: function(successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'AdafruitIO', 'setListener');
  },
  subscribe: function(topic, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'AdafruitIO', 'subscribe', [topic]);
  },
  publish: function(topic, payload, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'AdafruitIO', 'publish', [topic, payload]);
  }
};
