const express = require("express");
const router = express.Router();
const userApi = require("./userApi/userApi");
const courseApi = require("./courseApi/courseApi");
const commentApi = require("./commentApi/commentApi");
const questionApi = require("./questionApi/questionApi");
const checkoutApi = require("./checkoutApi/checkoutApi");
const applicationApi = require("./applicationApi/applicationApi");

/* log all request for login page*/
router.all("/*", function (req, res, next) {
  console.log("Accessing to api");
  next(); // pass control to the next handler
});

router.use("/user", userApi);
router.use("/course", courseApi);
router.use("/comment", commentApi);
router.use("/question", questionApi);
router.use("/checkout", checkoutApi);
router.use("/app", applicationApi);

module.exports = router;
