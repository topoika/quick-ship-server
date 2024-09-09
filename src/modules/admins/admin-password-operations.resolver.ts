import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from "sequelize";
import { Arg, Mutation, Resolver } from "type-graphql";
import { ResetPasswordInput } from "./admin-auth.schema";
import db from "../../db/models";
import sendEmail from "../../utils/sendEmail";
import loadEmailTemplate from "../../utils/loadEmailTemplate";

@Resolver()
export class AdminPasswordOperationsResolver {
  @Mutation((returns) => String, {
    description: "Forgot Password - give email to receive reset link",
  })
  async forgotPassword(
    @Arg("email")
    email: string
  ): Promise<string> {
    try {
      let admin = await db.admins.findOne({ where: { email } });
      if (!admin) {
        throw new Error(`Invalid details provided!`);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const passwordResetExpires = Date.now() + 60 * 60 * 1000;

      const link = `${process.env.APP_URL}reset-password/${resetToken}`;

      const emailTemplate = await loadEmailTemplate("forgot-password-email", {
        link,
        name: admin.name,
      });

      await sendEmail({
        to: admin.email,
        from: `AutoCllan <${process.env.FROM_EMAIL}>`,
        subject: "Reset Password Request (Expires in 60 Minutes)",
        html: emailTemplate,
      });

      admin.passwordResetExpires = passwordResetExpires;
      admin.passwordResetToken = passwordResetToken;

      await admin.save();

      return "Password Reset link sent to the email provided";
    } catch (error: any) {
      throw new Error("Failed!. Please check details provided.");
    }
  }

  @Mutation((returns) => String, {
    description: "Reset Password",
  })
  async resetPassword(
    @Arg("input")
    { token, password }: ResetPasswordInput
  ): Promise<string> {
    const hashedAuthToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    let admin = await db.admins.findOne({
      where: {
        passwordResetToken: hashedAuthToken,
        passwordResetExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!admin) {
      throw new Error(`The token provided is either invalid or has expired`);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin.password = hashedPassword;
    admin.passwordResetExpires = null;
    admin.passwordResetToken = null;

    await admin.save();

    return "Password Reset successfull";
  }
}
