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
          question: question,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
        return res.status(400).json(errorCodes.QUESTION102);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST find question */
router.post("/find", function (req, res, next) {
  console.log(chalk.yellow("find question | user: " + req.user.givenName));
  Question.findQuestions(req.user._id)
    .then((question) => {
      console.log(chalk.green("Question found."));
      return res.status(202).json({
        status: 202,
        msg: "Question found.",
        question: question,
      });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(errorCodes.QUESTION101)));
      return res.status(400).json(errorCodes.QUESTION101);
    });
});

/* POST update question */

router.post("/update", function (req, res, next) {
  if (req.body.question && req.body.body && req.body.title) {
    console.log(chalk.yellow("update question " + req.body.question));
    Question.findQuestionOne(req.body.question)
      .then((question) => {
        if (question.sender.toString() == req.user._id.toString()) {
          const questionData = { body: req.body.body, title: req.body.title };
          Question.updateQuestion(questionData, req.body.question)
            .then((course) => {
              console.log(chalk.green("Question updated."));
              return res.status(202).json({
                status: 202,
                msg: "Question updated.",
                course: course,
              });
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.QUESTION103)));
              return res.status(400).json(errorCodes.QUESTION103);
            });
        } else {
          console.log(chalk.red(JSON.stringify(errorCodes.QUESTION104)));
          return res.status(400).json(errorCodes.QUESTION104);
        }
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
        return res.status(400).json(errorCodes.QUESTION102);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST remove question */

router.post("/remove", function (req, res, next) {
  if (req.body.question) {
    console.log(chalk.yellow("update question " + req.body.question));
    Question.findQuestionOne(req.body.question)
      .then((question) => {
        if (question.sender.toString() == req.user._id.toString()) {
          Question.removeQuestion(req.body.question)
            .then((response) => {
              console.log(chalk.green("Question removed."));
              return res.status(202).json({
                status: 202,
                msg: "Question removed.",
                response: response,
              });
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.QUESTION103)));
              return res.status(400).json(errorCodes.QUESTION103);
            });
        } else {
          console.log(chalk.red(JSON.stringify(errorCodes.QUESTION104)));
          return res.status(400).json(errorCodes.QUESTION104);
        }
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
        return res.status(400).json(errorCodes.QUESTION102);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

module.exports = router;
