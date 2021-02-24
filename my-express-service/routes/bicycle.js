const express = require('express')
const router = express.Router()
const model = require('../model')

function hasOwnProperty (o, p) {
  return Object.prototype.hasOwnProperty.call(o, p)
}

function validateData (o) {
  let valid = o !== null && typeof o === 'object'
  valid = valid && hasOwnProperty(o, 'brand')
  valid = valid && hasOwnProperty(o, 'color')
  valid = valid && typeof o.brand === 'string'
  valid = valid && typeof o.color === 'string'
  return valid && {
    brand: o.brand,
    color: o.color
  }
}

function validateBody (o) {
  let valid = o !== null && typeof o === 'object'
  valid = valid && hasOwnProperty(o, 'data')
  valid = valid && o.data !== null && typeof o.data === 'object'
  const data = valid && validateData(o.data)

  return valid && data && {data}
}

function isIdValid (n) {
  n = Number(n)
  const MAX_SAFE = Math.pow(2, 53) - 1

  return isFinite(n) && Math.floor(n) === n && Math.abs(n) <= MAX_SAFE
}

function isParamsValid (o) {
  var valid = o !== null && typeof o === 'object'
  valid = valid && hasOwnProperty(o, 'id')
  valid = valid && isIdValid(o.id)
  return valid
}

function badRequest () {
  const err = new Error('Bad Request')
  err.status = 400
  return err
}

router.get('/:id', function (req, res, next) {
  if (!isParamsValid(req.params)) {
    return next(badRequest())
  }

  model.bicycle.read(req.params.id, (err, result) => {
    if (err) {
      if (err.message === 'not found') return next()
      else return next(err)
    }
    const sanitizedResult = validateData(result)
    if (!sanitizedResult) {
      return next(new Error('Server Error'))
    }
    res.send(sanitizedResult)
  })
})

router.post('/', function (req, res, next) {
  const id = model.bicycle.uid()
  const body = validateBody(req.body)

  if (!body) {
    return next(badRequest())
  }

  model.bicycle.create(id, body.data, (err) => {
    if (err) return next(err)

    if (isIdValid(id)) res.status(201).send({ id })
    else next(new Error('Server Error'))
  })
})

router.post('/:id/update', function (req, res, next) {
  if (!isParamsValid(req.params)) {
    return next(badRequest())
  }
  const body = validateBody(req.body)

  if (!body) {
    return next(badRequest())
  }

  model.bicycle.update(req.params.id, body.data, (err) => {
    if (err) {
      if (err.message === 'not found') return next()
      else return next(err)
    }
    res.status(204).send()
  })
})

router.put('/:id', function (req, res, next) {
  if (!isParamsValid(req.params)) {
    return next(badRequest())
  }

  const body = validateBody(body)
  if (!body) {
    return next(badRequest())
  }

  model.bicycle.create(req.params.id, body.data, (err) => {
    if (err) {
      if (err.message !== 'resource exists') {
        return next(err)
      }
      return model.bicycle.update(req.params.id, body.data, (err) => {
        if (err) return next(err)
        res.status(204).send()
      })
    }
    return res.status(201).send({})
  })
})

router.delete('/:id', function (req, res, next) {
  if (!isParamsValid(req.params)) {
    return next(badRequest())
  }

  model.bicycle.del(req.params.id, (err) => {
    if (err) {
      if (err.message === 'not found') return next()
      else return next(err)
    }
    res.status(204).send()
  })
})

module.exports = router
