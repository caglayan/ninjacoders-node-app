const router = require("express").Router();
const Course = require("../../core/courseCore");
const Instructor = require("../../core/instructorCore");
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST find course. */
router.post("/find", function (req, res, next) {
  if (req.body.course_id) {
    console.log(chalk.yellow("find public | course id: " + req.body.course_id));
    Course.findPublicCourse(req.body.course_id)
      .then((course) => {
        console.log(chalk.green("Course found."));
        Instructor.findInstructor(course.instructorId).then((instructor) => {
          course.instructor = instructor;
          Comment.findCommentOne(course.commentId).then((comment) => {
            course.bestComment = comment;
            return res.status(202).json({
              status: 202,
              msg: "Course found.",
              course,
            });
          });
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.COURSE101)));
        return res.status(400).json(errorCodes.COURSE101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

module.exports = router;
