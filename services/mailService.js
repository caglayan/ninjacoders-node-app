const nodeMailer = require("nodemailer");
const chalk = require("chalk");
var hbs = require("nodemailer-express-handlebars");

// TEST EMAIL
function sendMailTest(recipient, callback) {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    secureConnection: true,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(chalk.red(error));
    } else {
      console.log(chalk.green("Server is ready to take our messages"));
    }
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: "./services/mailTemplates",
        layoutsDir: "./services/mailTemplates",
      },
      viewPath: "./services/mailTemplates",
      extName: ".handlebars",
    })
  );

  let mailOptions = {
    from: "merhaba@ninjacoders.co",
    to: recipient,
    subject: "Reset Password",
    template: "premium",
    context: {
      name: "Çağlayan",
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(chalk.red(error));
      callback(error);
    }
    console.log(chalk.green("Mail is sent."));
    callback(null, info);
  });
}

// SEND RESET PASSWORD EMAIL
function sendMail(mailTemplate, mailSubject, user, callback) {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    secureConnection: true,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(chalk.red(error));
    } else {
      console.log(chalk.green("Server is ready to take our messages"));
    }
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: "./services/mailTemplates",
        layoutsDir: "./services/mailTemplates",
      },
      viewPath: "./services/mailTemplates",
      extName: ".handlebars",
    })
  );

  let mailOptions = {
    from: "merhaba@ninjacoders.co",
    to: user.email,
    subject: mailSubject,
    template: mailTemplate,
    context: {
      givenName: user.givenName,
      token: user.token,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(chalk.red(error));
      callback(error);
    }
    console.log(chalk.green("Succesfull: " + JSON.stringify(info)));
    callback(null, info);
  });
}

function sendNinjaTeamMail(
  mailTemplate,
  mailSubject,
  user,
  sendEmail,
  courseGroup,
  callback
) {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    secureConnection: true,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(chalk.red(error));
    } else {
      console.log(chalk.green("Server is ready to take our messages"));
    }
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: "./services/mailTemplates",
        layoutsDir: "./services/mailTemplates",
      },
      viewPath: "./services/mailTemplates",
      extName: ".handlebars",
    })
  );

  let mailOptions = {
    from: "merhaba@ninjacoders.co",
    to: "caglayanserbetci@gmail.com",
    subject: mailSubject,
    template: mailTemplate,
    context: {
      givenName: user.givenName,
      token: user.token,
      fullname: user.givenName + " " + user.familyName,
      _id: user._id,
      userEmail: user.email,
      user_id: user._id,
      sendEmail: sendEmail,
      courseGroupName: courseGroup.name,
      courseGroupId: courseGroup._id,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(chalk.red(error));
      callback(error);
    }
    console.log(chalk.green("Succesfull: " + JSON.stringify(info)));
    callback(null, info);
  });
}

module.exports = {
  sendMail,
  sendMailTest,
  sendNinjaTeamMail,
};
