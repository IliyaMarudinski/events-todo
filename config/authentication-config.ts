import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "./context-interface";

export const authChecker: MiddlewareFn<Context> = ({ context }, next) => {
  const accessToken = context.req.cookies[process.env.ACCESS_TOKEN_COOKIE];
  
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    //const token = accessToken.split(" ")[1];
    const payload = verify(accessToken, process.env.JSONWEBTOKEN_PRIVATE_KEY);    
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};