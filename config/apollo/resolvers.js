const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

module.exports = {
  Query: {},
  Date: GraphQLDate,
  DateTime: GraphQLDateTime
};
