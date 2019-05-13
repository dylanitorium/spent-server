require("module-alias/register");
require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const typeDefs = require("spent/config/apollo/schema");
const resolvers = require("spent/config/apollo/resolvers");
const { getUserFromToken } = require("spent/api/auth");
const { Budget, Plan, Category, ImportSchema } = require("spent/db/models");
const importers = require("spent/api/importers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    budget: Budget,
    plan: Plan,
    category: Category,
    importSchema: ImportSchema,
    importers
  }),
  context: ({ req }) => {
    let token = null;
    let user = null;

    token = req.headers.authorization;
    console.log(token);
    user = getUserFromToken(token);

    return {
      token,
      user
    };
  },
  uploads: {
    maxFileSize: 10000000,
    maxFiles: 20
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
