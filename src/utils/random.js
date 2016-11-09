
let SIZE = 100000;

function randomString() {
  return (Math.random() * SIZE >> 1).toString(16);
}


export const string = function () {
  return (`${randomString()}-${randomString()}-${randomString()}-${randomString()}-${randomString()}`);
}

