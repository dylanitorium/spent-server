require("module-alias/register");

const { ApolloServer } = require("apollo-server");
const typeDefs = require("spent/config/apollo/schema");
const resolvers = require("spent/config/apollo/resolvers");
const { getUserFromToken } = require("spent/api/auth");

const server = ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {},
  context: async ({ req }) => {
    let token = null;
    let user = null;

    try {
      token = req.headers.authorization;
      user = getUserFromToken(token);
    } catch (e) {
      // no token or no user
      console.warn(`Unable to authenticate using auth token: ${token}`);
    }

    return {
      token,
      // accessed by then or await
      user
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
