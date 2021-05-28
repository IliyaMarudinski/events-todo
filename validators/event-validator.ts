import { Field, ID, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
export class CreateEventInput {

    @Field()
    @Length(3, 50)
    name: string;

    @Field()
    description: string;

    @Field()
    date: string;
    
}