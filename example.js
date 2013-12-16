var Rcon = require('./lib/rcon');

/** 
 * Constructor accepts an `options` hash
 *  host: string for the host address (default 127.0.0.1)
 *  port: string for the server port number (default 27015)
 *  password: string for the rcon password
 **/
var client = new Rcon({
  host: 'SERVER_ADDRESS'
, password: 'RCON_PASSWORD'
});

// Send command with response
client.exec('status', function(res) {
  console.log('response: ' + res.body);
});

// Send rcon commands  
client.exec('changelevel cp_granary');

/**
 * Various events
 **/
client.on('connected', function() { 
  console.log('Connected to server!');
});

client.on('authenticated', function() {
  console.log('Authenticated!');
});

client.on('disconnected', function() { 
  console.log('Disconnected from server!');
});

client.on('error', function(e) {
  console.log("ERROR!!!");
  console.error(e);
});

setTimeout(function() {
  console.log('Closing connection..');
  client.close();
}, 40000);