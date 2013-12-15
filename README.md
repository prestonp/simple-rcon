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
var Rcon = require('simple-rcon')
var rcon = new Rcon('127.0.0.1', 27015, 'rconPassword')

rcon.on('authenticated', function() {
  console.log('Logged into server, you may execute commands!')
  
  // Send rcon commands
  rcon.exec('changelevel cp_badlands')
  
  // Send command with response
  rcon.exec('status', function(res) {
    console.log('response: ' + res.body)
  })
})
```
Check out another [example](example.js) for more stuff


API
===

new Rcon(host, port, password)
=========
* host - string containing host address
* port - int for server port number
* password - string containing rcon password

rcon.exec(cmd, [callback(res)])
-----
* cmd - String containing remote command
* callback(res) - Callback function containing response

Sends rcon commands to server. Must be called after **authenticated** event.

rcon.close()
-------
Closes connection

Events
======
'connected'
---------
Client connected to server, although not authenticated

'authenticated'
-----------
Client authenticated successfully with rcon password. Commands may be executed now.

'error'
-----
* e - String containing error description

'disconnected'
------
Connection has been closed, interrupted, or dropped.

----

Other
-----

Read more about the [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)

License
-------

MIT
