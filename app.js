const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./grapql/schema')
const graphQlResolvers = require('./grapql/resolvers')
const isAuth = require('./middleware/auth')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.get('/', (req, res, next) => {
    res.send({tsu: 'hello world'})
})

app.use(isAuth)

app.use('/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    }))

const uri = 'mongodb://' + process.env.MONGODB_ATLAS_USER + ':' + process.env.MONGODB_ATLAS_PW +
    '@node-js-mongoose-shard-00-00-554zu.mongodb.net:27017,' +
    'node-js-mongoose-shard-00-01-554zu.mongodb.net:27017,' +
    'node-js-mongoose-shard-00-02-554zu.mongodb.net:27017/' + process.env.MONGODB_ATLAS_DB_NAME +
    '?ssl=true&replicaSet=node-js-mongoose-shard-0&authSource=admin&retryWrites=true'
const port = process.env.LOCAL_PORT
    mongoose.connect(uri,
    {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MONGOOSE CONNECT SUCESS: ' + port)
        app.listen(port  || 3000)
    },
    err => {
        console.log('MONGOOSE CONNECT ERROR', err)
    })


