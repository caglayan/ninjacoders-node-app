const Schema = require("mongoose").Schema;

const ApplicationSchema = new Schema(
  {
    courseGroups: [String],
  },
  { timestamps: true }
);

module.exports = ApplicationSchema;
