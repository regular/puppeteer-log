const pull = require('pull-stream')
const Pushable = require('pull-pushable')

module.exports = function(log, cb) {
  const pushable = Pushable()
  pull(
    pushable,
    pull.asyncMap( (consoleMessage, cb) => {
      if (Array.isArray(consoleMessage)) {
        return cb(null, {
          values: consoleMessage
        })
      }
      const promises = consoleMessage.args().map(jsh => jsh.jsonValue())
      Promise.all(promises)
        .then(values => cb(null, {consoleMessage, values}))
        .catch(err => cb(err))
    }),
    pull.drain(log, cb)
  )
  return pushable
}
