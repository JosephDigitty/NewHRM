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
          <div style="max-width: 500px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; color: #1f2937;">
      <h2 style="font-size: 18px; font-weight: bold; color: #111827; margin-top: 0;">
        ${process.env.COMPANY_NAME} Staff Portal Access
      </h2>
      
      <p style="font-size: 14px; line-height: 1.5; color: #374151;">
        Hello <strong>${fullname}</strong>, here is your temporary password to log in to the <strong>${process.env.COMPANY_NAME}</strong> Staff Portal:
      </p>

      <div style="background-color: #f3f4f6; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin: 0; font-size: 13px; color: #4b5563;">
          <strong>Password:</strong> <code style="font-size: 14px; font-weight: bold; color: #2563eb; background-color: #ffffff; padding: 2px 6px; border-radius: 4px; border: 1px solid #d1d5db;">${password}</code>
        </p>
      </div>

      <div style="margin: 20px 0;">
        <a href="" style="background-color: #2563eb; color: #ffffff; padding: 10px 16px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
          Log In to Portal
        </a>
      </div>

      <p style="font-size: 12px; color: #dc2626; margin-bottom: 16px;">
        ⚠️ For security reasons, please update your password immediately after logging in.
      </p>

      <p style="font-size: 12px; color: #6b7280; margin: 0; border-top: 1px solid #e5e7eb; padding-top: 12px;">
        If you did not request this or need assistance, please contact HR.
      </p>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};