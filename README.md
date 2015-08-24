
# simple-rcon

[![Build Status](https://travis-ci.org/prestonp/simple-rcon.svg?branch=master)](https://travis-ci.org/prestonp/simple-rcon)
[![Coverage Status](https://coveralls.io/repos/prestonp/simple-rcon/badge.svg?branch=master&service=github)](https://coveralls.io/github/prestonp/simple-rcon?branch=master)

[![Dependency Status](https://david-dm.org/prestonp/simple-rcon.svg)](https://david-dm.org/prestonp/simple-rcon)
[![devDependency Status](https://david-dm.org/prestonp/simple-rcon/dev-status.svg)](https://david-dm.org/prestonp/simple-rcon#info=devDependencies)

Simple, painless Node.js [RCON](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol) client for Source servers.

##### Install

```
npm install --save simple-rcon
```

##### Examples

```js
var Rcon = require('simple-rcon');
var client = new Rcon({
  host: '127.0.0.1',
  port: '27015',
  password: 'rconPassword'
}).exec('changelevel cp_badlands', function() {
  client.exec('say \'hey look the map changed!\'');
}).exec('status', function(res) {
  console.log('Server status', res.body);
}).exec('sm_kick somebody', function() {
  client.close();
}).connect();

client.on('authenticated', function() {
  console.log('Authenticated!');
}).on('connected', function() {
  console.log('Connected!');
}).on('disconnected', function() {
  console.log('Disconnected!');
});
```

##### API

* `new Rcon([options])`:
  - `options.host`: **String** host address
  - `options.port`: **Integer** port number
  - `options.password`: **String** RCON password
* `exec(command, callback)`: Sends RCON commands to server. If `exec` is called before the `authenticated` event is emitted, the commands will be buffered for execution upon the `authenticated` event.
  - `command` - **String** containing remote command
  - `callback` - **Function** with signature `function(res) {}`
* `close()`: Closes connection

##### Events

* `connecting` Client connecting to server.
* `connected` Client connected to server, although not authenticated.
* `authenticated` Client authenticated successfully with rcon password.
* `error` Connection interrupted by an error. Event callback accepts a single `err` argument.
* `disconnecting` Connection is about to close, get interrupted or dropped.
* `disconnected` Connection has been closed, interrupted, or dropped.

##### Contributors

[Ant Cosentino](https://github.com/skibz)

##### Further Reading

Read more about the [RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)

##### License

MIT
