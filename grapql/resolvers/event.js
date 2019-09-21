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
    createEvent: async (args, req) => {

        if (!req.isAuth) {

            throw new Error('Unauthenticated!!!')
        }

        try {

            const creator = await User.findById(req.userId)
            if (!creator) {

                throw new Error('User is not exits.')
            }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
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