const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  const { greeting = 'Hello '} = req.query
  res.render('hello', { greeting: greeting })
})

module.exports = router
