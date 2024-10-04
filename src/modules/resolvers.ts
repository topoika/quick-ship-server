import { NonEmptyArray } from "type-graphql";
import AuthResolvers from "./admins";
import OperationsResolvers from ".";

const resolvers: NonEmptyArray<Function> = [
  ...AuthResolvers,
  ...OperationsResolvers,
];

export default resolvers;
