import { verify } from "jsonwebtoken";
import { Context } from "../interfaces/context.interface";
export const authContext = async ({ req, res }: any) => {
  const auth = req.headers.authorization;
  let user = undefined;
  if (auth) {
    const token = auth.split(" ")[1];
    if (token !== "null") {
      try {
        user = verify(token, process.env.SECRET_KEY || "");
      } catch (error) {
        console.log(error);
        user = undefined;
      }
    }
  }
  const ctx: Context = {
    req,
    res,
    user,
  };
  return ctx;
};
