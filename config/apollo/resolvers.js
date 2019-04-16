const { AuthenticationError } = require("apollo-server");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

const withAuth = resolver => async (obj, args, context, info) => {
  try {
    const user = await context.user;
    return resolver(user, obj, args, context, info);
  } catch {
    throw new AuthenticationError("You must be logged in to do this");
  }
};

module.exports = {
  Query: {
    budgets: withAuth((user, obj, args, { dataSources }, info) => {
      return dataSources.budget.find().where({ user });
    })
  },
  Date: GraphQLDate,
  DateTime: GraphQLDateTime
};
