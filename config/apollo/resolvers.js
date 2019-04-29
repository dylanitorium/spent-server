const { AuthenticationError } = require("apollo-server");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

const withAuth = resolver => async (obj, args, context, info) => {
  try {
    const user = await context.user;
    const plan = await context.dataSources.plan.findOneAndUpdate(
      { owner: user },
      { owner: user },
      { upsert: true }
    );
    return resolver({ user, plan }, obj, args, context, info);
  } catch (error) {
    throw new AuthenticationError("You must be logged in to do this");
  }
};

module.exports = {
  Query: {
    budgets: withAuth(({ plan }, obj, args, { dataSources }, info) => {
      return dataSources.budget.find().where({ plan: plan.id });
    })
  },
  Mutation: {
    createBudget: withAuth(async ({ plan }, obj, args, { dataSources }) => {
      try {
        const budget = await dataSources.budget.create({
          ...args,
          plan: plan.id
        });

        return {
          success: true,
          budget
        };
      } catch (error) {
        console.error(error);
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
