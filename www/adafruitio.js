exports = module.exports = (function() {

  var Constructor = function(key) {

    if (! (this instanceof Constructor))
      return new Constructor(key);

    this.key = key || false;

    if(! this.key)
      return false;

    cordova.exec(this.listen.bind(this), function(){}, 'AdafruitIO', 'connect', [this.key]);

  };

  var proto = Constructor.prototype;

  proto.key = false;
  proto.subscriptions = {};

  proto.disconnect = function() {
    cordova.exec(function(){}, function(){}, 'AdafruitIO', 'disconnect');
  };

  proto.listen = function() {
    cordova.exec(this.onMessage.bind(this), function(){}, 'AdafruitIO', 'setListener');
  };

  proto.onMessage = function(topic, payload) {

    var feed = topic.match(/api\/feeds\/(.*)\/data\/send\.json/)[1];

    if(! subscription[feed])
      return;

    if(! Array.isArray(subscription[feed]))
      return;

    subscription[feed].forEach(function(f) {

      if(typeof f !== 'function')
        return;

      f.call(this, payload);

    }.bind(this));

  };

  proto.subscribe = function(feed, callback) {

    if(! Array.isArray(subscription[feed]))
      subscription[feed] = [];

    subscription[feed].push(callback);

    cordova.exec(function(){}, function(){}, 'AdafruitIO', 'subscribe', [topic]);

  };

  proto.publish = function(feed, payload) {
    cordova.exec(function(){}, function(){}, 'AdafruitIO', 'publish', [feed, payload.toString()]);
  };

  return Constructor;

})();

