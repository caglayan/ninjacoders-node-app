const router = require("express").Router();
const Course = require("../../core/courseCore");
const User = require("../../core/userCore");
const Instructor = require("../../core/instructorCore");
const Comment = require("../../core/commentCore");
const chalk = require("chalk");

/* POST find course. */
router.post("/find", function (req, res, next) {
  if (req.body.course_id && req.body.user_id) {
    console.log(
      chalk.yellow(
        "find  | course id: " +
          req.body.course_id +
          " user id: " +
          req.body.user_id
      )
    );
    User.findUserById(req.body.user_id)
      .then((user) => {
        console.log(chalk.green("User found for private course"));
        if (user.premium == true) {
          Course.findPrivateCourse(req.body.course_id)
            .then((course) => {
              console.log(chalk.green("Course found."));
              console.log(chalk.green("Course found."));
              Instructor.findInstructor(course.instructorId).then(
                (instructor) => {
                  course.instructor = instructor;
                  Comment.findCommentOne(course.commentId).then((comment) => {
                    course.bestComment = comment;
                    course.statistics.onlineStudents = Math.floor(
                      Math.random() * (40 - 10) + 10
                    );
                    return res.status(202).json({
                      status: 202,
                      msg: "Course found.",
                      course,
                    });
                  });
                }
              );
            })
            .catch((error) => {
              console.log(chalk.red(JSON.stringify(errorCodes.COURSE101)));
              return res.status(400).json(errorCodes.COURSE101);
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
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(successCodes.MAIL101)));
        return res.status(202).json(successCodes.MAIL101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST create course */
router.post("/create", function (req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).json({
      auth: false,
      message: "User is not admin.",
    });
  }
  if (req.body.title) {
    console.log(chalk.yellow("create course | title: " + req.body.title));
    Course.createCourse(req.body)
      .then((course) => {
        console.log(chalk.green("Course created."));
        return res.status(202).json({
          status: 202,
          msg: "Course created.",
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
