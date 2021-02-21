'use strict'
const got = require('got')

const {
  BICYCLE_SERVICE_PORT = 4000
} = process.env

const bicycleSrv = `http://localhost:${BICYCLE_SERVICE_PORT}`

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params
    const bicycle = await got(`${bicycleSrv}/${id}`).json()
    return bicycle
  })
}
