const nodemailer = require("nodemailer");

//To Send Email
const sendEmail = (options) => {
  var transport = nodemailer.createTransport({
    // host: "smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //   user: "392c2ef0eaa0f4",
    //   pass: "78ae18a96a80c8",
    //The ABOVE ORIGINAL CODES ARE COMMENTED AS THESE HAVE BEEN DEFINED IN .ENV FILE SO THEY ARE REPLACED BY:-
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    //THE FOLLOWING ARE MAIL OPTIONS WE HAVE SET.
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  transport.sendMail(mailOptions); //sendmail will send values in mailOptions(SAME AS ABOVE) i.e from, to , etc
  //SENDMAIL IS A NODEJS PRE-DEFINED FUNCTION
};
module.exports = sendEmail;
