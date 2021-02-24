'use strict'

const data = require('./data.js')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return await data()
  })
}
