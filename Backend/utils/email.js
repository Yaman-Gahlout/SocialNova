const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"SocialNova" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verification Code for Password Reset",

    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color:#6C5CE7;">SocialNova Password Reset</h2>
    
    <p>Hello,</p>
    
    <p>We received a request to reset your SocialNova account password. 
    Please use the verification code below to continue:</p>
    
    <h1 style="letter-spacing:4px; color:#00D4FF;">${otp}</h1>
    
    <p>This code is valid for <b>10 minutes</b>. Do not share this code with anyone.</p>
    
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    
    <br/>
    <p style="color:#888;">— Team SocialNova</p>
  </div>
`,
  });
};

module.exports = sendEmail;
