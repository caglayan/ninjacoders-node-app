const router = require("express").Router();
const Course = require("../../core/courseCore");
const User = require("../../core/userCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST find course. */
router.post("/find", function (req, res, next) {
  if (req.body.course_id) {
    console.log(
      chalk.yellow(
        "find  | course id: " +
          req.body.course_id +
          " user id: " +
          req.body.user_id
      )
    );
    if (req.body.user_id) {
      User.findUserById(req.body.user_id)
        .then((user) => {
          console.log(chalk.green("User found for private course"));
          Course.findPrivateCourse(req.body.course_id)
            .then((course) => {
              console.log(chalk.green("Course found."));
              return res.status(202).json({
                status: 202,
                msg: "Course found.",
                course: course,
              });
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.COURSE101)));
              return res.status(400).json(errorCodes.COURSE101);
            });
        })
        .catch((error) => {
          console.log(chalk.red(JSON.stringify(successCodes.MAIL101)));
          return res.status(202).json(successCodes.MAIL101);
        });
    } else {
      Course.findPublicCourse(req.body.course_id)
        .then((course) => {
          console.log(chalk.green("Course found."));
          return res.status(202).json({
            status: 202,
            msg: "Course found.",
            course: course,
          });
        })
        .catch((error) => {
          console.log(chalk.red(JSON.stringify(errorCodes.COURSE101)));
          return res.status(400).json(errorCodes.COURSE101);
        });
    }
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

module.exports = router;
