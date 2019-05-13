const { createSchema, model } = require("spent/db/mongoose");

const ruleSchema = createSchema({
  payee: String,
  reference: String,
  code: String,
  particulars: String,
  date: String,
  amount: Number
});

module.exports = model("Rule", ruleSchema);
