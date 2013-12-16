var assert = require("assert")
  , Packet = require('../lib/packet')
  , Protocol = require('../lib/protocol');

describe('Packet', function() {
  describe('#encode()', function() {
    it('should buffer data', function() {
      var request = Packet.encode(Protocol.SERVERDATA_AUTH, Protocol.AUTH_ID, "rcon_password");
      assert(request);
      assert(request instanceof Buffer);
    });
  });

  describe('#decode()', function() {
    it('should read packet', function() {
      var request = Packet.encode(Protocol.SERVERDATA_AUTH, Protocol.AUTH_ID, "rcon_password");
      var response = Packet.decode(request);
      assert(response);
      assert(response.size);
      assert.equal(response.id, Protocol.AUTH_ID);
      assert.equal(response.type, Protocol.SERVERDATA_AUTH);
      assert.equal(response.body, 'rcon_password');
    });
  });
});
