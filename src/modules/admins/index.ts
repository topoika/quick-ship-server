import { NonEmptyArray } from "type-graphql";
import { AdminAuthResolver } from "./admin-auth.resolver";
import { AdminPasswordOperationsResolver } from "./admin-password-operations.resolver";

const AuthResolvers: NonEmptyArray<Function> = [
  AdminAuthResolver,
  AdminPasswordOperationsResolver,
];

export default AuthResolvers;
