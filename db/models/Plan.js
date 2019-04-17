const { createSchema, model } = require("spent/db/mongoose");
require("spent/db/models/Budget");

const planSchema = createSchema(
  {
    owner: String
  },
  {
    collection: "Plans"
  }
);

planSchema.virtual("budgets", {
  ref: "Budget",
  localField: "_id",
  foreignField: "plan"
});

module.exports = model("Plan", planSchema);
