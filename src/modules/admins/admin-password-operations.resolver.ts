import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from "sequelize";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { Context } from "../../middlewares/auth-checker.middleware";
import { AdminUser } from "./admin-auth.schema";

@Resolver()
export class AdminPasswordOperationsResolver {
  @Query(() => AdminUser, { nullable: true }) // Specify the correct output type
  async resetUser(@Ctx() ctx: Context): Promise<AdminUser | null> {
    const user = { id: "1", username: "admin", email: "admin@example.com" };
    return user;
  }
}
