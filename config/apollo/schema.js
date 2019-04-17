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
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    budgets: [Budget]!
  }

  type Mutation {
    createBudget(
      name: String!
      yearlyAmount: Int!
      frequencyValue: Int!
      frequencyUnit: BudgetFrequencyUnit!
      startDate: DateTime!
    ): CreateBudgetResponse
  }

  type CreateBudgetResponse {
    success: Boolean!
    budget: Budget
  }
`;
