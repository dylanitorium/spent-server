const mongoose = require("mongoose");
const { schemaConfig } = require("spent/config/mongoose");

mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/spent", { useNewUrlParser: true });
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB Connection Error:")
);

module.exports = {
  model: mongoose.model,
  Schema: mongoose.Schema,
  createSchema: (fields, options) => {
    return new mongoose.Schema(fields, {
      ...schemaConfig,
      ...options
    });
  }
};
