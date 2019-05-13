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
    income: Boolean!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Category_Budget {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
    budgets: [Category_Budget]
  }

  type Plan {
    yearlyPlannedIncome: Int
    yearlyPlannedExpenses: Int
    expectedExpensesToDate: Int
    expectedIncomeToDate: Int
  }

  type ImportSchema {
    id: ID!
    label: String
    payee: String
    reference: String
    code: String
    particulars: String
    date: String
    amount: String
  }

  type Query {
    budgets: [Budget]!
    categories: [Category]!
    plan: Plan!
    importSchemas: [ImportSchema]!
  }

  type Mutation {
    createBudget(
      name: String!
      yearlyAmount: Int!
      frequencyValue: Int!
      frequencyUnit: BudgetFrequencyUnit!
      startDate: Date!
      category: String
      createCategory: Boolean
      income: Boolean!
    ): CreateBudgetResponse
    createCategory(name: String!): CreateCategoryResponse
    importBudgets(file: Upload!): ImportBudgetsResponse
    createImportSchema(
      label: String
      payee: String
      reference: String
      code: String
      particulars: String
      date: String
      amount: String
    ): CreateImportSchemaResponse
  }

  type ImportBudgetsResponse {
    success: Boolean!
  }

  type CreateImportSchemaResponse {
    success: Boolean!
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
