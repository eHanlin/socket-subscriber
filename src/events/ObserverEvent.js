
function ObserverEvent(type , data, label, opts) {
  this.type = type;
  this.data = data;
  this.label = label;
  for (var name in opts) this[name] = opts[name];
}

export default ObserverEvent

