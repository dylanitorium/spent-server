const { createSchema, model } = require("spent/db/mongoose");
require("spent/db/models/Budget");

const importSchemaSchema = createSchema(
  {
    label: String,
    payee: String,
    reference: String,
    code: String,
    particulars: String,
    date: String,
    amount: String
  },
  {
    collection: "ImportSchemas"
  }
);

module.exports = model("ImportSchema", importSchemaSchema);
