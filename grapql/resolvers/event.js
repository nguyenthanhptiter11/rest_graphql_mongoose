const Event = require('../../models/event')
const User = require('../../models/user')

const {
    eventFormater
} = require('./adapter')

module.exports = {
    events: async () => {
        try {
            const eventsFinder = await Event.find()
            return eventsFinder.map(event => {
                return eventFormater(event)
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args) => {
        try {
            const creator = await User.findById('5c337a9cea77d22706eb1a22')
            if (!creator) {

                throw new Error('User is not exits.')

            }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5c337a9cea77d22706eb1a22'
            })
            const result = await event.save()
            const createdEvent = eventFormater(result)

            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    }
}