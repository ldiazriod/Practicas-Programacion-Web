import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql`

type User {
    email: String!
    password: String!
    coche: Coche!
    viajes: [Viajes]!
}

type Viajes {
    conductor: User!
    cliente: User!
    coche: Coche!
}

type Coche {
    matricula: String!
    conductor: User!
    state: Boolean!
    viajes: [Viajes]!
}

type Query {
    getCars: [Coche]
}

type Mutation {
    sigUp(email: String!, licencia: String!, password: String!): Boolean!
    logIn(email: String!, password: String!): String!
    logOut: Boolean!
    newCar(matricula: String!): Boolean!
    changeStateOfCar: Boolean!
}
`

export {Schema}