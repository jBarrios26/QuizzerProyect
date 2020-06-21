import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  InputType,
} from "type-graphql";

import { User } from "../entity/User";
import {
  createAccessToken,
  isAuth,
  refreshAccessToken,
} from "../Utilities/auth";
import { ServerContext } from "../Utilities/ServerContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class PruebaInput {
  @Field(() => String)
  theme: string;
}

@InputType()
export class ArrayInputTest {
  @Field(() => [PruebaInput])
  pruebaarr: PruebaInput[];
}

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  prueba(@Arg("prueba") prueba: ArrayInputTest) {
    return prueba.pruebaarr.map((x) => x.theme).toString();
  }

  @Query(() => String)
  hello() {
    return "hi;";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye() {
    return "bye";
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { res }: ServerContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("Could not find user.");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Incorrect password");
    }

    // login successful

    res.cookie("jid", refreshAccessToken(user), {
      httpOnly: true,
      maxAge: 90000000,
    });

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("username", () => String) username: string) {
    await User.getRepository().increment({ username }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("name") name: string,
    @Arg("gender") gender: string,
    @Arg("publisher", () => Boolean) publisher: boolean
  ): Promise<boolean> {
    const hashPassword = await hash(password, 12);
    const user = {
      username,
      password: hashPassword,
      name,
      gender,
      publisher,
    };
    try {
      await User.insert(user);
    } catch (err) {
      console.log(`Error: ${err}`);
      return false;
    }
    return true;
  }
}
