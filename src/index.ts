import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
    type Query {
        "A simple type for getting started!"
        hello: String
    }
`

const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true // set main to playground
})

server.listen().then(({ url }) => {
  console.log(`Server ready ar ${url}`)
})
