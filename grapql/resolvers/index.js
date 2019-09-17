// TODO: async all


const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

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

const eventMapped = async (eventId) => {
    try {

        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            date: event.date ? new Date(event.date).toISOString() : '___',
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err
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


    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: eventMapped.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()

                }
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        try {
            const eventFinder = await Event.findOne({
                _id: args.eventId
            })
            const booking = new Booking({
                user: '5c337a9cea77d22706eb1a22',
                event: eventFinder
            })
            const result = await booking.save()
            console.log(result._doc.event)
            return {
                ...result._doc,
                _id: result.id,
                user: user.bind(this, result.user),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({
                _id: args.bookingId
            })
            return event
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}