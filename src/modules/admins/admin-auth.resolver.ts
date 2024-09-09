import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import db from "../../db/models/index";
import { Admin, AdminLoginInput, CreateAdminInput } from "./admin-auth.schema";

@Resolver()
export class AdminAuthResolver {
  @Authorized()
  @Query((returns: any) => Admin)
  async getAdminUser(@Ctx() ctx: any): Promise<Admin> {
    const userId = ctx.user.id;
    let admin = await db.admins.findByPk(userId);

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

    let admin_: Admin = admin;
    admin_.token = token;

    return admin_;
  }

  @Query((returns: any) => Admin)
  async adminLogin(
    @Arg("input")
    { email, password }: AdminLoginInput
  ): Promise<Admin> {
    let admin = await db.admins.findOne({
      where: { email },
    });

    if (!admin) {
      throw new Error("Incorrect Credentials!");
    }

    if (admin?.status === "inactive") {
      throw new Error(
        "This account has been inactived. Please contact admin for help"
      );
    }

    //validate the password
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

    let admin_: Admin = admin;
    admin_.token = token;

    return admin_;
  }

  @Authorized()
  @Mutation((returns: any) => Admin)
  async createAdmin(
    @Arg("input")
    input: CreateAdminInput
  ): Promise<Admin> {
    let admin = await db.admins.findOne({
      where: {
        email: input.email,
      },
    });

    if (admin) {
      throw new Error("A user with given email already exist!");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);

    const transaction = await db.sequelize.transaction();

    try {
      let admin = await db.admins.create(
        { ...input, password: hashedPassword, status: "active" },
        { transaction }
      );

      if (admin) {
        await transaction.commit();

        return admin;
      } else {
        throw new Error("Failed to create admin user. Please try again later");
      }
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  }
}
