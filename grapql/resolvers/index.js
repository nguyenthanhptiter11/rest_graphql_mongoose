// TODO: async all


const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')

const events_ = async eventIds => {
    try {

        const eventsFinder = await Event.find({
            _id: {
                $in: eventIds
            }
        })
        return eventsFinder.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: event.date ? new Date(event.date).toISOString() : '___',
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {

        throw err
    }
}

const user = async userId => {
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

const eventMapped = (event) => {
    return {
        _id: event._id ? event.id.toString() : '___',
        title: event.title || '___',
        price: event.price || 0,
        date: event.date ? new Date(event.date).toISOString() : '___'
    }
}

module.exports = {
    events: async () => {
        try {
            const eventsFinder = await Event.find()
            return eventsFinder.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: event.date ? new Date(event.date).toISOString() : '___',
                    creator: user.bind(this, event.creator)
                }
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args) => {
        try {
            const creator = await User.findById('5c337a9cea77d22706eb1a23')
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
            const createdEvent = {
                ...result._doc,
                _id: result.id,
                date: result.date ? new Date(result.date).toISOString() : '___',
                creator: user.bind(this, result.creator)
            }

            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    },
    createUser: async (args) => {
        try {
            const userFinder = await User.findOne({
                email: args.userInput.email
            })
            if (userFinder) {
                throw new Error('User exits already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return {
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch (err) {
            throw err
        }


    }
}