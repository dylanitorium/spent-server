const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date
  scalar DateTime

  enum BudgetFrequencyUnit {
    SECONDS
    MINUTES
    HOURS
    DAYS
    WEEKS
    MONTHS
    YEARS
  }

  type Budget {
    id: ID!
    name: String!
    yearlyAmount: Int!
    frequencyValue: Int!
    frequencyUnit: BudgetFrequencyUnit!
    startDate: DateTime
    income: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Category {
    id: ID!
    name: String
    budgets: [Category_Budget]
  }

  type Category_Budget {
    id: ID!
    name: String!
  }

  type Plan {
    yearlyPlannedIncome: Int
    yearlyPlannedExpenses: Int
    expectedExpensesToDate: Int
    expectedIncomeToDate: Int
  }

  type Query {
    budgets: [Budget]!
    categories: [Category]
    plan: Plan!
  }

  type Mutation {
    createBudget(
      name: String!
      yearlyAmount: Int!
      frequencyValue: Int!
      frequencyUnit: BudgetFrequencyUnit!
      startDate: Date!
      category: ID
      income: Boolean!
    ): CreateBudgetResponse
    createCategory(name: String!): CreateCategoryResponse
  }

  type CreateBudgetResponse {
    success: Boolean!
    budget: Budget
  }

  type CreateCategoryResponse {
    success: Boolean!
    category: Category
  }
`;
