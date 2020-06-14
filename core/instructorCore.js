const mongoose = require("mongoose");
const InstructorSchema = require("../models/instructorModel.js");
const errorCodes = require("../config/errorCodes.json");

//Create Instructor
InstructorSchema.statics.createInstructor = function (InstructorData) {
  return new Promise((resolve, reject) => {
    Instructor.create(InstructorData)
      .then((instructor) => {
        return resolve(instructor);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find Instructor with userId
InstructorSchema.statics.findInstructor = function (_id) {
  return new Promise((resolve, reject) => {
    Instructor.findOne({ _id }).exec(function (err, instructor) {
      if (err) return reject(err);
      if (!instructor) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(instructor);
    });
  });
};

var Instructor = mongoose.model("Instructor", InstructorSchema);
module.exports = Instructor;
