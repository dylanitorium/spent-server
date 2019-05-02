const { createSchema, model } = require("spent/db/mongoose");
require("spent/db/models/Budget");

const categorySchema = createSchema(
  {
    name: String,
    plan: { type: String, ref: "Plan" }
  },
  {
    collection: "Categories"
  }
);

categorySchema.virtual("budgets", {
  ref: "Budgets",
  localField: "_id",
  foreignField: "category"
});

module.exports = model("Category", categorySchema);
