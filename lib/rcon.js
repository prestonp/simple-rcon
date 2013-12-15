/**
 * Dependencies
 **/
var net = require('net')
  , events = require('events')
  , util = require('util')
  , Packet = require('./packet');

/** 
 * Rcon protocol specific vars
 **/
var SERVERDATA_AUTH = 0x03
  , SERVERDATA_AUTH_RESPONSE = 0x02
  , SERVERDATA_EXECCOMMAND = 0x02
  , SERVERDATA_RESPONSE_VALUE = 0x00
  , AUTH_ID = 0x123 // any positive integer (mirrored by server's response)
  , REQ_ID = 0x321  // any positive integer (also mirrored)

/**
 * Globals  
 **/
var queue = [] // Contains queue of response callbacks
  , authenticated = false
  , client = null

var Rcon = function(options) {
  var self = this;

  // Defaults
  options.host = options.host || '127.0.0.1';
  options.port = options.port || 27015;
  
  events.EventEmitter.call(this);

  client = net.connect({host: options.host, port: options.port},
    function clientConnected() {
      self.emit('connected')
      client.write(Packet.createRequest(SERVERDATA_AUTH, AUTH_ID, options.password))
    }) 

  client.on('data', function(data) {
    var res = Packet.readResponse(data)
    // console.log('Res'  + JSON.stringify(res)) // Useful debug
 
    switch(res.type) {
      case SERVERDATA_RESPONSE_VALUE : 
        if(authenticated) {
          var fn = queue.shift();
          if(typeof(fn) == 'function')
            (fn)(res);
        }
        break
      case SERVERDATA_AUTH_RESPONSE :
        if(res.body == "") {
          authenticated = true
          self.emit('authenticated')
        } else {
          self.emit('error', 'Error: Invalid RCON password')
        }
        break
      default:
        self.emit('error', 'Error: Unknown server response')
        break
    }
  })

  client.on('error', function(e) {
    self.emit('error', e)
  })

  client.on('end', function() {
    self.emit('disconnected')
  })
}

util.inherits(Rcon, events.EventEmitter)

Rcon.prototype.exec = function(cmd, fn) {
  if(authenticated) {
    client.write(createRequest(0x02, REQ_ID, cmd))
    queue.push(fn)
  } else {
    this.emit('error', 'Error: Trying to execute commands before connected/authenticated')
  }
}

Rcon.prototype.close = function(fn) {
  client.end()
}

module.exports = Rcon;
