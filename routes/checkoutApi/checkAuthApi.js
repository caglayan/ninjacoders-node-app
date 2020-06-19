const router = require("express").Router();
const chalk = require("chalk");
const sharp = require("sharp");
const fileUpload = require("express-fileupload");
const User = require("../../core/userCore");
const Course = require("../../core/courseCore");
const errorCodes = require("../../config/errorCodes.json");
const successCodes = require("../../config/successCodes.json");
const Iyzipay = require("iyzipay");

/// PAYMENT ///

router.post("/payment", function (req, res, next) {
  var iyzipay = new Iyzipay({
    apiKey: "Mx4Gq1BCDTa81YwuiYLo0xnYmay73gGK",
    secretKey: "288ZzZNcCa2SCl8OUVmH8iirFtK3CBtj",
    uri: "https://api.iyzipay.com",
  });

  var request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    price: "20",
    paidPrice: "24.0",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: "B67832",
    paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
    callbackUrl: "http://localhost:4000/api/checkout/unauth/payment-callback",
    enabledInstallments: [2, 3, 6, 9],
    buyer: {
      id: "BY789",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "74300864791",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    billingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    basketItems: [
      {
        id: "BI101",
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: "20.0",
      },
    ],
  };
  iyzipay.checkoutFormInitialize.create(request, function (err, result) {
    console.log(JSON.stringify(result));
    return res.status(202).json({
      status: 202,
      msg: "ok found.",

      result,
    });
  });
});

module.exports = router;
