const crypto = require('crypto')
const { SessionModel } = require('../model/session')
const { logger } = require('../logger')
const clients = require('../connection/clients')
const { sendRequest } = require('../connection/payload')

const callbacks = new Map()

function getUniqueId () {
  let transmitId = crypto.randomBytes(16).toString('hex')
  while (callbacks.has(transmitId)) {
    transmitId = crypto.randomBytes(16).toString('hex')
  }
  return transmitId
}

function sendTransmit (fromSocket, toUid, tid, fromUid) {
  logger.debug('transmit got connection, start to sendTransmit')
  SessionModel.findOne({ userId: toUid })
    .then(session => {
      if (session === null) {
        logger.debug(`send transmit no session for target ${toUid}, close connection`)
        fromSocket.end()
        return
      }
      const client = clients.get(session.ip, session.controlPort)
      if (typeof client === 'undefined') {
        logger.debug(`send transmit no client for target ${toUid}, close connection`)
        fromSocket.end()
        return
      }
      fromSocket.transmitId = tid
      const transmitId = getUniqueId()
      // const fromIP = session.ip
      // const fromPort = session.controlPort
      callbacks.set(transmitId, async (toSocket) => {
        pipe(toSocket, fromSocket, fromUid)
      })
      sendRequest({ action: 'sendTransmit', data: { _id: transmitId } }, client)
    })
    .catch(err => {
      logger.debug(`send transmit no session for target ${toUid}, close connection`)
      fromSocket.end()
      logger.error(err)
    })
}

function transmitReady (client, _id) {
  sendRequest({
    action: 'transmitReady',
    data: { _id }
  }, client)
}

function pipe (toSocket, fromSocket, fromUid) {
  SessionModel.findOne({ userId: fromUid })
    .then(session => {
      if (session === null) {
        logger.debug(`transmitReady no session for sender ${fromUid}, close connection`)
        fromSocket.end()
        toSocket.end()
        return
      }
      const client = clients.get(session.ip, session.controlPort)
      if (typeof client === 'undefined') {
        logger.error('Cannot find transmit sender\'s control socket !')
        return
      }
      logger.debug('transmit start to pipe')
      fromSocket.removeAllListeners(['data'])
      toSocket.removeAllListeners(['data'])
      fromSocket.pipe(toSocket)
      toSocket.pipe(fromSocket)
      transmitReady(client, fromSocket.transmitId)
    })
    .catch(err => {
      logger.debug(`transmitReady no session for sender ${fromUid}, close connection`)
      fromSocket.end()
      toSocket.end()
      logger.error(err)
    })
}

module.exports = { sendTransmit, transmitReady, getUniqueId, callbacks }
