const router = require("express").Router();
const Application = require("../../core/applicationCore");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");
const mailService = require("../../services/mailService");

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

/* POST create application */
// router.post("/create", function (req, res, next) {
//   if (req.body.title) {
//     console.log(chalk.yellow("create application | title: " + req.body.title));
//     Application.createApplication(req.body)
//       .then((application) => {
//         console.log(chalk.green("Application created."));
//         return res.status(202).json({
//           status: 202,
//           msg: "Application created.",
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

module.exports = router;
