import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import db from "../../../db/models";
import { buildDbFilter } from "../../../utils/db-filters";
import {
  UserFilter,
  UserPaginationInput,
  UserPaginationOutput,
} from "./user.filter";
import _ from "lodash";
import { User } from "./user.schema";

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

  @Query((returns) => User)
  @Authorized()
  async getOneUser(
    @Arg("userId")
    userId: number
  ): Promise<Event> {
    let user = await db.users.findByPk(userId, {
      where: { isDeleted: false },
      include: [db.kyc],
    });

    if (!user) throw new Error("Invalid user Id provided!");

    return user;
  }
  @Mutation(() => Boolean)
  @Authorized()
  async deleteUser(@Arg("userId") userId: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    await user.destroy();

    return true;
  }

  // block user
  @Mutation(() => Boolean)
  @Authorized()
  async blockUser(@Arg("userId") userId: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.isBlocked = true;
    await user.save();

    return true;
  }

  // unblock user
  @Mutation(() => Boolean)
  @Authorized()
  async unblockUser(@Arg("userId") userId: number): Promise<boolean> {
    const user = await db.users.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) throw new Error("Invalid user Id provided!");

    user.isBlocked = false;
    await user.save();

    return true;
  }
}