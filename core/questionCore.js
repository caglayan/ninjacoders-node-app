const mongoose = require("mongoose");
const QuestionSchema = require("../models/questionModel.js");
const errorCodes = require("../config/errorCodes.json");

//Create Question
QuestionSchema.statics.createQuestion = function (QuestionData) {
  return new Promise((resolve, reject) => {
    Question.create(QuestionData)
      .then((question) => {
        return resolve(question);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find Question with userId
QuestionSchema.statics.findQuestion = function (user_id) {
  return new Promise((resolve, reject) => {
    Question.findOne({ sender: user_id }).exec(function (err, question) {
      if (err) return reject(err);
      if (!question) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(question);
    });
  });
};

//Pull Questions
QuestionSchema.statics.pullQuestions = function (limit, skip, courseId) {
  return new Promise((resolve, reject) => {
    Question.find({
      course: courseId,
    })
      .sort("-updatedAt")
      .skip(skip)
      .limit(limit)
      .exec(function (err, questions) {
        if (err) return reject(err);
        return resolve(questions);
      });
  });
};

// Update Question with only un protected fields
QuestionSchema.statics.updateQuestion = function (questionData, questionId) {
  delete questionData.course;
  delete questionData.sender;
  return new Promise((resolve, reject) => {
    Question.findByIdAndUpdate(questionId, questionData, {
      new: true,
    })
      .then((question) => {
        if (!question) {
          err = errorCodes.COMMENT101;
          console.log(chalk.red(JSON.stringify(err)));
          return reject(err);
        }
        resolve(question);
      })
      .catch((err) => {
        console.log(chalk.red(JSON.stringify(err)));
        return reject(errorCodes.COMMENT103);
      });
  });
};

// Remove Question
QuestionSchema.statics.removeQuestion = function (_id) {
  return new Promise((resolve, reject) => {
    Question.deleteOne(
      {
        _id,
      },
      function (err, opt) {
        if (err) {
          console.log(chalk.red(JSON.stringify(err)));
          return reject(errorCodes.COMMEN103);
        }
        resolve(opt);
      }
    );
  });
};

var Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
