const router = require("express").Router();
const chalk = require("chalk");
const sharp = require("sharp");
const fileUpload = require("express-fileupload");
const User = require("../../core/userCore");
const Course = require("../../core/courseCore");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");
const Iyzipay = require("iyzipay");
const AppCodeCore = require("../../core/appCodeCore");
const CourseGroupCore = require("../../core/courseGroupCore");

/// PAYMENT ///

//https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/callback3ds/success/2

// https://api.iyzipay.com/payment/iyzipos/checkoutform/callback3ds/failure/86

var iyzipay = new Iyzipay({
  apiKey:
    process.env.IYZIPAY_APIKEY || "sandbox-4rDk6qMPf77F2RJxpBgOf7vQG47C6KHQ",
  secretKey:
    process.env.IYZIPAY_SECRETKEY || "sandbox-p19OiUuwV1068yzweYrcw6an1f8f5pIF",
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

router.post("/payment", function (req, res, next) {
  console.log(req.body);
  if (req.body.group_id) {
    console.log(chalk.yellow("find public | group id: " + req.body.group_id));
    CourseGroupCore.findCourseGroup(req.body.group_id)
      .then((courseGroup) => {
        console.log(chalk.green("Course Group found."));
        courseGroup = courseGroup.toObject();
        if (req.body.code_name) {
          console.log("code name", req.body.code_name);
          payWithCode(res, courseGroup, req.body.code_name, req.user);
        } else {
          payWithoutCode(res, courseGroup, req.user);
        }
      })
      .catch((error) => {
        console.log(chalk.red(JSON.stringify(errorCodes.CGROUP101)));
        return res.status(400).json(errorCodes.CGROUP101);
      });
  }
});

const payWithCode = (res, courseGroup, codeName, user) => {
  AppCodeCore.findCode(codeName, courseGroup._id, "sale")
    .then((code) => {
      console.log(chalk.green("Code found."));
      code = code.toObject();
      var paidPrice =
        courseGroup.price.base - courseGroup.price.base * code.sale;

      var request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: user._id.toString(),
        price: courseGroup.price.base.toString(),
        paidPrice: paidPrice.toString(),
        currency: Iyzipay.CURRENCY.TRY,
        basketId: "NINJABASKET",
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl:
          process.env.SERVER_URI +
          "/api/checkout/unauth/payment-callback?user_id=" +
          user._id.toString(),
        enabledInstallments: [1],
        buyer: {
          id: user._id.toString(),
          name: user.givenName.toString(),
          surname: user.familyName.toString(),
          //gsmNumber: "+905350000000",
          email: user.email.toString(),
          identityNumber: "123123123",
          lastLoginDate: "2015-10-05 12:43:35",
          registrationDate: "2013-04-21 15:12:09",
          registrationAddress: "Boğaziçi Üniversitesi",
          ip: "85.34.78.112",
          city: "Istanbul",
          country: "Turkey",
          zipCode: "34340",
        },

        billingAddress: {
          contactName:
            user.givenName.toString() + " " + user.familyName.toString(),
          city: "Istanbul",
          country: "Turkey",
          address: "Boğaziçi Üniversitesi",
          zipCode: "34340",
        },
        basketItems: [
          {
            id: courseGroup._id.toString(),
            name: courseGroup.name,
            category1: "Course Group",
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
            price: courseGroup.price.base.toString(),
          },
        ],
      };
      iyzipay.checkoutFormInitialize.create(request, function (err, result) {
        console.log(result);
        return res.status(202).json({
          status: 202,
          msg: "ok found.",
          result,
        });
      });
    })
    .catch((error) => {
      console.log(chalk.red(JSON.stringify(errorCodes.APPCODE101)));
      return res.status(400).json(errorCodes.APPCODE101);
    });
};

const payWithoutCode = (res, courseGroup, user) => {
  var paidPrice;
  console.log(courseGroup.price);
  if (courseGroup.price.isSale) {
    paidPrice =
      courseGroup.price.base - courseGroup.price.base * courseGroup.price.sale;
  } else {
    paidPrice = courseGroup.price.base;
  }
  //console.log(user);
  var request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: user._id.toString(),
    price: courseGroup.price.base.toString(),
    paidPrice: paidPrice.toString(),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: "NINJABASKET",
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl:
      process.env.SERVER_URI +
      "/api/checkout/unauth/payment-callback?user_id=" +
      user._id.toString(),
    enabledInstallments: [1],
    buyer: {
      id: user._id.toString(),
      name: user.givenName.toString(),
      surname: user.familyName.toString(),
      //gsmNumber: "+905350000000",
      email: user.email.toString(),
      identityNumber: "123123123",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      registrationAddress: "Boğaziçi Üniversitesi",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34340",
    },

    billingAddress: {
      contactName: user.givenName.toString() + " " + user.familyName.toString(),
      city: "Istanbul",
      country: "Turkey",
      address: "Boğaziçi Üniversitesi",
      zipCode: "34340",
    },
    basketItems: [
      {
        id: courseGroup._id.toString(),
        name: courseGroup.name,
        category1: "Course Group",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: courseGroup.price.base.toString(),
      },
    ],
  };
  iyzipay.checkoutFormInitialize.create(request, function (err, result) {
    //console.log(result);
    return res.status(202).json({
      status: 202,
      msg: "ok found.",
      result,
    });
  });
};

module.exports = router;
