simple-rcon
===========

Simple, painless node RCON client for Source servers.

Install 
-------

```
npm install simple-rcon
```

Run tests
---------

```
git clone git@github.com:prestonp/simple-rcon.git
cd simple-rcon
npm install
npm test
```

Example
-------

```
var Rcon = require('simple-rcon');
var client = new Rcon({
  host: '127.0.0.1'
, port: '27015'
, password: 'rconPassword'
});

client.on('authenticated', function() {
  console.log('Logged into server, you may execute commands!');
  
  // Send rcon commands
  client.exec('changelevel cp_badlands');
  
  // Send command with response
  client.exec('status', function(res) {
    console.log('response: ' + res.body);
  });
});
```
Check out another [example](example.js) for more stuff


API
===

__Constructor__

* [new Rcon(options)](#new-rconoptions)

__Methods__

* [exec(cmd, callback)](#execcmd-callbackres)
* [close()](#close)

### new Rcon(options)

Returns a new client and attempts to connect to server.

__Arguments__

* options - object containing server info
  * host - string containing host address
  * port - int for server port number
  * password - string containing rcon password

### exec(cmd, [callback(res)])

Sends rcon commands to server. Must be called after **authenticated** event.

__Arguments__

* cmd - String containing remote command
* callback(res) - Callback function containing response

### close()

Closes connection

Events
======

### 'connected'

Client connected to server, although not authenticated

### 'authenticated'

Client authenticated successfully with rcon password. Commands may be executed now.

### 'error'

Connection interrupted by an error.

__callback(error)__

  * error - String containing error description

Example:

```
client.on('error', function(error) {
  console.log(error);
});
```

### 'disconnected'

Connection has been closed, interrupted, or dropped.

Other
-----

Read more about the [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)

License
-------

MIT
