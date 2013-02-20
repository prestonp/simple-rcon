/**
 * Dependencies
 **/
var net = require('net')
  , events = require('events')
  , util = require('util')

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

var Rcon = function(_host, _port, _rcon) {
  var self = this

  events.EventEmitter.call(this)
  client = net.connect({host: _host, port: _port},
    function() {
      self.emit('connected')
      client.write(createRequest(SERVERDATA_AUTH, AUTH_ID, _rcon))
    }) 

  client.on('data', function(data) {
    var res = readResponse(data)
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

var createRequest = function(type, id, body) {
 
  var size   = Buffer.byteLength(body) + 14,
      buffer = new Buffer(size);
 
  buffer.writeInt32LE(size - 4, 0);
  buffer.writeInt32LE(id,       4);
  buffer.writeInt32LE(type,     8);
  buffer.write(body, 12, size - 2, "ascii");
  buffer.writeInt16LE(0, size - 2);
 
  return buffer;
};
 
var readResponse = function(buffer) {
  var response = {
    size: buffer.readInt32LE(0),
    id:   buffer.readInt32LE(4),
    type: buffer.readInt32LE(8),
    body: buffer.toString("ascii", 12, buffer.length - 2)
  }
  return response;
};

module.exports = Rcon
