const { createSchema, model } = require("spent/db/mongoose");
require("spent/db/models/Budget");

const filter = require("lodash/filter");
const sumBy = require("lodash/sumBy");

class Plan {
  get populatedBudgets() {
    return this.budgets || [];
  }

  get incomeBudgets() {
    if (!this._incomeBudgets) {
      this._incomeBudgets = filter(this.populatedBudgets, { income: true });
    }

    return this._incomeBudgets;
  }

  get expenseBudgets() {
    if (!this._expenseBudgets) {
      this._expenseBudgets = filter(this.populatedBudgets, { income: false });
    }

    return this._expenseBudgets;
  }

  get yearlyPlannedIncome() {
    if (!this._yearlyPlannedIncome) {
      this._yearlyPlannedIncome = sumBy(this.incomeBudgets, "yearlyAmount");
    }

    return this._yearlyPlannedIncome;
  }

  get yearlyPlannedExpenses() {
    if (!this._yearlyPlannedExpenses) {
      this._yearlyPlannedExpenses = sumBy(this.expenseBudgets, "yearlyAmount");
    }

    return this._yearlyPlannedExpenses;
  }

  expectedExpensesToDate(date) {
    if (!this._expectedExpensesToDate) {
      this._expectedExpensesToDate = this.expenseBudgets.reduce(
        (total, budget) => total + budget.expectedAmountToDate(date),
        0
      );
    }

    return this._expectedExpensesToDate;
  }

  expectedIncomeToDate(date) {
    if (!this._expectedIncomeToDate) {
      this._expectedIncomeToDate = this.incomeBudgets.reduce(
        (total, budget) => total + budget.expectedAmountToDate(date),
        0
      );
    }

    return this._expectedIncomeToDate;
  }

  reduce(date) {
    return {
      yearlyPlannedIncome: this.yearlyPlannedIncome,
      yearlyPlannedExpenses: this.yearlyPlannedExpenses,
      expectedExpensesToDate: this.expectedExpensesToDate(date),
      expectedIncomeToDate: this.expectedIncomeToDate(date)
    };
  }
}

const planSchema = createSchema(
  {
    owner: String
  },
  {
    collection: "Plans"
  }
);

planSchema.loadClass(Plan);

planSchema.virtual("budgets", {
  ref: "Budget",
  localField: "_id",
  foreignField: "plan"
});

module.exports = model("Plan", planSchema);
