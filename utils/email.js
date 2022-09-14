const nodeMailer = require("nodemailer");
const email = async (options) => {
  const transport = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "8af9f50477e551",
      pass: "ca51e5efed5d64",
    },
  });

  const emailOptions = {
    from: "oyetunjiibukunoluwa@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(emailOptions);
};
module.exports = email;
