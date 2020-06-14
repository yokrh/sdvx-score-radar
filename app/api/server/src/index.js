const { makeExecutableSchema } = require('graphql-tools')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')

// Graphql
const typeDefs = require('./schema/type-defs')
const resolvers = require('./schema/resolvers')
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
})
const server = new ApolloServer({ schema })

// Express
const app = express()
server.applyMiddleware({
  app,
  cors: {  // Apollo server's default is 'true'
    origin: [  // Apollo server's default is '*', which is based on express cors's default (https://github.com/expressjs/cors)
      process.env.FRONTEND_APP_DOMAIN_DEV,
      process.env.FRONTEND_APP_DOMAIN_PRD,
    ]
  },
})

/**
 * Option method request handler. For cors.
 * It seems unnecessary, thanks to ApolloServer.
 */
// app.options('*', (req, res) => res.sendStatus(200))

const port = process.env.ENV === process.env.ENV_DEV ? process.env.PORT_DEV : process.env.PORT_PRD
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)

console.log('process.env.ENV:', process.env.ENV)
