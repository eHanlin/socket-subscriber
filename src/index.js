
import {TIMER_ID, ROOM} from './constants/Config'
import GeneralSocketClient from './GeneralSocketClient'
import Observer from './events/Observer'
import inherits from './utils/inherits'
import {CONNECT, CLOSE} from './constants/EventType'
import Channel from './Channel'
import * as random from './utils/random'

function buildRoomId(type, id) {

  return `${ROOM}.${type}.${id}`
}


function SocketSubscriber(host, {debug = false, retryTime = 10000, retryCount = -1} = {}) {
  Observer.call(this);

  this._client = new GeneralSocketClient(host, {
    retryTime:retryTime,
    retryCount:retryCount
  });
  this._connectPromise = this._client.connect();
  this._client.on(CONNECT, ::this._onConnect);
  this._client.on(CLOSE, ::this._onClose);
  this.debug(debug);
  this.id = random.string();
}

SocketSubscriber.prototype = {

  _onConnect: function (evt) {

    this.trigger(CONNECT, null, {headers:evt.headers});
  },

  _onClose: function () {

    this.trigger(CLOSE);
  },

  debug: function (enabled) {
    return this._client.debug(enabled);
  },

  ready: function () {

    return this._connectPromise;
  },

  sendRoom: function (type, id, data, headers, ...args) {
    let roomId = buildRoomId(type, id);
    var label = null;

    if (typeof data === 'string') {
      label = data;
      data = headers || {};
      headers = args[0] || {};
    }

    this.ready().then(()=> this._client.send(roomId, data, label, headers));
  },

  room: function (type, id) {
    let roomId = buildRoomId(type, id);
    let channel = Channel.getInstance(this, roomId);

    this.ready().then(()=> this._client.subscribe(roomId));
    return channel;
  },

  exitRoom: function (type, id) {
    let roomId = buildRoomId(type, id);
    this.ready().then(()=> {
      this._client.unsubscribe(roomId)
      Channel.clear(this, roomId);
    });
  },

  date: function () {
    let id = TIMER_ID;
    let channel = Channel.getInstance(this, id);

    this.ready().then(()=> this._client.subscribe(id));
    return channel;
  },

  getSockJSSessionId: function () {

    return this._client.getSessionId();
  }

};

inherits(SocketSubscriber, Observer);

window.SocketSubscriber = SocketSubscriber;

module.export = SocketSubscriber;

