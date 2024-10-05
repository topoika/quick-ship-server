import { NonEmptyArray } from "type-graphql";
import { AdminAuthResolver } from "./admin-auth.resolver";

const AuthResolvers: NonEmptyArray<Function> = [AdminAuthResolver];

export default AuthResolvers;
