import { AuthChecker } from "type-graphql";

export const authChecker: AuthChecker<Context> = async ({
  context: { user },
}) => {
  if (!user) {
    return false;
  } else {
    return true;
  }
};

export interface Context {
  req: Request;
  res: Response;
  user?: any;
}
