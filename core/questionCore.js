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
QuestionSchema.statics.findQuestions = function (user_id) {
  return new Promise((resolve, reject) => {
    Question.find({ sender: user_id }).exec(function (err, question) {
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

//Find Question with userId
QuestionSchema.statics.findQuestionOne = function (_id) {
  return new Promise((resolve, reject) => {
    Question.findOne({ _id }).exec(function (err, question) {
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

//Pull Questions
QuestionSchema.statics.pullUserQuestions = function (limit, skip, userId) {
  return new Promise((resolve, reject) => {
    Question.find({
      sender: userId,
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
  delete questionData.givenName;
  delete questionData.familyName;
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

/* -------------------ANSWER --------------------*/

//Create Question
QuestionSchema.statics.answerQuestion = function (question, answer) {
  return new Promise((resolve, reject) => {
    question.answers.push(answer);
    question
      .save()
      .then((question) => {
        resolve(question);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

QuestionSchema.statics.removeAnswer = function (question, answer_id, user_id) {
  return new Promise((resolve, reject) => {
    var answerChanged = false;
    question.answers = question.answers.filter((answer) => {
      if (answer.sender == user_id.toString()) {
        if (answer._id == answer_id) {
          answerChanged = true;
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    });
    if (answerChanged) {
      question
        .save()
        .then((question) => {
          resolve({ question, answerChanged });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve({ question, answerChanged });
    }
  });
};

QuestionSchema.statics.updateAnswer = function (
  question,
  answer_id,
  user_id,
  title,
  body
) {
  return new Promise((resolve, reject) => {
    var answerChanged = false;
    question.answers = question.answers.map((answer) => {
      if (answer.sender == user_id.toString()) {
        if (answer._id == answer_id) {
          answer.body = body;
          answer.title = title;
          answerChanged = true;
          return answer;
        } else {
          return answer;
        }
      } else {
        return answer;
      }
    });
    if (answerChanged) {
      question
        .save()
        .then((question) => {
          resolve({ question, answerChanged });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      resolve({ question, answerChanged });
    }
  });
};

var Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
