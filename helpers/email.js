import nodemailer from "nodemailer";

export const sendRegisteredEmail = async (data) => {
  const { email, name, token } = data;
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODEMAIL_USER,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const info = await transport.sendMail({
    from: "'Taskman - Task manager' <accounts@taskman.com>",
    to: email,
    subject: "Taskman - Confirm your account",
    text: "Check your account on Taskman",
    html: `
    <p>Hello: ${name} ! Confirm your account on Taskman</p>
    <p>Your account is almost ready, confirm your account in this link:
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm account</a>
     </p>
     <p>If you didn't created this account, you can ignore this message</p>
    `,
  });
};
