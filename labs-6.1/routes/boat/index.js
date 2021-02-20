'use strict'

const { promisify } = require('util')
const {boat} = require('../../model')
const read = promisify(boat.read)
const create = promisify(boat.create)

module.exports = async (fastify, opts) => {
  const { notFound, conflict } = fastify.httpErrors

  fastify.get('/:id', async function (request, reply) {
    const {id} = request.params
    try {
      return await read(id)
    } catch (err) {
      if (err.message === 'not found') throw notFound()
      throw err
    }
  })

  fastify.post('/', async (request, reply) => {
    const {data} = request.body
    const id = boat.uid()

    try {
      await create(id, data)
      reply.code(201)
      return {id}
    } catch (err) {
      if (err.code === 'E_RESOURCE_EXISTS') throw conflict()
      throw err
    }
  })
}
