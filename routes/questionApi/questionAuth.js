const router = require("express").Router();
const Question = require("../../core/questionCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST create question */
router.post("/add", function (req, res, next) {
  console.log(req.body);
  if (req.body.course && req.body.title && req.body.body) {
    console.log(chalk.yellow("create question | title: " + req.body.body));
    const questionData = {
      course: req.body.course,
      title: req.body.title,
      body: req.body.body,
      sender: req.user._id,
      avatarImage: req.user.avatarImage,
      givenName: req.user.givenName,
      familyName: req.user.familyName,
    };

    Question.createQuestion(questionData)
      .then((question) => {
        console.log(chalk.green("Question created."));
        return res.status(202).json({
          status: 202,
          msg: "Question created.",
          course: question,
        });
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

/* POST find question */
router.post("/find", function (req, res, next) {
  console.log(chalk.yellow("find question | user: " + req.user.givenName));
  Question.findQuestion(req.user._id)
    .then((question) => {
      console.log(chalk.green("Question found."));
      return res.status(202).json({
        status: 202,
        msg: "Commment found.",
        question: question,
      });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(errorCodes.COMMENT102)));
      return res.status(400).json(errorCodes.COMMENT102);
    });
});

router.post("/removeQuestion", function (req, res, next) {
  if (req.body.questionId && req.body._id) {
    console.log(chalk.yellow("remove question " + req.body._id));
    Course.removeQuestion(req.body._id, req.body.questionId)
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

router.post("/updateQuestion", function (req, res, next) {
  if (req.body.question._id && req.body._id) {
    console.log(chalk.yellow("adding question " + req.body._id));
    Course.updateQuestion(req.body._id, req.body.question)
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
