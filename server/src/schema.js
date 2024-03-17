const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
      getUser(email: String! tokenId: String!): UserReponse!
      getPayment(memberNo: Int!): PaymentResponse!
      getToken(email: String!): TokenResponse!
    }
    type UserReponse {
      name: String!
      memberNo: Int!
    }
    type PaymentResponse {
      memberNo: Int!
      amount: Int!
    }
    type TokenResponse {
      token: String!
      expired: Int!
      email: String!
    }
`;
module.exports = typeDefs