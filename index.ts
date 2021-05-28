import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import { UserResolver } from "./resolvers/user-resolver";
import { ToDoResolver } from "./resolvers/todo-resolver";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./config/object-id.scalar";
import { TypegooseMiddleware } from "./config/typegoose-middleware";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import dotenv from "dotenv";
import { AuthResolver } from "./resolvers/authentication-resolver";
import { EventResolver } from "./resolvers/event-resolver";
import cookieParser from "cookie-parser";

dotenv.config()

const auth = jwt({
    secret: process.env.JSONWEBTOKEN_PRIVATE_KEY,
    algorithms: ["HS256"],
    credentialsRequired: false,
});

const graphqlPath = "/graphql";

export const app = express();

async function start() {
    try {
        const db = process.env.MONGODB_URL!;
        mongoose
            .connect(db, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: true,
                useCreateIndex: true,
            })
            .then(() => {
                console.log("connected to mongodb")
            })
            .catch((err: any) => {
                console.log(err)
            });

        const schema = await buildSchema({
            resolvers: [UserResolver, ToDoResolver, AuthResolver, EventResolver],
            emitSchemaFile: true,
            globalMiddlewares: [TypegooseMiddleware],
            // use ObjectId scalar mapping
            scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]            
        });
        
        const config = {
            schema,
            playground: {
                settings: {
                    "schema.polling.enable": false,
                    "request.credentials": "include",
                },
            },
            context: ({ req, res }) => ({ req, res })

        }

        const server = new ApolloServer(config);

        app.use(cookieParser());

        app.use(
            graphqlPath,
            bodyParser.json(),
            auth,
        );
        server.applyMiddleware({ app, path: graphqlPath });
        const port = process.env.PORT ?? "8000";
        app.listen(port);
        console.log(`Server running at: ${port}`)
    } catch (err) {
        console.error(err);
    }
}

start();