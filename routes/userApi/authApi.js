const router = require("express").Router();
const chalk = require("chalk");
const sharp = require("sharp");
const fileUpload = require("express-fileupload");
const User = require("../../core/userCore");
const Course = require("../../core/courseCore");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");

/// UPDATE USER ///
/* POST update user */
router.post("/update", function (req, res, next) {
  console.log(
    chalk.yellow("update user | id: " + req.user._id + " body: " + req.body)
  );
  User.updateUser(req.body, req.user._id)
    .then((user) => {
      console.log(chalk.green(successCodes.USER101.Success));
      return res.status(202).json({
        ...successCodes.USER101,
        user: user,
      });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(errorCodes.USER100)));
      return res.status(400).json(errorCodes.USER100);
    });
});

/// UPDATE USER PREMIUM///
/* POST update user */
router.post("/updatepremium", function (req, res, next) {
  const premiumData = {
    _id: req.body._id,
    premium: req.body.premium,
  };
  if (req.body.premium) {
    console.log(
      chalk.yellow("update user | id: " + req.user._id + " body: " + req.body)
    );
    User.updateUser(premiumData, req.user._id)
      .then((user) => {
        console.log(chalk.green(successCodes.USER101.Success));
        return res.status(202).json({
          ...successCodes.USER101,
          user: user,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.USER100)));
        return res.status(400).json(errorCodes.USER100);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/// UPDATE WATCHED VIDEO///
/* POST update user */
router.post("/finish-video", function (req, res, next) {
  if (req.body.video_id && req.body.course_id) {
    console.log(
      chalk.yellow(
        "finished video | id: " +
          req.body.video_id +
          " course: " +
          req.body.course_id
      )
    );
    Course.findById(req.body.course_id)
      .then((course) => {
        console.log(chalk.green("Course found."));
        var isExist = false;
        req.user.registeredCourses = req.user.registeredCourses.map(
          (registeredCourse) => {
            if (registeredCourse._id.toString() === req.body.course_id) {
              isExist = true;
              if (!registeredCourse.wathedVideos.includes(req.body.video_id)) {
                console.log("registeredCourse.wathedVideos");
                registeredCourse.wathedVideos.push(req.body.video_id);
              }
            }
            return registeredCourse;
          }
        );
        if (!isExist) {
          const percentage = 1 / course.numberOfSections;
          console.log(course);
          console.log(course.rating);
          const registeredCourse = {
            _id: req.body.course_id,
            thumbnail: course.thumbnail,
            wathedVideos: [req.body.video_id],
            name: course.title,
            instructor: course.instructor,
            duration: course.duration,
            students: course.studentNumber,
            videos: course.numberOfSections,
            rating: course.rating,
            percentage,
          };
          req.user.registeredCourses.push(registeredCourse);
        }
        req.user
          .save()
          .then((user) => {
            if (!user) {
              error = errorCodes.USER101;
              console.log(chalk.red(JSON.stringify(error)));
            }
            console.log(chalk.green("User new video added."));
            return res.status(202).json({
              status: 202,
              msg: "User updated.",
              user: user,
            });
          })
          .catch((error) => {
            console.log(error);
            error = errorCodes.USER101;
            console.log(chalk.red(JSON.stringify(error)));
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

/// UPDATE USER PASSWORD ///
/* POST update user password */
router.post("/updatepassword", function (req, res, next) {
  if (req.body.password) {
    console.log(
      chalk.yellow(
        "update user | id: " + req.user._id + " password: " + req.body.password
      )
    );
    User.updateUserPassword(req.body.password, req.user)
      .then((user) => {
        console.log(chalk.green("User updated."));
        return res.status(202).json({
          status: 202,
          msg: "User updated.",
          user: user,
        });
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(error)));
        return res.status(400).json(error);
      });
  } else {
    console.log(chalk.red(JSON.stringify(errorCodes.SERVER101)));
    return res.status(400).json(errorCodes.SERVER101);
  }
});

/// REMOVE USER ///
/* POST remove user */
router.post("/remove", function (req, res, next) {
  console.log(chalk.yellow("remove user | id: " + req.user._id));
  User.removeUser(req.user._id)
    .then((opt) => {
      console.log(chalk.green(opt.deletedCount + " user removed."));
      if (opt.deletedCount == 0) {
        error = errorCodes.USER101;
        console.log(chalk.red(JSON.stringify(error)));
        return res.status(400).json(error);
      } else {
        return res.status(202).json({
          status: 202,
          msg: "User removed.",
        });
      }
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(error)));
      return res.status(400).json(error);
    });
});

/// UPDATE PROFILE IMAGE ///
/* POST profile image */

// MIDDLEWARE //
router.use(
  fileUpload({
    uriDecodeFileNames: true,
    limits: {
      fileSize: 750 * 1024,
      safeFileNames: /\\/g,
      preserveExtension: true,
    }, // 1mb
  })
);

//https://picsum.photos/id/1026/500/300
router.post("/uploadimage", function (req, res) {
  console.log(chalk.yellow("add image to user | email: " + req.user.email));
  if (!req.files) {
    error = errorCodes.USER105;
    console.log(chalk.red(JSON.stringify(error)));
    return res.status(400).json(error);
  }
  var image = req.files.image;
  sharp(image.data)
    .resize(200, 200)
    .toBuffer()
    .then((data) => {
      const avatarImage = {
        name: image.name,
        size: image.size,
        mimeType: image.mimetype,
        md5: image.md5,
        encoding: image.encoding,
        dataUri: `data:image/png;base64,${data.toString("base64")}`,
      };
      req.user.avatarImage = avatarImage;
      req.user
        .save()
        .then((user) => {
          if (!user) {
            error = errorCodes.USER101;
            console.log(chalk.red(JSON.stringify(error)));
          }
          console.log(chalk.green("User image added."));
          return res.status(202).json({
            status: 202,
            msg: "User created.",
            user: user,
          });
        })
        .catch((error) => {
          error = errorCodes.USER101;
          console.log(chalk.red(JSON.stringify(error)));
        });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(error)));
      return res.status(400).json(errorCodes.USER103);
    });
});

module.exports = router;
