import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class Admin {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  profileImage: string;

  @Field({ nullable: true, description: "About" })
  about?: string;

  @Field({ nullable: true, description: "Auth Token" })
  token?: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}

@InputType({
  description: "Password input",
})
class PasswordInput {
  @Field({ nullable: false, description: "User Password" })
  @IsNotEmpty()
  @MinLength(8, {
    message: "Password should be more than 8 characters",
  })
  password: string;
}

@InputType({
  description: "Create an admin",
})
export class CreateAdminInput extends PasswordInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsEmail({}, { message: "Email should be a valid email" })
  email: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  profileImage: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  status: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  about: string;
}

@InputType()
export class AdminLoginInput extends PasswordInput {
  @Field({ nullable: false, description: "The email of a user" })
  @IsEmail({}, { message: "Email should be a valid email" })
  email: String;
}

@InputType()
export class ResetPasswordInput extends PasswordInput {
  @Field()
  token: string;
}
