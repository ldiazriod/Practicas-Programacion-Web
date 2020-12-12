import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  applyGraphQL, GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";


import {Schema} from "../Practica4/schema/Schema.ts"
import {Query} from "../Practica4/resolvers/Query.ts" 
import {Mutation} from "../Practica4/resolvers/Muation.ts"
import {Task} from "../Practica4/resolvers/Task.ts"
import { UserSchema } from "./mongo/SChema.ts";

const resolvers = {
    Query,
    Mutation,
    Task
  }
  
  try {
    // connect to Mongo DB
    const DB_URL = Deno.env.get("DB_URL");
    const DB_NAME = Deno.env.get("DB_NAME");
  
    if (!DB_URL || !DB_NAME) {
      throw Error("Please define DB_URL and DB_NAME on .env file");
    }
  
    const client = new MongoClient();
    client.connectWithUri(DB_URL);
    const db = client.database(DB_NAME);

    const app = new Application();

    app.use(async (ctx, next) => {
      const value = await ctx.request.body().value
      const validQuery = ["logIn", "signIn", "getTask", "getTasks", "getTaskByDate"]
      const UsersCollection = db.collection<UserSchema>("Users")
      if(validQuery.some(elem => value.query.includes(elem))){
          await next();
      }else{
          const findOne = await UsersCollection.findOne({token: ctx.request.headers.get("token") as string})
          if(findOne && findOne.token !== null){
              await next();
          }else{
              ctx.response.status = 401;
              ctx.response.body = {error: "Auth error"}
          }
      }
  })

    const GraphQLService = await applyGraphQL<Router>({
      Router,
      path: "/graphql",
      typeDefs: Schema,
      resolvers,
      context: (ctx: RouterContext) => {
        return {
          ctx,
          db,
        };
      },
    });
  
    app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  
    const port = Deno.env.get("PORT") || "4000";
  
    console.log(`Server start at http://localhost:${port}`);
    await app.listen({ port: parseInt(port) });

  } catch (e) {
    console.error(e);
  }
