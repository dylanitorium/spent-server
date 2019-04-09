const mongoose = require("mongoose");
const { schemaConfig } = require("spent/config/mongoose");

const host = ["mongodb://", process.env.DB_LOCATION].join();

mongoose.set("useFindAndModify", false);
mongoose.connect(host, { useNewUrlParser: true });
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
