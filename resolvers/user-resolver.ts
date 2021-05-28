import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx} from "type-graphql";
import { User, UserModel } from "../db/models/user-model";
import { CreateUserInput } from "../validators/user-validator"
import bcryptjs from "bcryptjs";
import {authChecker as isAuth} from "../config/authentication-config"

@Resolver()
export class UserResolver {
        
    @Query(returns => [User])
    @UseMiddleware(isAuth)
    async users(): Promise<User[]> {
        
        return await UserModel.find({});
    }

    @Mutation(returns => User) 
    async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
    
        const userData = {...data, password: await bcryptjs.hash(data.password, 10)}

        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    }
}