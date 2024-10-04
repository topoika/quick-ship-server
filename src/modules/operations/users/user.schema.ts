import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  bio: string;

  @Field()
  verified: boolean;

  @Field({ nullable: true })
  signInMethod: string;

  @Field()
  isOnline: boolean;

  @Field()
  isDeleted: boolean;

  @Field()
  isBlocked: boolean;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}

@ObjectType()
export class UserDetails {
  @Field({ nullable: true })
  user: User;
}
