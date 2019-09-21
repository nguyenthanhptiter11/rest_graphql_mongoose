const Event = require('../../models/event')
const Booking = require('../../models/booking')

const DateHelpers = require('../../libs/DateHelpers')
const {
    userById,
    eventById,
    eventFormater
} = require('./adapter')

module.exports = {
    bookings: async () => {

        try {

            const bookings = await Booking.find()

            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: userById.bind(this, booking._doc.user),
                    event: eventById.bind(this, booking._doc.event),
                    createdAt: DateHelpers.dateToISOString(booking._doc.createdAt),
                    updatedAt: DateHelpers.dateToISOString(booking._doc.updatedAt)

                }
            })
        } catch (err) {

            throw err
        }
    },
    bookEvent: async (args, req) => {

        if (!req.isAuth) {

            throw new Error('Unauthenticated!!!')
        }

        try {

            const eventFinder = await Event.findOne({
                _id: args.eventId
            })

            if (!eventFinder) {

                throw new Error('Event is not exist!!!')
            }

            const booking = new Booking({
                user: req.userId,
                event: eventFinder
            })
            const result = await booking.save()

            return {
                ...result._doc,
                _id: result.id,
                user: userById.bind(this, result.user),
                createdAt: DateHelpers.dateToISOString(result._doc.createdAt),
                updatedAt: DateHelpers.dateToISOString(result._doc.updatedAt)
            }
        } catch (err) {

            throw err
        }
    },
    cancelBooking: async (args, req) => {

        if (!req.isAuth) {

            throw new Error('Unauthenticated!!!')
        }

        try {
            const bookingFinder = await Booking.findById(args.bookingId).populate('event')

            if (!bookingFinder) {

                throw new Error('Booking was deleted!');
            }

            const event = eventFormater(bookingFinder.event)
            await Booking.deleteOne({
                _id: args.bookingId
            })

            return event
        } catch (err) {

            throw err
        }
    }
}