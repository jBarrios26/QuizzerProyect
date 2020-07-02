import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { verify } from 'jsonwebtoken';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { User } from './entity/User';
import { QuizResolver } from './Resolvers/QuizResolver';
import { UserResolver } from './Resolvers/UserResolver';
import { createAccessToken, refreshAccessToken } from './Utilities/auth';

(async () => {
  await createConnection();
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:4200",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.listen(4000, () => console.log(`Express server listening on port 4000`));
  app.get("/", (_req, res) => res.send("hello world"));
  app.post("/refresh_token", async (req, res) => {
    const token: string = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      console.log(error);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ where: { username: payload.userid } });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    if (payload.tokenVersion !== user.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    res.cookie("jid", refreshAccessToken(user), { httpOnly: true });
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, QuizResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apollo.applyMiddleware({ app, cors: false });
})();
