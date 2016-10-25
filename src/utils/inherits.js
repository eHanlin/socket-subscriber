
function inherit (func1, func2) {
  var proto1 = func1.prototype;
  var proto2 = func2.prototype;

  for (var name in proto2) {
    if(proto2.hasOwnProperty(name)) proto1[name] = proto2[name];
  }
}

export default inherit

