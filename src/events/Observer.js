
import ObserverEvent from './ObserverEvent'

function Observer() {
  this._eventListeners = {}
}

function getListenersByName (observer, name) {
  let listenerArr = observer._eventListeners[name]

  return listenerArr || []
}

function appendListenerByName (observer, name, func) {
  let listenerArr = getListenersByName(observer, name)

  listenerArr.push(func)
  observer._eventListeners[name] = listenerArr
}

function removeListenerByName(observer, name, func) {
  if (func == null) {

    delete observer._eventListeners[name];

  } else {
    let listenerArr = getListenersByName(observer, name)
    let index = listenerArr.indexOf(func)

    if ( index > -1 ) listenerArr.splice(index, 1)
  }
}

function runListener(listener, name, data, label, now, args) {
  listener.call(null, new ObserverEvent(name, data, label, now))
}

Observer.prototype = {

  on: function (name, func) {

    appendListenerByName(this, name, func)
  },

  off: function (name, func) {

    removeListenerByName(this, name, func)
  },

  trigger: function (name, data = null, now = null, ...args) {

    let [evtType, label] = name.split(':')
    let evtListenerArr = getListenersByName(this, evtType) || []
    let listenerArr = getListenersByName(this, name) || []

    evtListenerArr.forEach((listener)=> runListener(listener, name, data, label, now, args))
    label && listenerArr.forEach((listener)=> runListener(listener, name, data, label, now, args))
  }
};

Observer.buildName = function (name, type) {

  return type ?`${name}:${type}`: name;
}

export default Observer

