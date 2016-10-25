
import {TIMER_ID, ROOM} from './constants/Config'
import GeneralSocketClient from './GeneralSocketClient'
import Observer from './events/Observer'
import inherits from './utils/inherits'
import {CONNECT, CLOSE} from './constants/EventType'
import Channel from './Channel'

function buildRoomId(type, id) {

  return `${ROOM}.${type}.${id}`
}


function SocketSubscriber(host, {debug = false} = {}) {
  Observer.call(this);

  this._client = new GeneralSocketClient(host);
  this._connectPromise = this._client.connect();
  this._client.on(CONNECT, ::this._onConnect);
  this._client.on(CLOSE, ::this._onClose);
  this.debug(debug);
}

SocketSubscriber.prototype = {

  _onConnect: function () {

    this.trigger(CONNECT);
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

  sendRoom: function (type, id, data, ...args) {
    let roomId = buildRoomId(type, id);
    var evtType = null;

    if (typeof data === 'string') {
      evtType = data;
      data = args[0] || {};
    }

    this.ready().then(()=> this._client.send(roomId, data, evtType));
  },

  room: function (type, id) {
    let roomId = buildRoomId(type, id);
    let channel = new Channel(this, roomId);

    this.ready().then(()=> this._client.subscribe(roomId));
    return channel;
  },

  date: function () {
    let id = TIMER_ID;
    let channel = new Channel(this, id);

    this.ready().then(()=> this._client.subscribe(id));
    return channel;
  }

};

inherits(SocketSubscriber, Observer);

window.SocketSubscriber = SocketSubscriber;

module.export = SocketSubscriber;

