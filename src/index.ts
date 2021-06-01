import { ApolloServer, gql } from 'apollo-server'
import {readFileSync, writeFileSync} from 'fs'
import {join} from 'path'

interface Book {
    bookId: number
    title: string
    message: string
    author: string
    url: string
}

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
        book(bookId: Int): Book
    }
    type Mutation {
        addBook(title: String, message: String, author: String, url: String): Book
        editBook(bookId: Int, title: String, message: String, author: String, url: String): Book
        deleteBook(bookId: Int): Book
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
        JSON.parse(readFileSync(join(__dirname, 'books.json')).toString()),
        book:(parent:any, args:any, context:any, info:any) => {
           const books = JSON.parse(readFileSync(join(__dirname, 'books.json')).toString())
           return books.find((book:any) => book.bookId === args.bookId) 
        } 
    
  }, 
  Mutation: {
    /**
     * 
        mutation{
        addBook(title:"t", message: "m", author: "a", url: "u") {
            bookId
            title
            message
            author
            url
        }
        }
    */
    addBook: (parent: any, args: any, context: any, info: any) => {
        const books: Book[] = JSON.parse(readFileSync(join(__dirname, 'books.json')).toString())
        const maxId = Math.max(...books.map(book => book.bookId))
        const newBook = {
            ...args,
            bookId: maxId + 1, 
        }
        writeFileSync(join(__dirname, 'books.json'), JSON.stringify([...books, newBook]))
        return newBook
    },
    /**
     * 
            mutation{
            editBook(bookId: 2, title:"t2", message: "m2", author: "a2", url: "u2"){
                bookId
                title
                message
                author
                    url
            }
            }
     */
    editBook: (parent: any, args: any, context: any, info: any) => {
        const books: Book[] = JSON.parse(readFileSync(join(__dirname, 'books.json')).toString())
        // const book = books.find(book => book.bookId === args.bookId)
        // if (book === undefined) 
        //     resolvers.Mutation.addBook(parent, args, context, info)
        // else {
        //     books[books.indexOf(book)] = {
        //         ...args,
        //         bookId: book.bookId
        //     }
        //     writeFileSync(join(__dirname, 'books.json'), JSON.stringify([...books]))
        //     return book
        // }
        const newBooks = books.map((book) => 
            book.bookId === args.bookId ? args : book
        )

        writeFileSync(join(__dirname, 'books.json'), JSON.stringify([...newBooks]))
        return args
    },
    deleteBook: (parent: any, args: any, context: any, info: any) => {
        const books: Book[] = JSON.parse(readFileSync(join(__dirname, 'books.json')).toString())
       
        const deleted = books.find((book) => 
            book.bookId === args.bookId
        )
        const newBooks = books.filter((book) => 
            book.bookId !== args.bookId
        )

        writeFileSync(join(__dirname, 'books.json'), JSON.stringify([...newBooks]))
        return deleted
    }
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
