import { NonEmptyArray } from "type-graphql";
import { UsersResolvers } from "./operations/users/user.resolver";

const OperationsResolvers: NonEmptyArray<Function> = [UsersResolvers];

export default OperationsResolvers;
