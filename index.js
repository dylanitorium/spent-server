require("module-alias/register");

const { ApolloServer } = require("apollo-server");
const typeDefs = require("spent/config/apollo/schema");
const resolvers = require("spent/config/apollo/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {},
  context: ({ req }) => {
    let authToken = null;
    let currentUser = null;

    // Do something here using the authToken to retrieve the currently logged in user

    return {
      authToken,
      currentUser
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
