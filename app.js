const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const app = express()

const Event = require('./models/event')
const User = require('./models/user')

app.use(bodyParser.json())

const events_ = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event.creator)
                }
            })
        })
        .catch(err => {
            throw err
        })
}

const user = userId => {
    return User.findById(userId)
        .then(result => {
            return {
                ...result._doc,
                _id: result.id,
                createdEvents: events_.bind(this, result._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err
        })
}

app.get('/', (req, res, next) => {
    res.send('hello world')
})

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!,
                title: String!
                description: String!
                price: Float!
                date: String!,
                creator: User!
            }

            type User {
                _id: ID!
                email: String!,
                password: String,
                createdEvents: [Event!]
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                .then(events => {
                    return events.map(event => {
                        console.log(eventMapped(event))
                        return {
                            ...event._doc,
                            _id: event.id,
                            creator: user.bind(this, event.creator)
                        }
                    })
                })
                .catch(err => {
                    console.log(err, 'kkkkkkkkkkkkkkkk')
                    throw err
                })
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: '5c337a9cea77d22706eb1a22'
                })
                let createdEvent;
                return event
                    .save()
                    .then(result => {
                        createdEvent = { ...result._doc, _id: result.id, creator: user.bind(this, result.creator)}
                        return User.findById('5c337a9cea77d22706eb1a22')
                    })
                    .then(user => {
                        if (user) {
                            user.createdEvents.push(event)
                            return user.save()
                        } else {
                            throw new Error('User is not exits.')
                        }
                    })
                    .then(result => {
                        return createdEvent
                    })
                    .catch(err => {
                        console.log(err)
                        throw err
                    })
            },
            createUser: (args) => {
                return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('User exits already.')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                        .then(hashedPassword => {
                            const user = new User({
                                email: args.userInput.email,
                                password: hashedPassword
                            })
                            return user.save()
                        })
                        .then(result => {
                            return { ...result._doc, password: null, _id: result.id }
                        })
                        .catch(err => {
                            throw err
                        })
                })
                

            }
        },
        graphiql: true
    }))

const eventMapped = (event) => {
    return {
        _id: event._id ? event.id.toString() : '___',
        title: event.title || '___',
        price: event.price || 0,
        date: event.date ? new Date(event.date).toISOString() : '___'
    }
}

const uri = 'mongodb://' + process.env.MONGODB_ATLAS_USER + ':' + process.env.MONGODB_ATLAS_PW +
    '@node-js-mongoose-shard-00-00-554zu.mongodb.net:27017,' +
    'node-js-mongoose-shard-00-01-554zu.mongodb.net:27017,' +
    'node-js-mongoose-shard-00-02-554zu.mongodb.net:27017/' + process.env.MONGODB_ATLAS_DB_NAME +
    '?ssl=true&replicaSet=node-js-mongoose-shard-0&authSource=admin&retryWrites=true'
mongoose.connect(uri,
    {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MONGOOSE CONNECT SUCESS')
        app.listen(3000)
    },
    err => {
        console.log('MONGOOSE CONNECT ERROR', err)
    })


