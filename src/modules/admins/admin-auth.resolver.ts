import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import {
  Admin,
  AdminLoginInput,
  AdminUser,
  CreateAdminInput,
} from "./admin-auth.schema";
import { Context } from "../../middlewares/auth-checker.middleware";

@Resolver()
export class AdminAuthResolver {
  @Query(() => AdminUser, { nullable: true }) // Specify the correct output type
  async getAdminUser(@Ctx() ctx: Context): Promise<AdminUser | null> {
    const user = { id: "1", username: "admin", email: "admin@example.com" };
    return user;
  }
}
