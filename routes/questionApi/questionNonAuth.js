const router = require("express").Router();
const Question = require("../../core/questionCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST find course. */
router.post("/pull", function (req, res, next) {
  if (req.body.limit && req.body.courseId) {
    console.log(
      chalk.yellow(
        "pull questions | limit: " + req.body.limit + "| skip: " + req.body.skip
      )
    );
    Question.pullQuestions(req.body.limit, req.body.skip, req.body.courseId)
      .then((questions) => {
        console.log(chalk.green("Questions are pulled."));
        return res.status(202).json({
          status: 202,
          msg: "Questions pulled.",
          questions: questions,
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

module.exports = router;
