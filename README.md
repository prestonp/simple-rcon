simple-rcon
===========

Simple, painless node RCON client for Source servers

Example

```
var Rcon = require('simple-rcon')

// Host: a string containing the host address
// Port: an int for the server port number
var rconClient = new Rcon('127.0.0.1', 27015)

// Set up rcon password
rconClient.auth('rconPassword')

// Send rcon commands
rconClient.exec('changelevel cp_badlands')

// Send command with response
rconClient.exec('status', function(res) {
  console.log('response: ' + res.body)
})
```
Read more about the [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)