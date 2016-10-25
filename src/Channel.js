
import Observer from './events/Observer';

function Channel (generalClient, id) {

  this._id = id;
  this._client = generalClient;
}


Channel.prototype.on = function (...args) {

  var type = null;
  var func = null;
  var id = this._id;

  if (args.length > 1) [type, func] = args;

  else [func] = args;


  let name = Observer.buildName(id, type);

  this._client._client.on(name, func);

  return this;
};

Channel.prototype.off = function (...args) {

  var type = null;
  var func = null;
  var id = this._id;

  if (args.length > 1) [type, func] = args;

  else [func] = args;


  let name = Observer.buildName(id, type);

  this._client._client.off(name, func);

  return this;
};



export default Channel;

