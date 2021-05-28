import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx} from "type-graphql";
import { Event, EventModel } from "../db/models/event-model";
import { CreateEventInput } from "../validators/event-validator"
import {authChecker as isAuth} from "../config/authentication-config"
import { UserInputError } from "apollo-server-errors";
import { ToDo, ToDoModel } from "../db/models/todo-model";

@Resolver()
export class EventResolver {

    @Query(returns => [Event])
    @UseMiddleware(isAuth)
    async events(): Promise<Event[]> {
        return await EventModel.find({})
    }

    @Mutation(returns => Event)
    @UseMiddleware(isAuth)
    async createEvent(@Arg("data") data: CreateEventInput): Promise<Event> {
        const event = new EventModel({...data})
        await event.save();
        return event;
    }    

    @Mutation(returns => Event)
    @UseMiddleware(isAuth)
    async updateEventDescription(@Arg("name") name:string, @Arg("description") description:string): Promise<Event> {
        
        const event = await EventModel.findOneAndUpdate({name},{description},{new:true})

        if(!event){

            throw new UserInputError(`Cannot find Event with name: ${name}`, {
                field: "name",
                value: name,
                constraint: "EventDoesNotExist",
            })

        }

        return event

    }   

    @Mutation(returns => Event)
    @UseMiddleware(isAuth)
    async updateEventName(@Arg("name") name: string,@Arg("newName") newName: string): Promise<Event>{

        const event = await EventModel.findOneAndUpdate({name},{name:newName},{new:true})

        if(!event){
            throw new UserInputError(`Cannot find Event with name: ${name}`, {
                field: "name",
                value: name,
                constraint: "EventDoesNotExist",
            })
        }

        return event
    }

    @Mutation(returns => String)
    @UseMiddleware(isAuth)
    async removeEvent(@Arg("name")name: string): Promise<String> {

        const event = await EventModel.findOneAndDelete({name})
        
        if(!event){
            throw new UserInputError(`Cannot find event with name: ${name}`, {
                field: "name",
                value: name,
                constraint: "EventDoesNotExist",
            })
        }

        const todo = await ToDoModel.remove({eventId:event._id},{justOne:false})
        
        console.log(todo)

        return "Successfuly delete event";
    } 
}