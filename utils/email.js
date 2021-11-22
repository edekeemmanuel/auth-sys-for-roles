const nodemailer = require('nodemailer');
require('dotenv').config();
const {email_user, email_pass} = process.env;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: email_user,
        pass: email_pass
    },
    tls: {
      rejectUnauthorized: false
    }
});

exports.sendEmail = object => {

const mailOptions = {
  from: 'edekeemmanuel55@email.com', // sender address
  to:object.email , // list of receivers
  subject: object.subject, // Subject line
  html: `${object.body}`// plain text body
};


transporter.sendMail(mailOptions, (err, info) => {
   if(err)
     console.log(err.message);
   else
     console.log('Email sent to', info.messageId);
}); 
};
