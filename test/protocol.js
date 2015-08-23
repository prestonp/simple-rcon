
var expect = require('chai').expect;
var protocol = require('../lib/protocol');

describe('Protocol', function() {

  describe('#SERVERDATA_AUTH', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.SERVERDATA_AUTH).to.equal(0x03);
    });
  });

  describe('#SERVERDATA_AUTH_RESPONSE', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.SERVERDATA_AUTH_RESPONSE).to.equal(0x02);
    });
  });

  describe('#SERVERDATA_EXECCOMMAND', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.SERVERDATA_EXECCOMMAND).to.equal(0x02);
    });
  });

  describe('#SERVERDATA_RESPONSE_VALUE', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.SERVERDATA_RESPONSE_VALUE).to.equal(0x00);
    });
  });

  describe('#AUTH_ID', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.AUTH_ID).to.equal(0x123);
    });
  });

  describe('#REQ_ID', function() {
    it('should have a hexadecimal value', function() {
      expect(protocol.REQ_ID).to.equal(0x321);
    });
  });

});
