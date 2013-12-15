/** 
 * Rcon protocol specific vars
 **/
module.exports = {
  SERVERDATA_AUTH: 0x03
, SERVERDATA_AUTH_RESPONSE: 0x02
, SERVERDATA_EXECCOMMAND: 0x02
, SERVERDATA_RESPONSE_VALUE: 0x00
, AUTH_ID: 0x123 // any positive integer (mirrored by server's response)
, REQ_ID: 0x321  // any positive integer (also mirrored)
};