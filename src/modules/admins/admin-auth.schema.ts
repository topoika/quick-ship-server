import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType({
  description: "Password input",
})
class PasswordInput {
  @Field({ nullable: false, description: "User Password" })
  @IsNotEmpty()
  @MinLength(6, {
    message: "Password should be more than 6 characters",
  })
  password: string;
}

@InputType({
  description: "Create an admin",
})
@InputType()
export class AdminLoginInput extends PasswordInput {
  @Field({ nullable: false, description: "The email of a user" })
  @IsEmail({}, { message: "Email should be a valid email" })
  email: String;
}

@ObjectType()
export class AdminData {
  @Field()
  totalUser: number;

  @Field()
  totalOrder: number;

  @Field()
  totalRevenue: number;

  @Field()
  totalPackages: number;
}
