
'use strict';

function flush() {
  this.commands.forEach(function(command) {
    this.client.write(Packet.encode(0x02, Protocol.REQ_ID+1, command));
  }, this);
  this.commands = [];
}

function dequeue(response) {
  var callback = this.responseCallbacks.shift();
  if (typeof callback === 'function') {
    callback(response);
  }
}

function connect() {
  this.client = net.connect({
    host: this.host,
    port: this.port
  }, function() {
    this.emit('connected');
    this.client.write(Packet.encode(
      Protocol.SERVERDATA_AUTH,
      Protocol.AUTH_ID,
      this.password
    ));
  }.bind(this));

  this.client.setTimeout(5000);
}

function listen() {
  this.client.on('data', function(data) {
    var res = Packet.decode(data);
    switch(res.type) {
      case Protocol.SERVERDATA_RESPONSE_VALUE:
        if (this.authenticated) {
          dequeue.call(this, res);
        }
        break;
      case Protocol.SERVERDATA_AUTH_RESPONSE:
        if (res.body !== '') {
          return this.emit('error', 'Error: Invalid RCON password');
        }
        this.authenticated = true;
        this.emit('authenticated');
        flush.call(this);
        break;
      default:
        this.emit('error', 'Error: Unknown server response');
        break;
    }
  }.bind(this));

  this.client.on('timeout', this.client.end.bind(this.client));
  this.client.on('end', this.emit.bind(this, 'disconnected'));

  this.client.on('error', function(e) {
    this.emit('error', e);
  }.bind(this));
}

var net = require('net'),
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    Packet = require('./packet'),
    Protocol = require('./protocol');

var Rcon = function(options) {
  EventEmitter.call(this);
  options = options || {};
  this.host = options.host || '127.0.0.1';
  this.port = options.port || '27015';
  this.password = options.password;
  this.authenticated = false;
  this.responseCallbacks = [];
  this.commands = [];

  if (options.connect) {
    process.nextTick(function() {
      connect.call(this);
      listen.call(this);
    });
  }
};

inherits(Rcon, EventEmitter);

Rcon.prototype.exec = function(command, callback) {
  if (this.authenticated) {
    this.client.write(Packet.encode(0x02, Protocol.REQ_ID, command));
  } else {
    this.commands.push(command);
  }
  this.responseCallbacks.push(callback);
  return this;
};

Rcon.prototype.connect = function() {
  this.emit('connecting');
  if (!this.client) {
    process.nextTick(function() {
      connect.call(this);
      listen.call(this);
    });
  }
  return this;
};

Rcon.prototype.end = function() {
  this.emit('disconnecting');
  if (this.client) this.client.end();
  return this;
};

module.exports = Rcon;
