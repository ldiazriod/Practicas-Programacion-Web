import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql `
    type User{
        email: String!
        password: String!
        rol: [String]!
    }

    input InputUser{
        email: String!
        password: String!
        rol: [String]!
    }

    type Blog{
        tittle: String!
        body: String!
        author: String!
        comments: [Comment] 
    }

    input InputBlog{
        tittle: String!
        body: String!
    }

    type Comment {
        body: String!
        author: String!
    }

    input InputComment {
        body: String!
    }

    type Query {
        getPost: [Blog]!
    }

    type Mutation {
        logIn(email: String!, password: String!): String!
        logOut: Boolean!
        createUser(input: InputUser!): Boolean!
        deleteUser(email: String!): Boolean!
        createPost(input: InputBlog!): Boolean!
        deletePost(tittle: String!): Boolean!
        createComment(tittle: String!, input: InputComment!): Boolean!
    }
`
export {Schema}