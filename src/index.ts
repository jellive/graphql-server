import { ApolloServer, gql } from 'apollo-server'
import {readFileSync} from 'fs'
import {join} from 'path'
/**
 * typeDef(s)
 * - GraphQL Schema를 정의하는 곳
 * Object, Query, Mutation, Input이 있다.
 * gql과 Tagged Template Literals로 작성한다.
 */
const typeDefs = gql`
    type Query {
        "A simple type for getting started!"
        hello: String
        books: [Book]
    }
    type Book {
        bookId: Int
        title: String
        message: String
        author: String
        url: String
    }
` // graphQL에서 쓰는 스키마를 정의함. 어떤식으로 요청할건지....여기서 hello 라는 string을 정의한다.

/**
 * resolver(s)
 * - Schema에 해당하는 구현을 하는 곳
 * 요청을 받아 데이터를 조회, 수정, 삭제함
 */

const resolvers = {
  Query: {
    hello: () => 'world',
    books: () => 
        JSON.parse(readFileSync(join(__dirname, 'books.json')).toString())
    
  }
} // 스키마에 해당하는 구현체를 적음

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true // set main to playground
})

server.listen().then(({ url }) => {
  console.log(`Server ready ar ${url}`)
})
