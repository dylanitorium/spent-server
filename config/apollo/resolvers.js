const { AuthenticationError } = require("apollo-server");
const getStream = require("get-stream");
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
      const categories = await dataSources.category
        .find()
        .where({ plan: plan.id });
      await dataSources.category.populate(categories, "budgets");
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        budgets: (category.budgets || []).map(budget => ({
          id: budget.id,
          name: budget.name
        }))
      }));
    }),
    importSchemas: withAuth(({ plan }, obj, args, { dataSources }, info) => {
      return dataSources.importSchema.find().where({ plan: plan.id });
    }),
    plan: withAuth(async ({ plan }, obj, args, { dataSources }, info) => {
      await dataSources.plan.populate(plan, "budgets");
      return plan.reduce(moment());
    })
  },
  Mutation: {
    createBudget: withAuth(async ({ plan }, obj, args, { dataSources }) => {
      const { category, createCategory, ...budgetArgs } = args;

      try {
        if (createCategory) {
          const categoryDoc = await dataSources.category.create({
            name: category
          });
          budgetArgs["category"] = categoryDoc.id;
        }

        const budget = await dataSources.budget.create({
          ...budgetArgs,
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
    }),
    createImportSchema: withAuth(
      async ({ plan }, obj, args, { dataSources }) => {
        try {
          await dataSources.importSchema.create({ ...args, plan: plan.id });

          return {
            success: true
          };
        } catch (error) {
          reportError(error);
          return {
            success: false
          };
        }
      }
    ),
    importBudgets: withAuth(
      async ({ plan }, obj, { file }, { dataSources }) => {
        try {
          const { createReadStream } = await file;
          const contents = await getStream(createReadStream());
          const json = JSON.parse(contents);

          return dataSources.importers.budgets(json, plan);
        } catch (e) {
          reportError(e);
          return {
            success: false
          };
        }
      }
    )
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
