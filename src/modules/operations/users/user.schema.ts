import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Wallet {
  @Field()
  id: number;

  @Field()
  availableForWithdrawal: number;

  @Field()
  earningsForMonth: number;

  @Field()
  successScore: number;

  @Field()
  earningsAllTime: number;

  @Field()
  completedOrders: number;

  @Field()
  activeOrders: number;
}
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
  signInMethodVerified: boolean;

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
  role: string;

  @Field({ nullable: true })
  token: string;

  @Field({ nullable: true })
  verificationFront: string;

  @Field({ nullable: true })
  verificationBack: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  wallet: Wallet;
}

@ObjectType()
export class UserDetails {
  @Field()
  user: User;
}
