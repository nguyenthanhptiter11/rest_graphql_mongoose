const event = require('./event')

const user = require('./user')

const booking = require('./booking')

module.exports = {
    ...event,
    ...user,
    ...booking
}