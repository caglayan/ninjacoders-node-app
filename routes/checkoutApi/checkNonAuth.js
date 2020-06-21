const router = require("express").Router();
const Course = require("../../core/courseCore");
const Instructor = require("../../core/instructorCore");
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");
var Iyzipay = require("iyzipay");
const User = require("../../core/userCore");
const CourseGroupCore = require("../../core/courseGroupCore");
const mailService = require("../../services/mailService");

/* POST find course. */
router.post("/payment-callback", function (req, res, next) {
  if (req.body.token) {
    var iyzipay = new Iyzipay({
      apiKey: process.env.IYZIPAY_APIKEY,
      secretKey: process.env.IYZIPAY_SECRETKEY,
      uri: process.env.IYZIPAY_URI,
    });

    iyzipay.checkoutForm.retrieve(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: req.query.user_id,
        token: req.body.token,
      },
      function (err, result) {
        //console.log(result);
        //console.log(err);
        if (result.status === "failure") {
          return res.redirect(
            process.env.WEB_URI +
              "/user/checkout?courseGroup=" +
              result.itemTransactions[0].itemId +
              "&error=" +
              result.errorCode +
              ": " +
              result.errorMessage
          );
        } else {
          User.findUserById(result.conversationId)
            .then((user) => {
              console.log(chalk.green("User found"));
              const premiumCourseGroup = {
                courseGroup_id: result.itemTransactions[0].itemId,
                paymentTransactionId: result.paymentId,
                paidPrice: result.paidPrice,
              };
              console.log(result.itemTransactions[0].itemId);
              CourseGroupCore.findCourseGroup(
                result.itemTransactions[0].itemId
              ).then((courseGroup) => {
                console.log(chalk.green("Course Group found."));
                courseGroup.students.push(user._id);
                console.log(courseGroup);
                courseGroup.save().then(() => {
                  console.log(chalk.green("Course Group updated."));

                  user.premiumCourseGroups.push(premiumCourseGroup);
                  user.save().then((user) => {
                    if (!user) {
                      return res.redirect(
                        process.env.WEB_URI +
                          "/user/checkout?courseGroup=" +
                          result.itemTransactions[0].itemId +
                          "&error=" +
                          "NinjaCoders Error" +
                          ": " +
                          "Kullanıcı bulunamadı."
                      );
                    }
                    console.log(chalk.green("Successfull Payment"));
                    mailService.sendMail(
                      "premium",
                      "🔥Tebrikler! NinjaCoders'tan sertifikalı bir ders satın aldınız.",
                      user,
                      (error, info) => {
                        if (error) {
                          error = errorCodes.MAIL101;
                          console.log(chalk.red(JSON.stringify(error)));
                        } else {
                          //error = errorCodes.MAIL101;
                          //console.log(chalk.red(JSON.stringify(error)));
                        }
                      }
                    );
                    return res.redirect(
                      process.env.WEB_URI +
                        "/user/success?courseGroup=" +
                        result.itemTransactions[0].itemId
                    );
                  });
                });
              });
            })
            .catch((err) => {
              console.log(chalk.green(err));
              return res.redirect(
                process.env.WEB_URI +
                  "/user/success?courseGroup=" +
                  result.itemTransactions[0].itemId +
                  "&error=" +
                  "NinjaCoders Error" +
                  ": " +
                  "NinjaCoders tarafında bir hata oluştu."
              );
            });
        }
      }
    );
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

router.get("/payment-callback", function (req, res, next) {
  return res.redirect(process.env.WEB_URI + "/user/checkout/deneme");
});

module.exports = router;
