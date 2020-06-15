const router = require("express").Router();
const Course = require("../../core/courseCore");
const Instructor = require("../../core/instructorCore");
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");
var Iyzipay = require("iyzipay");

var iyzipay = new Iyzipay({
  apiKey: "sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI",
  secretKey: "sandbox-wbwpzKIiplZxI3hh5ALI4FJyAcZKL6kq",
  uri: "https://sandbox-api.iyzipay.com",
});

/* POST find course. */
router.post("/payment-callback", function (req, res, next) {
  console.log(req);
  console.log("token", req.headers);
  console.log("conversationId", req.conversationId);
  console.log("status", req.status);
  iyzipay.checkoutForm.retrieve(
    {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      token: "token",
    },
    function (err, result) {
      console.log(result);
      return res.redirect("http://localhost:3000/user/checkout/deneme");
    }
  );
});

router.get("/payment-callback", function (req, res, next) {
  return res.redirect("http://localhost:3000/user/checkout/deneme");
});

module.exports = router;