const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    me: User!
  }

  type Mutation {
    authenticateLocal(email: String, password: String): AuthenticationResult
    authenticateGoogle: AuthenticationResult
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthenticationResult {
    success: Boolean!
    error: String
    user: User
  }
`;
