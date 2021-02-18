'use strict'

const stream = require('./stream')

module.exports = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    reply.type('text/html')
    return stream()
  })
}
