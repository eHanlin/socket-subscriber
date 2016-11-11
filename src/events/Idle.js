import {IDLE} from '../constants/EventType'


function onIdle() {
  this.trigger && this.trigger(IDLE);
}

var idleMethods = {

  _countIdle: function (time) {
    let idleInfo = this._idleInfo = {time:time};
    this.__resetIdle();
  },

  __resetIdle: function () {
    let idleInfo = this._idleInfo;

    if (this._idleInfo) {
      clearTimeout(idleInfo.id);
      idleInfo.id = setTimeout(()=> this::onIdle(), idleInfo.time);
    }
  },

};

function decorateClass(target) {

  for (var name in idleMethods) target.prototype[name] = idleMethods[name];
}

function Default() {
  return decorateClass;
}

Default.reset = function (target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function () {
    this.__resetIdle();
    return fn.apply(this, arguments);
  };
};

export default Default;
