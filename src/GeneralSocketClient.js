
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


function GeneralSocketClient (host, {autoConn = true, retryTime = 1000, retryCount = -1} = {}) {
  Observer.call(this);

  this.host = host;
  this.isClose = true;
  this._autoConn = autoConn;
  this._firstConnected = false;
  this._retryCount = retryCount;
  this._retryTime = retryTime;
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

  _resetStates: function () {
    this._currentRetryCount = 0;
  },

  _incRetryCount: function (){
    this._currentRetryCount++;
  },

  _isNeedReConnection: function () {
    let retryCount = this._retryCount;

    if (this._autoConn && (retryCount < 0 || retryCount > this._currentRetryCount)) return true; else return false;
  },

  _onClose: function () {
    this.isClose = true;
    this._sessionId = null;

    if (this._isNeedReConnection()) setTimeout(()=>this._reconnect(), this._retryTime);

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
    this._incRetryCount();

    this
    .connect(this._lastLogin, this._passcode, true)
    .then((function () {
      for (var name in subscriptions) {
        subscribe(this, name);
      }
    }).bind(this));
  },

  connect: function (login, passcode, _internal = false) {
    this._lastLogin = login
    this._passcode = passcode

    if (this.isClose) {
      if (!_internal) this._resetStates();
      this._initConnection();
    }

    return new Promise((resolve, reject) => this._client.connect(login, passcode, ((frame)=> this._onConnect(frame) || resolve()), reject));
  },

  disconnect: function () {
    this._resetStates();
    this._autoConn = false
    return new Promise((resolve, reject)=> this._client.disconnect(resolve))
  },

  send: function (id, data, label = null, headers = {}) {

    let subscriber = this._frame.headers.session;
    let sendHeaders = {subscriber:subscriber, id:id};
    console.log(headers);

    for(let headerName in headers) sendHeaders[headerName] = headers[headerName];

    this._client.send(`${HOST_PATH}/${id}`, sendHeaders, createBodyStr(data, label));
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

