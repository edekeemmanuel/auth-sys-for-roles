require("dotenv").config();
const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_PORT, SECURE } = process.env;
const nodemailer = require("nodemailer");
const secure = SECURE === "false" ? false : true;
const PORT = parseInt(SMTP_PORT)

/** 
 * checking the type and converting from string value to a boolean value
 * this is to prevent error while sending email
 * console.log(typeof secure, secure)  //to test the result
 * console.log(typeof secure)
 * my solution to the error while sending email for local and live
 * */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: PORT,
  secure: secure,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

exports.sendEmail = (object) => {
  const mailOptions = {
    from: `"Fastbeetech" <${SMTP_EMAIL}>`, // sender address
    to: object.email, // recipient address// list of receivers
    subject: object.subject,
    html: `${object.body}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log({ message: "message not sent", error: err.message });
    } else {
      console.log({ message: "Email sent to ", messageID: info.messageId });
    }
  });
};