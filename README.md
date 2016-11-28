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
* idle

## API

### SocketSubscriber(url:string, opts:object?)
> opts.debug(boolean)： Trace logs. (default:false)

> opts.retryCount(Number): The value is retring count. The connection is not retring if value is 0. And value < 0 will retry to connect success. (default: 10000)

> opts.retryTime(Number): Retry delay time. (default: -1)

> opts.idleTime(Number): Set idle time. (default: 600000)

> opts.incomingHeartbeat(Number): Set headrtbeat from server. (default: 1000 ms)

* on(evtName:string, listener:function)
* off(evtName:string, listener:function)
* debug(enabled:boolean)
* date() : Channel
* room(type:string, id:string) : Channel
* exitRoom(type:string ,id: string)
* sendRoom(type:string, id:string, label:string?, data:object?, headers: object?)
* getSockJSSessionId():string

### Channel

* on(evtName:string?, listener:function):Channel
* off(evtName:string?, listener:function):Channel

## Run dev

```sh
npm run dev
```

## Build

```sh
npm run build
```

