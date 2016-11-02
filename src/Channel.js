
import Observer from './events/Observer';

var registerMap = {};

function Channel (socketSubscriber, id) {

  this._id = id;
  this._socketSubscriber = socketSubscriber;
  this._eventNames = [];
}


Channel.prototype.on = function (...args) {

  var type = null;
  var func = null;
  var id = this._id;

  if (args.length > 1) [type, func] = args;

  else [func] = args;


  let name = Observer.buildName(id, type);

  this._socketSubscriber._client.on(name, func);
  this._eventNames.push(name);

  return this;
};

Channel.prototype.off = function (...args) {

  var type = null;
  var func = null;
  var id = this._id;

  if (args.length > 1) [type, func] = args;

  else [func] = args;

  if (arguments.length) {

    let name = Observer.buildName(id, type);
    let eventNameIndex = this._eventNames.indexOf(name);

    if (eventNameIndex != -1) this._eventNames.splice(eventNameIndex, 1);
    this._socketSubscriber._client.off(name, func);

  } else {

    this._eventNames.forEach((name)=> this._socketSubscriber._client.off(name));
    this._eventNames = {};

  }

  return this;
};

function buildKey(socketSubscriberId, channelId) {
  return `${socketSubscriberId}:${channelId}`;
}

Channel.getInstance = function (socketSubscriber, id) {
  var key = buildKey(socketSubscriber.id, id);

  if (!registerMap[key]) registerMap[key] = new Channel(socketSubscriber, id);

  return registerMap[key];
};

Channel.clear = function (socketSubscriber, id) {
  let socketSubscriberId = socketSubscriber.id;
  let key = buildKey(socketSubscriberId, id);

  if (registerMap[key]) {
    let channel = Channel.getInstance(socketSubscriberId, id);
    channel.off();
    delete registerMap[key];
  }
};

export default Channel;

