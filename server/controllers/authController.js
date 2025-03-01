import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  REGISTER_COMPLETE_TEMPLATE,
} from "../config/emailTemplates.js";
import { handleError } from "../helpers/handleError.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please provide all fields." });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isAccountVerified) {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = bcryptjs.hashSync(password, 10);

        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.verifyOtp = newOtp;
        existingUser.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await existingUser.save();

        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Account Verification OTP",
          html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", newOtp)
            .replace("{{name}}", existingUser.name)
            .replace("{{email}}", email),
        };

        await transporter.sendMail(mailOptions);

        return res.json({
          success: true,
          message: "Please verify your email.",
        });
      }
      return res.json({ success: false, message: "User already exists." });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newRole = "user";
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: newRole,
      verifyOtp: newOtp,
      verifyOtpExpireAt: Date.now() + 10 * 60 * 1000,
    });

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", newOtp)
        .replace("{{name}}", user.name)
        .replace("{{email}}", email),
    };

    transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Please verify your email." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    const hashedPassword = user.password;
    const comparePassword = await bcryptjs.compare(password, hashedPassword);
    if (!comparePassword) {
      return next(handleError(404, "Invalid credentials."));
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      user: newUser,
      message: `Welcome ${user.name}..!`,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    let user;
    user = await User.findOne({ email });
    let message;

    if (!user) {
      const password = Math.round(Math.random() * 1000000000).toString();
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newRole = "user";
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar,
        role: newRole,
      });
      newUser.isAccountVerified = true;

      user = await newUser.save();
      message = `Welcome ${user.name}..!`;
    } else {
      message = `Welcome back ${user.name}..!`;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      user: newUser,
      message,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.json({ success: false, message: "Please provide a OTP." });
  }
  try {
    const user = await User.findOne({ verifyOtp: otp });
    if (!user) {
      return res.json({ success: false, message: "Invalid OTP." });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Registration Completed",
      html: REGISTER_COMPLETE_TEMPLATE.replace("{{name}}", user.name),
    };

    transporter.sendMail(mailOptions);

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    return res.json({
      success: true,
      user: newUser,
      message: `Welcome ${user.name}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Please provide an email." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User do not exist." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp)
        .replace("{{name}}", user.name)
        .replace("{{email}}", email),
    };

    transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Please provide all the fields.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP." });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
