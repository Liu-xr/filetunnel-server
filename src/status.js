/**
 * All response status
 */
module.exports = {
  OK: 0,
  register: {
    DUPLICATED_USERNAME: 1
  },
  UNKNOWN_ERROR: -1,
  FAILED: -1,
  transfer: {
    REQUEST: 1,
    CONNECTING: 2,
    DENIED: 3,
    TRANSFERRING: 4,
    FINISHED: 5,
    CANCELLED: 6,
    PAUSED: 7,
    WAITING: 8,
    FAILED: 9
  },
  connection: {
    CONNECTED: 0,
    CONNECTING: 1,
    DISCONNECTED: 2
  }
}
