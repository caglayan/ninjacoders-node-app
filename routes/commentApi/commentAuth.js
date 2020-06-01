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
              comment: comment,
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
      console.log(chalk.red(JSON.stringify(errorCodes.COMMENT101)));
      return res.status(400).json(errorCodes.COMMENT101);
    });
});

/* POST update comment */

router.post("/update", function (req, res, next) {
  if (req.body.comment && req.body.body && req.body.title && req.body.star) {
    console.log(chalk.yellow("update comment " + req.body.comment));
    Comment.findCommentOne(req.body.comment)
      .then((comment) => {
        if (comment.sender.toString() == req.user._id.toString()) {
          const commentData = {
            title: req.body.title,
            body: req.body.body,
            star: req.body.star,
          };
          Comment.updateComment(commentData, req.body.comment)
            .then((course) => {
              console.log(chalk.green("Comment updated."));
              return res.status(202).json({
                status: 202,
                msg: "Comment updated.",
                course: course,
              });
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.COMMENT103)));
              return res.status(400).json(errorCodes.COMMENT103);
            });
        } else {
          console.log(chalk.red(JSON.stringify(errorCodes.COMMENT104)));
          return res.status(400).json(errorCodes.COMMENT104);
        }
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.COMMENT101)));
        return res.status(400).json(errorCodes.COMMENT101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST remove comment */

router.post("/remove", function (req, res, next) {
  if (req.body.comment) {
    console.log(chalk.yellow("remove comment " + req.body.comment));
    Comment.findCommentOne(req.body.comment)
      .then((comment) => {
        if (comment.sender.toString() == req.user._id.toString()) {
          Comment.removeComment(req.body.comment)
            .then((response) => {
              console.log(chalk.green("Comment removed."));
              return res.status(202).json({
                status: 202,
                msg: "Comment removed.",
                response: response,
              });
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.COMMENT103)));
              return res.status(400).json(errorCodes.COMMENT103);
            });
        } else {
          console.log(chalk.red(JSON.stringify(errorCodes.COMMENT104)));
          return res.status(400).json(errorCodes.COMMENT104);
        }
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.COMMENT102)));
        return res.status(400).json(errorCodes.COMMENT102);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

module.exports = router;
