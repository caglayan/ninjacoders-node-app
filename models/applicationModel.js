const Schema = require("mongoose").Schema;

const CourseSpirit = new Schema(
  {
    thumbnail: String,
    name: String,
    duration: Number,
    students: Number,
    videos: Number,
    rating: Number,
    instructor: Object,
  },
  { timestamps: true }
);

const CourseGroupSchmea = new Schema(
  {
    name: String,
    courses: [CourseSpirit],
  },
  { timestamps: true }
);

const ApplicationSchema = new Schema(
  {
    courseGroups: [CourseGroupSchmea],
  },
  { timestamps: true }
);

module.exports = ApplicationSchema;
