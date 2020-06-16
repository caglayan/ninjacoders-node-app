const Schema = require("mongoose").Schema;

const CourseGroupSchmea = new Schema(
  {
    name: String,
    buttonName: String,
    CM: Object,
    courses: [Object],
  },
  { timestamps: true }
);

module.exports = CourseGroupSchmea;
