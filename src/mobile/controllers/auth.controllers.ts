import db from "../../db/models";
import catchAsync from "../utils/catchAsync";

const registerUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.create({ email, password });

  res.status(201).send({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export { registerUser };
