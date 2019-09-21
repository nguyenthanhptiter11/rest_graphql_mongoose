const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')

const DateHelpers = require('../../libs/DateHelpers')

const events_ = async eventIds => {

    try {

        const eventsFinder = await Event.find({
            _id: {
                $in: eventIds
            }
        })
        return eventsFinder.map(event => {

            return eventFormater(event)
        })
    } catch (err) {

        throw err
    }
}

const userById = async userId => {

    try {

        const userFinder = await User.findById(userId)
        return {
            ...userFinder._doc,
            _id: userFinder.id,
            createdEvents: events_.bind(this, userFinder._doc.createdEvents)
        }

    } catch (err) {

        throw err
    }
}

const eventById = async (eventId) => {

    try {

        const event = await Event.findById(eventId)
        return eventFormater(event)
    } catch (err) {

        throw err
    }
}

const eventFormater = (event) => {
    return event ? {
        ...event._doc,
        _id: event.id,
        date: DateHelpers.dateToISOString(event.date),
        creator: userById.bind(this, event.creator)
    } : null
}

module.exports = {
    events_,
    userById,
    eventById,
    eventFormater

}