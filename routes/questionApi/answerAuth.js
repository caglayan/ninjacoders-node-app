const router = require("express").Router();
const Question = require("../../core/questionCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST create answer */
router.post("/add", function (req, res, next) {
  if (req.body.question && req.body.title && req.body.body) {
    console.log(chalk.yellow("Answer question | title: " + req.body.body));
    Question.findQuestionOne(req.body.question)
      .then((question) => {
        console.log(chalk.green("Question found."));
        const answerData = {
          sender: req.user._id,
          givenName: req.user.givenName,
          familyName: req.user.familyName,
          title: req.body.title,
          body: req.body.body,
        };
        Question.answerQuestion(question, answerData)
          .then((question) => {
            console.log(chalk.green("Answer added."));
            return res.status(202).json({
              status: 202,
              msg: "Answer added.",
              question: question,
            });
          })
          .catch((error) => {
            console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
            return res.status(400).json(errorCodes.QUESTION102);
          });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION101)));
        return res.status(400).json(errorCodes.QUESTION101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST remove answer */

router.post("/remove", function (req, res, next) {
  if (req.body.question && req.body.answer) {
    console.log(chalk.yellow("remove answer " + req.body.answer));
    Question.findQuestionOne(req.body.question)
      .then((question) => {
        console.log(chalk.green("Question found."));
        Question.removeAnswer(question, req.body.answer, req.user._id)
          .then((fullfill) => {
            question = fullfill.question;
            isAnswerChanged = fullfill.answerChanged;
            if (isAnswerChanged) {
              console.log(chalk.green("Answer removed."));
              return res.status(202).json({
                status: 202,
                msg: "Answer removed.",
                question: question,
              });
            } else {
              console.log(chalk.red("Answer not found."));
              console.log(chalk.red(JSON.stringify(errorCodes.ANSWER101)));
              return res.status(400).json(errorCodes.ANSWER101);
            }
          })
          .catch((error) => {
            console.log(error);
            console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
            return res.status(400).json(errorCodes.QUESTION102);
          });
      })
      .catch((error) => {
        console.log(error);
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION101)));
        return res.status(400).json(errorCodes.QUESTION101);
      });
  } else {
    return res.status(411).json({
      status: 411,
      desc: "length required",
    });
  }
});

/* POST update answer */

router.post("/update", function (req, res, next) {
  if (req.body.question && req.body.answer && req.body.title && req.body.body) {
    console.log(chalk.yellow("update answer " + req.body.answer));
    Question.findQuestionOne(req.body.question)
      .then((question) => {
        console.log(chalk.green("Question found."));
        Question.updateAnswer(
          question,
          req.body.answer,
          req.user._id,
          req.body.title,
          req.body.body
        )
          .then((fullfill) => {
            question = fullfill.question;
            isAnswerChanged = fullfill.answerChanged;
            if (isAnswerChanged) {
              console.log(chalk.green("Answer updated."));
              return res.status(202).json({
                status: 202,
                msg: "Answer updated.",
                question: question,
              });
            } else {
              console.log(chalk.red("Answer not found."));
              console.log(chalk.red(JSON.stringify(errorCodes.ANSWER101)));
              return res.status(400).json(errorCodes.ANSWER101);
            }
          })
          .catch((error) => {
            console.log(error);
            console.log(chalk.red(JSON.stringify(errorCodes.QUESTION102)));
            return res.status(400).json(errorCodes.QUESTION102);
          });
      })
      .catch((error) => {
        console.log(error);
        console.log(chalk.red(JSON.stringify(errorCodes.QUESTION101)));
        return res.status(400).json(errorCodes.QUESTION101);
      });
  } else {
    return res.status(411).json({
      status: 411,
      desc: "length required",
    });
  }
});

module.exports = router;
