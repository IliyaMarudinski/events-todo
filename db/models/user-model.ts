import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { ToDo } from "./todo-model";

@ObjectType()
export class User {
    @Field()
    readonly _id: ObjectId;

    @Field()
    @Property({ unique: true})
    email: string;

    @Field()
    @Property()
    password: string;

    @Field()
    @Property()
    firstName: string;

    @Field()
    @Property()
    lastName: string;


}

export const UserModel = getModelForClass(User);