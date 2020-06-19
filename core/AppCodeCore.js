const mongoose = require("mongoose");
const CodeSchema = require("../models/appCodeModel.js");
const Course = require("./courseCore");

//Create Code
CodeSchema.statics.createCode = function (CodeData) {
  return new Promise((resolve, reject) => {
    Code.create(CodeData)
      .then((code) => {
        return resolve(code);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find Code
CodeSchema.statics.findCode = function (name, courseGroupId, codeType) {
  return new Promise((resolve, reject) => {
    Code.findOne({
      name,
      courseGroupId,
      codeType,
    }).exec(function (err, code) {
      if (err) return reject(err);
      if (!code) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(code);
    });
  });
};

var Code = mongoose.model("Code", CodeSchema);
module.exports = Code;
