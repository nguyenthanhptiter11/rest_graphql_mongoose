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
            const bookings = await Booking.find();
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
                user: userById.bind(this, result.user),
                createdAt: DateHelpers.dateToISOString(result._doc.createdAt),
                updatedAt: DateHelpers.dateToISOString(result._doc.updatedAt)
            }
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = eventFormater(booking.event)
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