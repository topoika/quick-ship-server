import { Field, InputType, ObjectType } from "type-graphql";
import {
  BooleanFilter,
  NumberFilter,
  PaginationInput,
  PaginationResult,
  StringFilter,
} from "../../common/schemas";
import { User } from "./user.schema";

@ObjectType({ description: "The users results" })
export class UserPaginationOutput extends PaginationResult {
  @Field((type) => [User!], { description: "The Users!" })
  users: User[];
}

@InputType({ description: "Input to use when paginating users" })
export class UserPaginationInput extends PaginationInput {}

@InputType({ description: "base Filter users" })
class UsersBaseFilters {
  @Field((type) => NumberFilter, { nullable: true })
  id?: NumberFilter;

  @Field((type) => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field((type) => StringFilter, { nullable: true })
  email?: StringFilter;

  @Field((type) => StringFilter, { nullable: true })
  mobileNumber?: StringFilter;

  @Field((type) => StringFilter, { nullable: true })
  signInMethod?: StringFilter;

  @Field((type) => BooleanFilter, { nullable: true })
  verified?: BooleanFilter;

  @Field((type) => BooleanFilter, { nullable: true })
  isBlocked?: BooleanFilter;
}

@InputType({ description: "Filter users" })
export class UserFilter extends UsersBaseFilters {
  @Field((type) => [UsersBaseFilters], { nullable: true })
  or?: [UsersBaseFilters];

  @Field((type) => [UsersBaseFilters], { nullable: true })
  and?: [UsersBaseFilters];
}
