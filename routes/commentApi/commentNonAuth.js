const router = require("express").Router();
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST find course. */
router.post("/pull", function (req, res, next) {
  if (req.body.limit && req.body.courseId) {
    console.log(
      chalk.yellow(
        "pull comments | limit: " + req.body.limit + "| skip: " + req.body.skip
      )
    );
    Comment.pullComments(req.body.limit, req.body.skip, req.body.courseId)
      .then((comments) => {
        console.log(chalk.green("Comments are pulled."));
        return res.status(202).json({
          status: 202,
          msg: "Comments pulled.",
          comments: comments,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.COMMENT103)));
        return res.status(400).json(errorCodes.COMMENT103);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

module.exports = router;
