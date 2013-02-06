var net = require('net'),
    client = null

var SERVERDATA_AUTH = 0x03,
    SERVERDATA_AUTH_RESPONSE = 0x02,
    SERVERDATA_EXECCOMMAND = 0x02,
    SERVERDATA_RESPONSE_VALUE = 0x00,
    AUTH_ID = 0x123, // any positive integer (mirrored by server's response)
    REQ_ID = 0x321,  // any positive integer (also mirrored)
    AUTHENTICATED = false

// Contains queue of functions
var queue = []

var Rcon = function(_host, _port) {
  client = net.connect({host: _host, port: _port},
    function() {
      // Connected!
    }) 

  client.on('data', function(data) {
    var res = readResponse(data)
    if(AUTHENTICATED && res.type == SERVERDATA_RESPONSE_VALUE) {
      var fn = queue.shift();
      (fn)(res);
    }

    if(res.type == SERVERDATA_RESPONSE_VALUE) {
        AUTHENTICATED = true
    }
    
    client.end()
  })

  client.on('end', function() {
    // Disconnected!
  })
}

Rcon.prototype.auth = function(rcon) {
  client.write(createRequest(SERVERDATA_AUTH, AUTH_ID, rcon))
}

Rcon.prototype.exec = function(cmd, fn) {
  fn = fn || function(res){};
  client.write(createRequest(0x02, REQ_ID, cmd))
  queue.push(fn)
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
