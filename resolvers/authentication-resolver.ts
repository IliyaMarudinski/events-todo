import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware} from "type-graphql";
import { UserModel } from "../db/models/user-model";
import { UserInputError } from "apollo-server-express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../config/context-interface";
import {authChecker as isAuth} from "../config/authentication-config"

@Resolver()
export class AuthResolver {

  @Mutation(returns => String) 
  async login(
    @Arg("email") email: string, 
    @Arg("password") password: string,
    @Ctx() { res }: Context): Promise<String> {

    const matchedUser = await UserModel.findOne({email});

    if(!matchedUser){
        throw new UserInputError(`cannot find user with email: ${email}`, {
            field: "email",
            value: email,
            constraint: "emailDoesNotExist",
        })
    }

    const validPassword = await bcryptjs.compare(password, matchedUser.password);
    if(!validPassword){
        throw new UserInputError(`Password is incorrect`, {
            field: "password",
            value: "",
            constraint: "passwordIncorrect",
        })
    }

    const privateKey = process.env.JSONWEBTOKEN_PRIVATE_KEY;
    
    const token = jwt.sign({
        _id: matchedUser._id,
        email: matchedUser.email, 
    }, privateKey, {
        expiresIn: "1d"
    });

    res.cookie(process.env.ACCESS_TOKEN_COOKIE, token);

    return token;
  }

  @Mutation(returns => String)
  @UseMiddleware(isAuth) 
  async logout(@Ctx() { res }: Context): Promise<String> {

    res.clearCookie(process.env.ACCESS_TOKEN_COOKIE);

    return "success logout"
  }

}