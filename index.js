require("module-alias/register");

const { ApolloServer } = require("apollo-server");
const typeDefs = require("spent/config/apollo/schema");
const resolvers = require("spent/config/apollo/resolvers");
const { getUserFromToken } = require("spent/api/auth");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {},
  context: async ({ req }) => {
    let token = null;
    let user = null;

    try {
      token = req.headers.authorization;
      user = await getUserFromToken(token);
    } catch (e) {
      // no token or no user
      console.warn(`Unable to authenticate using auth token: ${token}`);
    }

    return {
      token,
      user
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
