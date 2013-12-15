var Rcon = require('./lib/rcon');

/** 
 * Constructor accepts an `options` hash
 *  host: string for the host address (default 127.0.0.1)
 *  port: string for the server port number (default 27015)
 *  password: string for the rcon password
 **/
var rcon = new Rcon({
  host: 'SERVER_ADDRESS'
, password: 'RCON_PASSWORD'
});

/**
 * Various events
 **/
rcon.on('connected', function() { 
  console.log('Connected to server!');
});

rcon.on('authenticated', function() { 
  console.log('Logged into server, you may execute commands!');

  // Send rcon commands  
  rcon.exec('changelevel cp_badlands');

  // Send command with response
  rcon.exec('status', function(res) {
    console.log('response: ' + res.body)
  });
  
  rcon.close();
});

rcon.on('disconnected', function() { 
  console.log('Disconnected from server!');
});

rcon.on('error', function(e) {
  console.error(e);
});
