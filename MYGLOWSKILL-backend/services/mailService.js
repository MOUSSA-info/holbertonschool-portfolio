const nodemailer = require("nodemailer");
const config = require("../config");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  service: config.mailConfig.service,
  auth: {
    user: config.mailConfig.user,
    pass: config.mailConfig.pass,
  },
});

exports.sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: config.mailConfig.sender,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Email envoyé à ${to}`);
  } catch (error) {
    logger.error("Erreur d'envoi d'email:", error);
  }
};
