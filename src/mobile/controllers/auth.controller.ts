import db from "../../db/models";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as admin from "firebase-admin";
import Logger from "../../logger";
import { Op } from "sequelize";
import catchAsync from "../utils/catchAsync";
import { generateOTP } from "../../utils/encryption";
import loadEmailTemplate from "../../utils/loadEmailTemplate";
import sendEmail from "../../utils/sendEmail";
import { validateUser } from "../middlewares/auth.middleware";

const fromEmail = "noreply@autocllan.com";
/**
 * @route POST /auth/register
 */
const registerUser = catchAsync(async (req, res) => {
  const { name, phone, idNumber, email, password } = req.body;
  let user = await db.users.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });
  if (user) {
    let message = "User already exists";
    if (user.email === email) {
      message += " with this email";
    }
    if (user.phone === phone) {
      message +=
        user.email === email
          ? " and mobile number"
          : " with this mobile number";
    }
    return res.status(401).send({
      status: 403,
      success: false,
      message,
      error: "UserExists",
    });
  }
  const transaction = await db.sequelize.transaction();
  const salt = await bcrypt.genSalt(10);
  const otp = generateOTP();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const wallet = await db.wallets.create({}, { transaction });

    user = await db.users.create(
      {
        name,
        phone,
        walletId: wallet.id,
        idNumber,
        email,
        password: hashedPassword,
        otp,
      },
      { transaction }
    );
    const welcome = await loadEmailTemplate("welcome-new-user", {
      name: name,
      otp: otp,
    });
    await sendEmail({
      to: email,
      from: fromEmail,
      subject: "Welcome to Quick Ship - Verify your email",
      html: welcome,
    });
    await transaction.commit();
  } catch (error) {
    console.log(error);
    Logger.error(error);
    await transaction.rollback();
    return res.status(500).send({
      status: 500,
      success: false,
      message: "An error occurred while registering user",
    });
  }
  const secretKey: string = process.env.SECRET_KEY || "";
  const auth_token = sign(
    {
      id: user.id,
      signInMethod: user.signInMethod,
      email: user.email,
      role: "user",
    },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN || "21d" }
  );
  res.send({
    status: 200,
    success: true,
    auth_token,
    user: user,
    otp: user.otp,
  });
});

/**
 * @route POST /auth/login
 */
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({
    where: { email },
  });
  if (!user) {
    return res.status(401).send({
      status: 401,
      success: false,
      message: "User do not exist",
      error: "UserDoesNotExist",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send({
      status: 401,
      success: false,
      message: "Wrong password",
      error: "WrongPassword",
    });
  }
  const secretKey: string = process.env.SECRET_KEY || "";
  const auth_token = sign(
    {
      id: user.id,
      signInMethod: user.signInMethod,
      email: user.email,
      role: user.role,
    },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN || "21d" }
  );
  res.send({
    status: 200,
    success: true,
    auth_token,
    user: user,
  });
});

/**
 * @route POST /auth/send-email-otp
 */
const sendEmailOtp = catchAsync(async (req: any, res) => {
  const { id } = req.user;
  let user = await validateUser(id);
  const otp = generateOTP();
  const transaction = await db.sequelize.transaction();
  try {
    user.otp = otp;
    user.singInMethodVerified = false;
    await user.save({ transaction });
    await transaction.commit();
    const html = await loadEmailTemplate("email-verify", {
      name: user.name,
      otp: otp,
    });
    await sendEmail({
      to: user.email,
      from: fromEmail,
      subject: "Account Verification OTP",
      html: html,
    });
    return res.status(200).send({
      success: true,
      message: "Account verification OTP send successfully",
      data: {
        email: user.email,
        otp: otp,
      },
    });
  } catch (error: any) {
    Logger.error(error);
    transaction.rollback();
    return res.status(500).send({
      status: 500,
      success: false,
      message: "There was an error processing your request",
      error: "Error " + error.message,
    });
  }
});

/**
 * @route POST /auth/verify-email
 */
const verifyEmail = catchAsync(async (req: any, res) => {
  const { id } = req.user;
  let user = await validateUser(id);
  const { otp } = req.body;
  if (user.otp !== otp) {
    return res.status(400).send({
      status: 400,
      success: false,
      message: "Invalid OTP",
      error: "InvalidOTP",
    });
  }
  const transaction = await db.sequelize.transaction();

  try {
    user.signInMethodVerified = true;
    user.otp = null;
    await user.save({ transaction });
    await transaction.commit();

    res.status(200).send({
      status: 200,
      success: true,
      user: user,
      message: "Email verified successfully",
    });
  } catch (error) {
    Logger.error(error);
    await transaction.rollback();
    return res.status(500).send({
      status: 500,
      success: false,
      message: "Failed to verify email",
      error: "EmailVerificationError",
    });
  }
});
/**
 * @route POST /auth/firebase-login
 */
const loginWithFirebase = catchAsync(async (req, res) => {
  const { idToken, user } = req.body;
  const userData = user;
  let _user;
  try {
    const data = await admin.auth().verifyIdToken(idToken);
    const { email, phone_number } = data;
    let where: any = {};
    if (email) {
      where.email = email;
    }
    if (phone_number) {
      where.phone = phone_number;
    }
    _user = await db.users.findOne({
      where: where,
    });

    if (!_user) {
      _user = await db.users.create({
        ...userData,
      });
      await db.wallets.create({
        userId: _user.id,
      });
    }

    if (_user.isBlocked) {
      return res.status(403).send({
        status: 403,
        success: false,
        message: "User is blocked",
        error: "User is blocked",
      });
    }
    // update user verification status
    _user.signInMethodVerified = true;
    await _user.save();
    const secretKey: string = process.env.SECRET_KEY || "";
    const auth_token = sign(
      {
        id: _user.id,
        email: _user.email,
        role: _user.role,
        signInMethod: _user.signInMethod,
      },
      secretKey,
      { expiresIn: process.env.JWT_EXPIRES_IN || "21d" }
    );
    res.send({
      status: 200,
      message: "User logged in successfully",
      success: true,
      auth_token,
      user: _user,
    });
  } catch (error: any) {
    Logger.error(error.message);
    res.status(500).send({
      status: 500,
      success: false,
      message: "Failed to login user",
      error: "FirebaseLoginError",
    });
  }
});
/**
 * @route POST /auth/request-password-reset
 */
const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await db.users.findOne({
    where: { email },
  });
  if (!user) {
    return res.status(404).send({
      status: 404,
      success: false,
      message: "User not found",
      error: "UserNotFound",
    });
  }

  const otp = generateOTP();

  const transaction = await db.sequelize.transaction();
  try {
    const html = await loadEmailTemplate("reset-password", {
      email: email,
      otp: otp,
    });
    await sendEmail({
      to: email,
      from: fromEmail,
      subject: "Password Reset OTP",
      html: html,
    });
    user.otp = otp;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save({ transaction });
    await transaction.commit();
    return res.status(200).send({
      success: true,
      message: "Email reset OTP send successfully",
      data: {
        email: email,
        otp: otp,
      },
    });
  } catch (error: any) {
    transaction.rollback();
    Logger.error(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: "There was an error processing your request",
      error: "Error " + error.message,
    });
  }
});
/**
 * @route POST /auth/reset-password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body;
  let user = await db.users.findOne({ where: { email, isDeleted: false } });
  if (!user) {
    return res.status(401).send({
      status: 401,
      success: false,
      message: "User does not exist",
      error: "User does not exist",
    });
  }
  if (user.passwordResetExpires < Date.now()) {
    return res.status(400).send({
      status: 400,
      success: false,
      message: "OTP has expired",
      error: "OTPExpired",
    });
  }
  if (user.otp !== otp) {
    return res.status(400).send({
      status: 400,
      success: false,
      message: "Invalid OTP",
      error: "InvalidOTP",
    });
  }
  if (user.isBlocked) {
    return res.status(403).send({
      status: 403,
      success: false,
      message: "User is blocked",
      error: "User is blocked",
    });
  }
  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    return res.status(400).send({
      status: 400,
      success: false,
      message: "New password must be different from the old password",
      error: "SamePasswordError",
    });
  }
  const transaction = await db.sequelize.transaction();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.signInMethodVerified = true;
    await user.save({ transaction });
    await transaction.commit();
    res.status(200).send({
      status: 200,
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).send({
      status: 500,
      success: false,
      message: "Failed to reset password",
      error: "PasswordResetError",
    });
  }
});

export {
  registerUser,
  loginUser,
  sendEmailOtp,
  verifyEmail,
  loginWithFirebase,
  requestPasswordReset,
  resetPassword,
};
