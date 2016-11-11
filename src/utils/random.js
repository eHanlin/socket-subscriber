
let SIZE = 100000;

function randomString() {
  return (Math.random() * SIZE >> 1).toString(16);
}


export function string() {
  return (`${randomString()}-${randomString()}-${randomString()}-${randomString()}-${randomString()}`);
}

