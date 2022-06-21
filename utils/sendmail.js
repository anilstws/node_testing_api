const nodemailer = require("nodemailer");

const sendmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      // tls: {
      //   rejectUnauthorized: true,
      //   minVersion: "TLSv1.2",
      // servername: "example.com"
      // },
      service: "gmail",
      auth: {
        user: process.env.email_name,
        pass: process.env.email_pass,
      },
    });
    const body = {
      from: "externaluser.tws@gmail.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(body);
  } catch (error) {
    throw error;
  }
};
module.exports = { sendmail };
