const Schema = require("mongoose").Schema;

const CodeSchema = new Schema(
  {
    codeType: {
      type: String,
      default: "Sale",
    },
    name: {
      type: String,
      required: true,
    },
    courseGroupId: String,
    sale: Number,
  },
  { timestamps: true }
);

module.exports = CodeSchema;
