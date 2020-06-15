const router = require("express").Router();
const Course = require("../../core/courseCore");
const Instructor = require("../../core/instructorCore");
const Comment = require("../../core/commentCore");
const chalk = require("chalk");
const errorCodes = require("../../config/errorCodes.json");

/* POST find course. */
router.post("/payment-callback", function (req, res, next) {
  console.log(req);
  return res.status(202).json({
    status: 202,
    msg: "Payment callback.",
  });
});

module.exports = router;
