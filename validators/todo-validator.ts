import { Field, ID, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
export class CreateToDoInput {

    @Field()
    @Length(3, 50)
    title: string;

    @Field()
    description: string;

    @Field()
    note: string;

    @Field()
    eventId: string;
    
}