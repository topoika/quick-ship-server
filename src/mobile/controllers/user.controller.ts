import { validateUser } from "../middlewares/auth.middleware";
import catchAsync from "../utils/catchAsync";

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

export { getUserInfo };
