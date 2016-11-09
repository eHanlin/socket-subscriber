
import Observer from './events/Observer'
import inherits from './utils/inherits'
import {HOST_PATH, ROOM} from './constants/Config'
import {CONNECT, CLOSE, OPEN} from './constants/EventType'
import SockJS from 'sockjs-client'
import {Stomp} from 'stompjs/lib/stomp.js'
import * as random from './utils/random'

function createBodyStr(data, label) {

  var evtObj = {data:data, clientTime: +new Date()};
  if ( label ) evtObj.label = label;

  return JSON.stringify(evtObj);
}

function subscribe(socketClient, id) {

  let subscriber = socketClient._frame.headers.session

  socketClient._client.subscribe(`${HOST_PATH}/${id}`, function (resp) {

    if (resp.body) {
      var body = JSON.parse(resp.body);
      var label = body.label;
      var now = body.now;

      socketClient.trigger((label ?`${id}:${label}` : id), body.data || null, {now:now, headers:resp.headers});
    }
  }, {id:id, subscriber: subscriber});
}

function unsubscribe(socketClient, id) {

  socketClient._client.unsubscribe(id);
}


function GeneralSocketClient (host, {autoConn = true, autoConnTime = 1000} = {}) {
  Observer.call(this);

  this.host = host;
  this.isClose = true;
  this._autoConn = autoConn;
  this._firstConnected = false;
  this._autoConnTime = autoConnTime;
  this._subscriptions = {};
  this.debug(false);
}

GeneralSocketClient.prototype = {

  _initConnection: function () {

    let sessionId = this._sessionId = random.string();
    let sockjs = this.sockjs = new SockJS(this.host, null, {sessionId:()=> sessionId});

    sockjs.addEventListener(CLOSE, ::this._onClose)
    sockjs.addEventListener(OPEN, ::this._onOpen)

    this._client = Stomp.over(sockjs);
    this._client.debug = (text)=> {
      if (this._isDebugging)
        console.log(text);

      return this._isDebugging;
    };
  },

  _onClose: function () {
    this.isClose = true;
    this._sessionId = null;

    if (this._autoConn) setTimeout(()=>this._reconnect(), this._autoConnTime);

    this.trigger(CLOSE);
  },

  _onOpen: function () {
    this.isClose = false
  },

  _onConnect: function (frame) {
    this._frame = frame;
    this._firstConnected = true
    this.trigger(CONNECT, null, {headers:frame.headers});
  },

  _reconnect: function () {

    let subscriptions = this._subscriptions

    this
    .connect(this._lastLogin, this._passcode)
    .then((function () {
      for (var name in subscriptions) {
        subscribe(this, name);
      }
    }).bind(this));
  },

  connect: function (login, passcode) {
    this._lastLogin = login
    this._passcode = passcode

    if (this.isClose) this._initConnection();

    return new Promise((resolve, reject) => this._client.connect(login, passcode, ((frame)=> this._onConnect(frame) || resolve()), reject));
  },

  disconnect: function () {
    this._autoConn = false
    return new Promise((resolve, reject)=> this._client.disconnect(resolve))
  },

  send: function (id, data, label = null) {

    this._client.send(`${HOST_PATH}/${id}`, {}, createBodyStr(data, label));
  },

  subscribe: function (id) {
    let subscriptions = this._subscriptions

    if (!subscriptions[id]) subscribe(this, id);

    subscriptions[id] = true
  },

  unsubscribe: function (id) {
    let subscriptions = this._subscriptions

    unsubscribe(this, id);
    delete subscriptions[id]
  },

  debug: function (enabled) {

    this._isDebugging = enabled;
  },

  getSessionId: function () {
    return this._sessionId;
  }

};

inherits(GeneralSocketClient, Observer);


export default GeneralSocketClient

