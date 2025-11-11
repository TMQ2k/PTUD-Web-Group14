// src/service/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ví dụ: no.reply.yourapp@gmail.com
        pass: process.env.EMAIL_PASS, // App Password (NOT Gmail password)
      },
    });

    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Mã OTP xác thực tài khoản",
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
    });

    console.log("✅ Đã gửi OTP tới:", to);
    console.log("📩 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Lỗi khi gửi OTP:", err);
    throw new Error("Không thể gửi email OTP");
  }
};
