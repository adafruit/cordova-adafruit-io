exports = module.exports = (function() {

  var Constructor = function(key, cb) {

    if (! (this instanceof Constructor))
      return new Constructor(key, cb);

    this.key = key || false;

    if(! this.key)
      return false;

    cordova.exec(this.listen.bind(this, cb), this.emit.bind(this, 'error'), 'AdafruitIO', 'connect', [this.key]);

  };

  var proto = Constructor.prototype;

  proto.key = false;
  proto.subscriptions = {};
  proto.listeners = {};

  proto.disconnect = function() {
    cordova.exec(this.emit.bind(this, 'disconnected'), this.emit.bind(this, 'error'), 'AdafruitIO', 'disconnect');
  };

  proto.listen = function(cb) {
    cordova.exec(this.onMessage.bind(this), this.emit.bind(this, 'error'), 'AdafruitIO', 'setListener');
    this.emit('connected');
    cb.call(this);
  };

  proto.on = function(name, callback) {

    if(! Array.isArray(this.listeners[name]))
      this.listeners[name] = [];

    this.listeners[name].push(callback);

  };

  proto.emit = function(name) {

    if(! this.listeners[name])
      return;

    if(! Array.isArray(this.listeners[name]))
      return;

    var num_args = arguments.length,
        args = new Array(num_args.length - 1);

    for(var i=1; i < num_args; i++) {
      args[i - 1] = arguments[i];
    }

    this.listeners[name].forEach(function(cb) {
      cb.apply(this, args);
    });

  };

  proto.onMessage = function(topic, payload) {

    var feed = topic.match(/api\/feeds\/(.*)\/data\/receive\.json/);

    if(! feed.length === 2)
      return;

    feed = feed[1];

    if(! this.subscriptions[feed])
      return;

    if(! Array.isArray(this.subscriptions[feed]))
      return;

    this.subscriptions[feed].forEach(function(f) {
      f.call(this, payload);
    }.bind(this));

  };

  proto.subscribe = function(feed, callback) {

    if(! Array.isArray(this.subscriptions[feed]))
      this.subscriptions[feed] = [];

    this.subscriptions[feed].push(callback);

    cordova.exec(this.emit.bind(this, 'subscribed', feed), this.emit.bind(this, 'error'), 'AdafruitIO', 'subscribe', [feed]);

  };

  proto.publish = function(feed, payload) {
    cordova.exec(this.emit.bind(this, 'published', feed, payload), this.emit.bind(this, 'error'), 'AdafruitIO', 'publish', [feed, payload.toString()]);
  };

  return Constructor;

})();

