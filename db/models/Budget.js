const { createSchema, model } = require("spent/db/mongoose");
const moment = require("moment");
require("spent/db/models/Plan");
// const GroupingRule = require("@db/models/GroupingRule");

const FREQUENCY_UNITS = {
  SECONDS: "seconds",
  MINUTES: "minutes",
  HOURS: "hours",
  DAYS: "days",
  WEEKS: "weeks",
  MONTHS: "months",
  YEARS: "years"
};

class Budget {
  get frequency() {
    const days = moment
      .duration(this.frequencyValue, this.frequencyUnit)
      .asDays();
    const perYear = Math.floor((moment().isLeapYear() ? 366 : 365) / days);

    return {
      days,
      perYear
    };
  }

  daysLapsed(date) {
    return (
      parseInt(date.format("DDD"), 10) -
      parseInt(moment(this.startDate).format("DDD"), 10)
    );
  }

  get frequencyAsDays() {
    return this.frequency.days;
  }

  get weeklyAmount() {
    return Math.floor(this.yearlyAmount / 52);
  }

  get monthlyAmount() {
    return Math.floor(this.yearlyAmount / 12);
  }

  dailyAmount(date) {
    return Math.floor(
      this.yearlyAmount / ((date || moment()).isLeapYear() ? 366 : 365)
    );
  }

  get frequencyAmount() {
    return Math.floor(this.yearlyAmount / this.frequency.perYear);
  }

  expectedTransactionsCountToDateUnrounded(date) {
    return 1 + this.daysLapsed(date) / this.frequencyAsDays;
  }

  expectedTransactionsCountToDate(date) {
    return Math.floor(this.expectedTransactionsCountToDateUnrounded(date));
  }

  expectedAmountToDate(date) {
    return this.expectedTransactionsCountToDate(date) * this.frequencyAmount;
  }

  nextTransactionDate(date) {
    const modulo = this.daysLapsed(date) % this.frequencyAsDays;
    const delta = this.frequencyAsDays - modulo;
    return date.add(delta, "days");
  }
}

const budgetSchema = createSchema(
  {
    name: String,
    startDate: Date,
    yearlyAmount: Number,
    frequencyValue: Number,
    frequencyUnit: {
      type: String,
      enum: Object.values(FREQUENCY_UNITS)
    },
    plan: { type: String, ref: "Plan" },
    income: Boolean
    // rules: [GroupingRule.schema]
  },
  {
    collection: "Budgets"
  }
);

budgetSchema.loadClass(Budget);

// budgetSchema.virtual("transactions", {
//   ref: "Transaction",
//   localField: "_id",
//   foreignField: "group"
// });

module.exports = model("Budget", budgetSchema);
