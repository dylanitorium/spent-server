require("module-alias/register");
require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const typeDefs = require("spent/config/apollo/schema");
const resolvers = require("spent/config/apollo/resolvers");
const { getUserFromToken } = require("spent/api/auth");
const { Budget, Plan, Category } = require("spent/db/models");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    budget: Budget,
    plan: Plan
  }),
  context: ({ req }) => {
    let token = null;
    let user = null;

    token = req.headers.authorization;
    user = getUserFromToken(token);

    return {
      token,
      user
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
