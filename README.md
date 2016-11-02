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

### SocketSubscriber

* on(evtName:string, listener:function)
* off(evtName:string, listener:function)
* debug(enabled:boolean)
* date() : Channel
* room(type:string, id:string) : Channel
* exitRoom(type:string ,id: string)
* sendRoom(type:string, id:string, label:string?, data:object?)

### Channel

* on(evtName:String?, listener:function):Channel
* off(evtName:String?, listener:function):Channel

## Run dev

```sh
npm run dev
```

## Build

```sh
npm run build
```

