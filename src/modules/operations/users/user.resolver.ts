import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import db from "../../../db/models";
import { buildDbFilter } from "../../../utils/db-filters";
import {
  UserFilter,
  UserPaginationInput,
  UserPaginationOutput,
} from "./user.filter";
import _ from "lodash";
import { UserDetails } from "./user.schema";
import { walletAtr } from "../../../mobile/controllers/data.attributes";
import deleteFile from "../../../mobile/utils/delete.files";

@Resolver()
export class UsersResolvers {
  @Query((returns) => UserPaginationOutput)
  @Authorized()
  async getUsers(
    @Arg("pagination", (type) => UserPaginationInput, {
      description: "user pagination",
      nullable: true,
    })
    pagination?: UserPaginationInput,
    @Arg("filter", (type) => UserFilter, {
      nullable: true,
      description: "filter",
    })
    filter?: UserFilter
  ): Promise<UserPaginationOutput> {
    let page: number = pagination?.page || -1;
    page = page >= 1 ? page - 1 : page;

    let pageSize: number = pagination?.count || -1;

    //filtering and sorting options
    const limit = pageSize <= 0 ? null : pageSize;
    const offset = page <= 0 ? 0 : page * (pageSize <= 0 ? 0 : pageSize);

    let where = buildDbFilter(filter);

    let users = await db.users.findAll({
      where: {
        ...where,
        isDeleted: false,
      },
      limit,
      offset,
    });

    const totalCount: number = (
      await db.users.findAll({ where: { ...where, isDeleted: false } })
    ).length;

    const result: UserPaginationOutput = {
      count: users?.length,
      users,
      totalCount,
      pageCount:
        totalCount === 0 || pageSize <= 0
          ? 1
          : Math.ceil(totalCount / pageSize),
    };

    return result;
  }

  @Query((returns) => UserDetails)
  @Authorized()
  async getUserDetails(
    @Arg("id")
    id: number
  ): Promise<UserDetails> {
    const user = await db.users.findByPk(id, {
      include: [{ model: db.wallets, as: "wallet", attributes: walletAtr }],
    });
    if (!user) throw new Error("Invalid user Id provided!");
    return { user };
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!user) throw new Error("Invalid user Id provided!");

    if (user.image) {
      deleteFile(`media/${user.image}`);
    }
    if (user.verificationFront) {
      deleteFile(`media/${user.verificationFront}`);
    }
    if (user.verificationBack) {
      deleteFile(`media/${user.verificationBack}`);
    }
    await user.destroy();

    return true;
  }

  // block user
  @Mutation(() => Boolean)
  @Authorized()
  async blockUser(@Arg("id") id: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.isBlocked = true;
    await user.save();

    return true;
  }
  // make user an admin
  @Mutation(() => Boolean)
  // @Authorized()
  async makeUserAdmin(@Arg("id") id: number): Promise<boolean> {
    try {
      let user = await db.users.findByPk(id);
      if (!user) throw new Error("Invalid user Id provided!");
      user.role = "admin";
      await user.save();
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create admin user. Please try again later");
    }
  }

  // unblock user
  @Mutation(() => Boolean)
  @Authorized()
  async unblockUser(@Arg("id") id: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.isBlocked = false;
    await user.save();

    return true;
  }

  // verify user
  @Mutation(() => Boolean)
  @Authorized()
  async verifyUser(@Arg("id") id: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.verified = true;
    await user.save();

    return true;
  }

  // unverify user
  @Mutation(() => Boolean)
  @Authorized()
  async unverifyUser(@Arg("id") id: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: id, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.verified = false;
    await user.save();

    return true;
  }
}
