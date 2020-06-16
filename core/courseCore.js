const mongoose = require("mongoose");
const CourseSchema = require("../models/courseModel.js");
const Instructor = require("./instructorCore");

//Create Course
CourseSchema.statics.createCourse = function (CourseData) {
  return new Promise((resolve, reject) => {
    Course.create(CourseData)
      .then((course) => {
        return resolve(course);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find atomic course
CourseSchema.statics.findAtomicCourse = function (group_id) {
  return new Promise((resolve, reject) => {
    Course.find({
      group_id,
    }).exec(function (err, courses) {
      if (err) return reject(err);
      if (!courses) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      courses = courses.map((course) => {
        course = course.toObject();
        delete course.chapters;
        delete course.premium;
        return course;
      });
      //console.log(courses);
      return resolve(courses);
    });
  });
};

//Find Course
CourseSchema.statics.findPublicCourse = function (_id) {
  return new Promise((resolve, reject) => {
    Course.findOne({ _id }).exec(function (err, course) {
      if (err) return reject(err);
      if (!course) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      course.chapters.map((chapters) => {
        chapters.sections.map((section) => {
          if (!section.isPublic) {
            section.video = "";
          }
        });
      });
      return resolve(course);
    });
  });
};

//Find Private Course
CourseSchema.statics.findPrivateCourse = function (_id) {
  return new Promise((resolve, reject) => {
    Course.findOne({ _id }).exec(function (err, course) {
      if (err) return reject(err);
      if (!course) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(course);
    });
  });
};

//Add Comment
CourseSchema.statics.addComment = function (courseId, comment, userId) {
  return new Promise((resolve, reject) => {
    Course.findOne({ _id: courseId }).exec(function (err, course) {
      if (err) return reject(err);
      if (!course) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      if (course.comments.filter((comment) => comment.sender == userId)) {
        err = {
          code: 404,
          errmsg: "comment already found",
        };
        return reject(err);
      } else {
        course.comments.push(comment);
      }

      course
        .save()
        .then((course) => {
          resolve(course);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

//Remove Comment
CourseSchema.statics.removeComment = function (courseId, commentId) {
  return new Promise((resolve, reject) => {
    Course.findOne({ _id: courseId }).exec(function (err, course) {
      if (err) return reject(err);
      if (!course) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      course.comments = course.comments.filter(
        (comment) => comment._id != commentId
      );
      course
        .save()
        .then((course) => {
          resolve(course);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

//Update Comment
CourseSchema.statics.updateComment = function (courseId, comment) {
  return new Promise((resolve, reject) => {
    Course.findOne({ _id: courseId }).exec(function (err, course) {
      if (err) return reject(err);
      if (!course) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      course.comments = course.comments.filter((com) => com._id != comment._id);
      course.comments.push(comment);
      course
        .save()
        .then((course) => {
          resolve(course);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

var Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
