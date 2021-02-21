'use strict'

const got = require('got')

const {
  BOAT_SERVICE_PORT = 3333,
  BRAND_SERVICE_PORT = 3334
} = process.env

const boatSrv = `http://localhost:${BOAT_SERVICE_PORT}`
const brandSrv = `http://localhost:${BRAND_SERVICE_PORT}`
const options = {timeout: 1250}

module.exports = async function (fastify, opts) {
  const { httpErrors } = fastify

  fastify.get('/:id', async function (request, reply) {
    const id = Number(request.params.id)

    if (isNaN(id)) {
      throw httpErrors.badRequest()
    }

    try {
      const boat = await got(`${boatSrv}/${id}`, options).json()
      const brand = await got(`${brandSrv}/${boat.brand}`, options).json()

      return {
        id: boat.id,
        color: boat.color,
        brand: brand.name
      }

    } catch(err) {
      if (!err.response) {
        throw err
      }
      if (err.response.statusCode === 404) {
        throw httpErrors.notFound()
      }
      if (err.response.statusCode === 400) {
        throw httpErrors.badRequest()
      }
      throw err
    }
  })
}

