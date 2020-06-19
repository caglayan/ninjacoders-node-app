const mongoose = require("mongoose");
const ApplicationSchema = require("../models/applicationModel.js");
const Course = require("./courseCore");

//Create Application
ApplicationSchema.statics.createApplication = function (ApplicationData) {
  return new Promise((resolve, reject) => {
    Application.create(ApplicationData)
      .then((application) => {
        return resolve(application);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find Application
ApplicationSchema.statics.findPublicApplication = function (_id) {
  console.log(_id);
  return new Promise((resolve, reject) => {
    Application.findOne({ _id }).exec(function (err, application) {
      if (err) return reject(err);
      if (!application) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }

      return resolve(application);
    });
  });
};

var Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
