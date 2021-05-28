import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx} from "type-graphql";
import { ToDo, ToDoModel } from "../db/models/todo-model";
import { CreateToDoInput } from "../validators/todo-validator"
import {authChecker as isAuth} from "../config/authentication-config"
import { Context } from "../config/context-interface";
import { UserInputError } from "apollo-server-errors";


@Resolver()
export class ToDoResolver {
        
    @Query(returns => [ToDo])
    @UseMiddleware(isAuth)
    async todos(@Ctx() { payload }: Context): Promise<ToDo[]> {        
        return await ToDoModel.find({authorId:payload!._id});
    }

    @Mutation(returns => ToDo)
    @UseMiddleware(isAuth) 
    async createToDo(@Arg("data") data: CreateToDoInput, @Ctx() { payload }: Context): Promise<ToDo> {
                
        const newToDo = new ToDoModel({...data, authorId:payload!._id}   );
        await newToDo.save();
        return newToDo;
    }

    @Mutation(returns => String)
    @UseMiddleware(isAuth)
    async removeToDo(@Arg("title") title: string, @Ctx() { payload }: Context): Promise<String> {

        const toDo = await ToDoModel.findOneAndDelete({title,authorId:payload!._id})

        if(!toDo){
            throw new UserInputError(`Cannot find ToDo with title: ${title}`, {
                field: "title",
                value: title,
                constraint: "toDoDoesNotExist",
            })
        }else{
            return `ToDo with title: ${title} is removed`;
        }
   
    }

    @Mutation(returns => ToDo)
    @UseMiddleware(isAuth)
    async updateToDoNote(
        @Arg("title") title: string, 
        @Arg("note") note: string,
        @Ctx() { payload }: Context): Promise<String> {

        const toDo = await ToDoModel.findOneAndUpdate({title,authorId:payload!._id}, {note}, {new:true} )

        if(!toDo){
            throw new UserInputError(`Cannot find ToDo with title: ${title}`, {
                field: "title",
                value: title,
                constraint: "toDoDoesNotExist",
            })
        }else{
            return toDo
        }

    }


}