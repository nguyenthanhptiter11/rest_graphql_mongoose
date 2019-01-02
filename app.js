const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const app = express()

const Event = require('./models/event')

app.use(bodyParser.json())

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
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                crateEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find().then(events => {
                    return events.map(event => {
                        console.log(eventMapped(event))
                        // return { ...event._doc, _id: event._doc.id }
                        return eventMapped(event)
                    })
                }).catch(err => {
                    throw err
                })
            },
            crateEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                })
                return event.save().then(result => {
                    console.log(result)
                    // not run return { ...result._doc, _id: result._doc.id }
                    return eventMapped(result)
                }).catch(err => {
                    console.log(err)
                    throw err
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


