const router = require("express").Router();
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST create comment */
router.post("/add", function (req, res, next) {
  if (req.body.course && req.body.title && req.body.course && req.body.star) {
    console.log(chalk.yellow("create comment | title: " + req.body.title));

    Comment.findComment(req.user._id)
      .then((comment) => {
        console.log(chalk.green("Comment found."));
        console.log(chalk.red(JSON.stringify(errorCodes.COMMENT104)));
        return res.status(400).json(errorCodes.COMMENT104);
      })
      .catch((error) => {
        const commentData = {
          course: req.body.course,
          title: req.body.title,
          body: req.body.body,
          sender: req.user._id,
          avatarImage: req.user.avatarImage,
          givenName: req.user.givenName,
          familyName: req.user.familyName,
          star: req.body.star,
        };

        Comment.createComment(commentData)
          .then((comment) => {
            console.log(chalk.green("Comment created."));
            return res.status(202).json({
              status: 202,
              msg: "Comment created.",
              course: comment,
            });
          })
          .catch((error) => {
            console.log(chalk.red(JSON.stringify(errorCodes.COMMENT102)));
            return res.status(400).json(errorCodes.COMMENT102);
          });
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST find comment */
router.post("/find", function (req, res, next) {
  console.log(chalk.yellow("find comment | user: " + req.user.givenName));
  Comment.findComment(req.user._id)
    .then((comment) => {
      console.log(chalk.green("Comment found."));
      return res.status(202).json({
        status: 202,
        msg: "Commment found.",
        comment: comment,
      });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(errorCodes.COMMENT102)));
      return res.status(400).json(errorCodes.COMMENT102);
    });
});

router.post("/removeComment", function (req, res, next) {
  if (req.body.commentId && req.body._id) {
    console.log(chalk.yellow("remove comment " + req.body._id));
    Course.removeComment(req.body._id, req.body.commentId)
      .then((course) => {
        console.log(chalk.green("Course updated."));
        return res.status(202).json({
          status: 202,
          msg: "Commment removed.",
          course: course,
        });
      })
      .catch((error) => {
        console.log(chalk.green(error.errmsg));
        return res.status(400).json({
          status: 400,
          code: error.code,
          errmsg: error.errmsg,
        });
      });
  } else {
    return res.status(411).json({
      status: 411,
      desc: "length required",
    });
  }
});

router.post("/updateComment", function (req, res, next) {
  if (req.body.comment._id && req.body._id) {
    console.log(chalk.yellow("adding comment " + req.body._id));
    Course.updateComment(req.body._id, req.body.comment)
      .then((course) => {
        console.log(chalk.green("Course updated."));
        return res.status(202).json({
          status: 202,
          msg: "Course updated.",
          course: course,
        });
      })
      .catch((error) => {
        console.log(chalk.green(error.errmsg));
        return res.status(400).json({
          status: 400,
          code: error.code,
          errmsg: error.errmsg,
        });
      });
  } else {
    return res.status(411).json({
      status: 411,
      desc: "length required",
    });
  }
});

module.exports = router;
