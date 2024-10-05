import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import { AdminData, AdminLoginInput } from "./admin-auth.schema";
import { Context } from "../../middlewares/auth-checker.middleware";
import db from "../../db/models";
import { User } from "../operations/users/user.schema";

@Resolver()
export class AdminAuthResolver {
  @Query((returns: any) => User)
  @Authorized()
  async getAdminUser(@Ctx() ctx: any): Promise<User> {
    const userId = ctx.user.id;
    let admin = await db.users.findByPk(userId);
    if (!admin) {
      throw new Error("Incorrect Credentials!");
    }

    const secretKey: string = process.env.SECRET_KEY || "";
    const token = sign(
      {
        id: admin.id,
        email: admin.email,
        status: admin.status,
      },
      secretKey,
      { expiresIn: "24h" }
    );

    let admin_: User = admin;
    admin_.token = token;

    return admin_;
  }

  // Admin Login
  @Query((returns: any) => User)
  async adminLogin(
    @Arg("input")
    { email, password }: AdminLoginInput
  ): Promise<User> {
    let admin = await db.users.findOne({
      where: { email, role: "admin" },
    });

    if (!admin) {
      throw new Error("Incorrect Credentials!");
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw new Error("Incorrect Credentials!");
    }

    const secretKey: string = process.env.SECRET_KEY || "";
    const token = sign(
      {
        id: admin.id,
        email: admin.email,
        status: admin.status,
      },
      secretKey,
      { expiresIn: "72h" }
    );

    let admin_: User = admin;
    admin_.token = token;
    return admin_;
  }

  // get AdminData
  @Query(() => AdminData)
  @Authorized()
  async getAdminData(@Ctx() ctx: Context): Promise<AdminData> {
    let adminData = {
      totalUser: 0,
      totalOrder: 0,
      totalRevenue: 0,
      totalPackages: 0,
    };
    const usersCount = await db.users.count();
    const ordersCount = await db.orders.count();
    const packagesCount = await db.packages.count();
    adminData.totalUser = usersCount;
    adminData.totalOrder = ordersCount;
    adminData.totalPackages = packagesCount;
    return adminData;
  }
}
