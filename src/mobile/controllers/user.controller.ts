import path from "path";
import db from "../../db/models";
import Logger from "../../logger";
import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";
import deleteFile from "../utils/delete.files";

/**
 * @route GET /user/get-info
 */
const getUserInfo = catchAsync(async (req: any, res) => {
  const { id } = req.user;
  const user = await validateUser(id);
  res.status(200).send({
    status: 200,
    success: true,
    message: "User info fetched successfully",
    user,
  });
});

/**
 * @route PUT /user/update-profile
 * @description endpoint to update user profile using POST and has three files possibly attached, profilePicture, idCardFront, idCardBack
 */
const updateProfile = catchAsync(async (req: any, res) => {
  const { id } = req.user;
  const user = await validateUser(id);
  const transaction = await db.sequelize.transaction();
  try {
    const { name, phone, idNumber, bio } = req.body;
    const image = req.files?.image;
    const verificationFront = req.files?.verificationFront;
    const verificationBack = req.files?.verificationBack;
    await db.users.update(
      {
        name,
        phone,
        idNumber,
        bio,
        ...(image && { image: path.basename(image[0].path) }),
        ...(verificationFront && {
          verificationFront: path.basename(verificationFront[0].path),
          verified: false,
        }),
        ...(verificationBack && {
          verificationBack: path.basename(verificationBack[0].path),
          verified: false,
        }),
      },
      { where: { id } },
      { transaction }
    );

    await transaction.commit();
    if (image && user.image) {
      deleteFile(`media/${user.image}`);
    }
    if (verificationFront && user.verificationFront) {
      deleteFile(`media/${user.verificationFront}`);
    }
    if (verificationBack && user.verificationBack) {
      deleteFile(`media/${user.verificationBack}`);
    }
    const updatedUser = await db.users.findByPk(id);
    res.status(200).send({
      status: 200,
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    await transaction.rollback();
    Logger.error(error);
    res.status(400).send({
      status: 400,
      success: false,
      message: "An error occurred while updating user profile",
    });
  }
});

/**
 * @route DELETE /user/delete-account
 */
const deleteAccount = catchAsync(async (req: any, res) => {
  const { id } = req.user;
  const user = await validateUser(id);
  const transaction = await db.sequelize.transaction();
  try {
    await db.users.destroy({ where: { id } }, { transaction });
    await transaction.commit();
    // delete user files
    if (user.image) {
      deleteFile(`media/${user.image}`);
    }
    if (user.verificationFront) {
      deleteFile(`media/${user.verificationFront}`);
    }
    if (user.verificationBack) {
      deleteFile(`media/${user.verificationBack}`);
    }
    res.clearCookie("token");
    res.status(200).send({
      status: 200,
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    Logger.error(error);
    res.status(400).send({
      status: 400,
      success: false,
      message: "An error occurred while deleting user account",
    });
  }
});

export { getUserInfo, updateProfile, deleteAccount };
