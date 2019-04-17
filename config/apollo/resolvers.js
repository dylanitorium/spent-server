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
  Mutation: {
    createBudget: withAuth(async (user, obj, args, { dataSources }) => {
      try {
        const plan = await dataSources.plan.findOneAndUpdate(
          { owner: user },
          { owner: user },
          { upsert: true }
        );

        const budget = await dataSources.budget.create({
          ...args,
          plan: plan.id
        });

        return {
          success: true,
          budget
        };
      } catch (error) {
        return {
          success: false
        };
      }
    })
  },
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  BudgetFrequencyUnit: {
    SECONDS: "seconds",
    MINUTES: "minutes",
    HOURS: "hours",
    DAYS: "days",
    WEEKS: "weeks",
    MONTHS: "months",
    YEARS: "years"
  }
};
