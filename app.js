const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.send('hello world')
})

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                crateEvent(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return ['Running', 'Coding'];
            },
            crateEvent: (args) => {
                const eventName = args.name
                return eventName
            }
        },
        graphiql: true
    }))

app.listen(3000)


