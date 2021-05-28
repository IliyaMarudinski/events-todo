import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class ToDo{
    
    @Field()
    readonly _id: ObjectId;

    @Field()
    @Property()
    authorId: string;

    @Field()
    @Property({ unique: true})
    title: string;

    @Field()
    @Property({ nullable: true})
    description?: string;

    @Field()
    @Property({ nullable: true})
    note?: string;

    @Field()
    @Property({ nullable: true})
    eventId?: string;

}

export const ToDoModel = getModelForClass(ToDo);
