/**
 * All response status
 */
module.exports = {
  OK: 0,
  UNKNOWN_ERROR: -1,
  ACCESS_DENIED: -2,
  NOT_FOUND: -3,
  session: {
    NO_SUCH_SESSION: 1
  },
  user: {
    DUPLICATED_USERNAME: 1,
    WRONG_USERNAME_OR_PASSWORD: 2,
    NO_SUCH_USER: 3,
    CANNOT_OPERATE_SELF: 4,
    FRIEND_REQUEST_EXISTED: 5,
    ALREADY_FRIEND: 6
  },
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
