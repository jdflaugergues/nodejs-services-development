const express = require('express')
const router = express.Router()
const hnLatestStream = require('hn-latest-stream')
const finished = require('stream').finished

router.get('/', function(req, res, next) {
  const { amount = 10, type = 'html' } = req.query

  if (type === 'html') res.type('text/html')
  if (type === 'json') res.type('application/json')

  const stream = hnLatestStream(amount, type)

  // tells the stream to write all data it receives to res object
  // end = false prevents pipe from performing its defautl behavior of endings the destination stream qhen the source strean has ended
  stream.pipe(res, {end: false})

  // used to determine when stream has ended
  finished(stream, (err) => {
    if (err) {
      next(err)
      return
    }
    res.end()
  })

})

module.exports = router
