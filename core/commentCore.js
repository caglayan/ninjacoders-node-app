const mongoose = require("mongoose");
const CommentSchema = require("../models/commentModel.js");
const errorCodes = require("../config/errorCodes.json");

//Create Comment
CommentSchema.statics.createComment = function (CommentData) {
  return new Promise((resolve, reject) => {
    Comment.create(CommentData)
      .then((comment) => {
        return resolve(comment);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

//Find Comment with userId
CommentSchema.statics.findComment = function (user_id) {
  return new Promise((resolve, reject) => {
    Comment.findOne({ sender: user_id }).exec(function (err, comment) {
      if (err) return reject(err);
      if (!comment) {
        err = {
          code: 404,
          errmsg: "not found",
        };
        return reject(err);
      }
      return resolve(comment);
    });
  });
};

//Pull Comments
CommentSchema.statics.pullComments = function (limit, skip, courseId) {
  return new Promise((resolve, reject) => {
    Comment.find({
      course: courseId,
    })
      .sort("-updatedAt")
      .skip(skip)
      .limit(limit)
      .exec(function (err, comments) {
        if (err) return reject(err);
        return resolve(comments);
      });
  });
};

// Update Comment with only un protected fields
CommentSchema.statics.updateComment = function (commentData, commentId) {
  delete commentData.course;
  delete commentData.sender;
  return new Promise((resolve, reject) => {
    Comment.findByIdAndUpdate(commentId, commentData, {
      new: true,
    })
      .then((comment) => {
        if (!comment) {
          err = errorCodes.COMMENT101;
          console.log(chalk.red(JSON.stringify(err)));
          return reject(err);
        }
        resolve(comment);
      })
      .catch((err) => {
        console.log(chalk.red(JSON.stringify(err)));
        return reject(errorCodes.COMMENT103);
      });
  });
};

// Remove Comment
CommentSchema.statics.removeComment = function (_id) {
  return new Promise((resolve, reject) => {
    Comment.deleteOne(
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

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
