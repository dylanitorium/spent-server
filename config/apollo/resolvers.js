const { AuthenticationError } = require("apollo-server");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const moment = require("moment");
const reportError = require("spent/utils/reportError");

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
    }),
    categories: withAuth(async ({ plan }, obj, args, { dataSources }, info) => {
      const categories = dataSources.category.find().where({ plan: plan.id });
      await dataSources.categories.populate(categories, "budgets");
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        budgets: category.budgets.map(budget => ({
          id: budget.id,
          name: budget.name
        }))
      }));
    }),
    plan: withAuth(async ({ plan }, obj, args, { dataSources }, info) => {
      await dataSources.plan.populate(plan, "budgets");
      return plan.reduce(moment());
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
        reportError(error);
        return {
          success: false
        };
      }
    }),
    createCategory: withAuth(async ({ plan }, obj, args, { dataSources }) => {
      try {
        const category = await dataSources.category.create({
          ...args,
          plan: plan.id
        });

        return {
          success: true,
          category
        };
      } catch (error) {
        reportError(error);
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
