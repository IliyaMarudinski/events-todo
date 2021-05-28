import { ObjectType, Field } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class Event{
    
    @Field()
    readonly _id: ObjectId;

    @Field()
    @Property({ unique: true})
    name: string;

    @Field()
    @Property({ nullable: true})
    description?: string;

    @Field()
    @Property({ nullable: true})
    date?: Date;

}

export const EventModel = getModelForClass(Event);