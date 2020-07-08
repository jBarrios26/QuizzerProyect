import { sign, verify } from "jsonwebtoken";
import { User } from "src/entity/User";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";

import { ServerContext } from "./ServerContext";

export const createAccessToken = (user: User) => {
  return sign(
    {
      userid: user.username,
      publish: user.publisher,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
};

export const refreshAccessToken = (user: User) => {
  return sign(
    {
      userid: user.username,
      publish: user.publisher,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
};

export const isAuth: MiddlewareFn<ServerContext> = ({ context }, next) => {
  const auth = context.req.headers["authorization"];
  if (!auth) {
    throw new Error("Not authenticated");
  }
  try {
    let token = auth.split(" ")[1];
    let payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }

  return next();
};
