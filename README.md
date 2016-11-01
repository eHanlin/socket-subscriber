socket-subscriber
=====================================

## Demo

[demo page](https://ehanlin.github.io/socket-subscriber/demo/index.html)

## Usage

Create a instance.
```js
var client = new SocketSubscriber(url, {debug:true});
```

Register connect and error events.
```js
client.on('connect', ()=> console.log('connection')); 
client.on('close', ()=> console.log('close'));
```

Subscribe a room with register listener.
```js
client.room('type', 'id').on((evt)=> console.log(evt));
```

Subscribe a date pusher with register listener.

```js
client.date().on((evt)=> console.log(evt));
``` 

Send a message to room.
```js
client.sendRoom('type', 'id', data);
```

## Event

* connect
* close

## API

* on(evtName:string, listener:function)
* off(evtName:string, listener:function)
* debug(enabled:boolean)
* date()
* room(type:string, id:string)
* exitRoom(type:string ,id: string)
* sendRoom(type:string, id:string, label:string?, data:object?)

## Run dev

```sh
npm run dev
```

## Build

```sh
npm run build
```

