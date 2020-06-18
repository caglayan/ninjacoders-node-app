const mongoose = require("mongoose");
const CourseGroupSchema = require("../models/courseGroupModel.js");
const Course = require("./courseCore");

//Create CourseGroup
CourseGroupSchema.statics.createCourseGroup = function (CourseGroupData) {
  return new Promise((resolve, reject) => {
    CourseGroup.create(CourseGroupData)
      .then((courseGroup) => {
        return resolve(courseGroup);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find CourseGroup
CourseGroupSchema.statics.findCourseGroup = function (_id) {
  return new Promise((resolve, reject) => {
    CourseGroup.findOne({ _id }).exec(function (err, courseGroup) {
      if (err) return reject(err);
      if (!courseGroup) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(courseGroup);
      //   Course.findAtomicCourse(courseGroup._id)
      //     .then((courses) => {
      //       courseGroup.courses = courses;
      //       return resolve(courseGroup);
      //     })
      //     .catch((err) => {
      //       return reject(err);
      //     });
    });
  });
};

var CourseGroup = mongoose.model("CourseGroup", CourseGroupSchema);
module.exports = CourseGroup;
