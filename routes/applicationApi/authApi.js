const router = require("express").Router();
const chalk = require("chalk");
const sharp = require("sharp");
const fileUpload = require("express-fileupload");
const User = require("../../core/userCore");
const Course = require("../../core/courseCore");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");

module.exports = router;
