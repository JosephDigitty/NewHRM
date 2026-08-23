import nodemailer from "nodemailer";



const getTransporter = () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendWelcomeEmail = async ({ to, fullname, email, password }) => {
    const transporter = getTransporter()
  const mailOptions = {
    from: `"${process.env.COMPANY_NAME} HR" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to ${process.env.COMPANY_NAME}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome aboard, ${fullname}! 🎉</h2>
        <p>Your employee account has been created. Here are your login details:</p>
        <table style="border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Temporary Password:</td>
            <td style="padding: 8px;"><code>${password}</code></td>
          </tr>
        </table>
        <p style="color: #b91c1c;">
          For security, please log in and change this password as soon as possible.
        </p>
        <p>If you have any questions, reach out to HR.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};