const router = require("express").Router();
const Code = require("../../core/applicationCore");
const CourseGroupCore = require("../../core/courseGroupCore");
//const AppCodeCore = require("../../core/appCodeCore");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");
const mailService = require("../../services/mailService");
const Application = require("../../core/applicationCore");

/// SIGN IN API ///
/* POST authanticate user. */
/* POST find application. */
router.post("/find", function (req, res, next) {
  if (req.body.application_id) {
    console.log(
      chalk.yellow("find public | application id: " + req.body.application_id)
    );
    Application.findPublicApplication(req.body.application_id)
      .then((application) => {
        console.log(chalk.green("Application found."));
        return res.status(202).json({
          status: 202,
          msg: "Application found.",
          application: application,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.APP101)));
        return res.status(400).json(errorCodes.APP101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

router.post("/findCourseGroup", function (req, res, next) {
  if (req.body.group_id) {
    console.log(chalk.yellow("find public | group id: " + req.body.group_id));
    CourseGroupCore.findCourseGroup(req.body.group_id)
      .then((courseGroup) => {
        console.log(chalk.green("Course Group found."));
        return res.status(202).json({
          status: 202,
          msg: "Course Group found.",
          courseGroup,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.CGROUP101)));
        return res.status(400).json(errorCodes.CGROUP101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

router.post("/findappcode", function (req, res, next) {
  if (req.body.name && req.body.group_id && req.body.type) {
    console.log(chalk.yellow("find public | group id: " + req.body.group_id));
    AppCodeCore.findCode(req.body.name, req.body.group_id, req.body.type)
      .then((code) => {
        console.log(chalk.green("Code found."));
        return res.status(202).json({
          status: 202,
          msg: "App Code found.",
          code,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.APPCODE101)));
        return res.status(400).json(errorCodes.APPCODE101);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/* POST create application */
// router.post("/create", function (req, res, next) {
//   if (req.body.name) {
//     console.log(chalk.yellow("create application | title: " + req.body.name));
//     courseGroupCore
//       .createCourseGroup(req.body)
//       .then((application) => {
//         console.log(chalk.green("Code created."));
//         return res.status(202).json({
//           status: 202,
//           msg: "Code created.",
//           application: application,
//         });
//       })
//       .catch((error) => {
//         console.log(chalk.green(error.errmsg));
//         return res.status(400).json({
//           status: 400,
//           code: error.code,
//           errmsg: error.errmsg,
//         });
//       });
//   } else {
//     return res.status(411).json({
//       status: 411,
//       desc: "length required",
//     });
//   }
// });

/* POST create applicationCode */
// router.post("/createCode", function (req, res, next) {
//   if (req.body.name) {
//     console.log(chalk.yellow("create codeCode | code name: " + req.body.name));
//     AppCodeCore.createCode(req.body)
//       .then((code) => {
//         console.log(chalk.green("Code created."));
//         return res.status(202).json({
//           status: 202,
//           msg: "Code created.",
//           code: code,
//         });
//       })
//       .catch((error) => {
//         console.log(chalk.green(error.errmsg));
//         return res.status(400).json({
//           status: 400,
//           code: error.code,
//           errmsg: error.errmsg,
//         });
//       });
//   } else {
//     return res.status(411).json({
//       status: 411,
//       desc: "length required",
//     });
//   }
// });

module.exports = router;
