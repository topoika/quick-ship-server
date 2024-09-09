import { NonEmptyArray } from "type-graphql";
import AuthResolvers from "./admins";

const resolvers: NonEmptyArray<Function> = [...AuthResolvers];

export default resolvers;
