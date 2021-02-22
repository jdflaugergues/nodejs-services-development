'use strict'

const path = require('path')
const sensible = require('fastify-sensible')
const AutoLoad = require('fastify-autoload')
const replyFrom = require('fastify-reply-from')


module.exports = async function (fastify, opts) {
  fastify.register(sensible)
  fastify.register(replyFrom)

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
