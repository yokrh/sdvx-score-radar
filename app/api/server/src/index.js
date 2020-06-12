const { makeExecutableSchema } = require('graphql-tools')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const typeDefs = require('./schema/type-defs')
const resolvers = require('./schema/resolvers')
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
})

const server = new ApolloServer({ schema })

const app = express()
server.applyMiddleware({ app })
app.use(cors())

/**
 * Option method request handler. For cors.
 */
app.options('*', (req, res) => res.sendStatus(200))

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

console.log('process.env.ENV:', process.env.ENV)
console.log('process.env.IS_USE_LOCAL_TRACK_DATA:', process.env.IS_USE_LOCAL_TRACK_DATA, '\n')
