var Rcon = require('simple-rcon')

/** 
 * Host: a string containing the host address
 * Port: an int for the server port number
 * Password: a string containing rcon password
 **/
var rcon = new Rcon('127.0.0.1', 27015, 'rconPassword')

/**
 * Various events
 **/
rcon.on('connected', function() { 
  console.log('Connected to server!')
})

rcon.on('authenticated', function() { 
  console.log('Logged into server, you may execute commands!')

  // Send rcon commands  
  rcon.exec('changelevel cp_badlands')

  // Send command with response
  rcon.exec('status', function(res) {
    console.log('response: ' + res.body)
  })
  
  rcon.close()
})

rcon.on('disconnected', function() { 
  console.log('Disconnected from server!')
})

rcon.on('error', function(e) {
  console.error(e)
})
