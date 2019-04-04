const moment = require("moment");
const defaultTransform = value => value;

const BNZ_SCHEMA = {
  date: "Date",
  amount: "Amount",
  payee: "Payee",
  particulars: "Particulars",
  code: "Code",
  reference: "Reference"
};

const BNZ_SCHEMA_TRANSFORMS = {
  date: value => moment(value, "DD/MM/YY").format("YYYY-MM-DD"),
  amount: value => parseInt(value * 100),
  payee: defaultTransform,
  particulars: defaultTransform,
  code: defaultTransform,
  reference: defaultTransform
};

module.exports = {
  BNZ: {
    SCHEMA: BNZ_SCHEMA,
    TRANSFORMS: BNZ_SCHEMA_TRANSFORMS
  }
};
