
var expect = require('chai').expect;
var Rcon = require('../lib/rcon');

describe('Rcon', function() {

  describe('#exec', function() {
    it('should add a command to the internal command queue if the client is not yet authenticated', function() {
      var client = new Rcon();
      expect(client.commands).to.be.empty;
      client.exec('abc');
      expect(client.commands).to.not.be.empty;
    });

    it('should add a callback to the internal responseCallbacks queue', function() {
      var client = new Rcon();
      expect(client.responseCallbacks).to.be.empty;
      client.exec('abc', function() {});
      expect(client.responseCallbacks).to.not.be.empty;
    });

    it('should return the client object', function() {
      var client = new Rcon();
      expect(client.exec('abc')).to.deep.equal(client);
    });
  });

  describe('#open', function() {
    it('should emit a connecting event', function(done) {
      var client = new Rcon();
      client.on('connecting', done);
      client.connect();
    });

    it('should return the client object', function() {
      var client = new Rcon();
      expect(client.connect()).to.deep.equal(client);
    });
  });

  describe('#close', function() {
    it('should emit a disconnecting event', function(done) {
      var client = new Rcon();
      client.on('disconnecting', done);
      client.close();
    });

    it('should return the client object', function() {
      var client = new Rcon();
      expect(client.close()).to.deep.equal(client);
    });
  });

});
