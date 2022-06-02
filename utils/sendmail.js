const nodemailer = require("nodemailer");

const sendmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "externaluser.tws@gmail.com",
        pass: "exterTWSnal%%$$23",
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
    throw new Error("email");
  }
};
module.exports = { sendmail };
