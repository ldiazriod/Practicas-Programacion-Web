import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  applyGraphQL, GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import {Schema} from "../Practica4_Correccion/schema/schema.ts"
import {Mutation} from "../Practica4_Correccion/resolvers/Mutation.ts"
import {Query} from "../Practica4_Correccion/resolvers/Query.ts"
import {Task} from "../Practica4_Correccion/resolvers/Task.ts"
import {User} from "../Practica4_Correccion/resolvers/User.ts"
import {UserSchema} from "../Practica4_Correccion/mongo/schema.ts"

const resolvers = {
    Query,
    Mutation,
    Task,
    User
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
      const value = await ctx.request.body().value;
      // it allows launching of graphql playground 
      if (!value || value.operationName === "IntrospectionQuery") {
        await next();
      } else {
        const noAuthResolvers = ["login", "signin"]; 
        if (noAuthResolvers.some((elem) => value.query.includes(elem))) { //! Si es login o signin seguimos sin autentificacion
          await next();
        } else { //En el caso contrario:
          const token = ctx.request.headers.get("token") || "none"; //* Variable donde guardamos el token || none
          const email = ctx.request.headers.get("email") || "none"; //* Variable donde guardamos el email || none
          console.log(token);
          const user = await db.collection<UserSchema>("Users").findOne({ token, email }); //? Buscamos al usuario con ese token e email
          if (user) { //Si existe significa que el usuario esta loggeado 
            ctx.state.user = user; //* Guardamos en el ctx.state.user el usuario encontrado para utilizar el mail y token más tarde
            await next(); //? Y seguimos con el programa
          } else {//!Si no cumple ninguna, sacamos el siguiente error
            ctx.response.status = 401; 
            ctx.response.body = { error: "Authentication Error" };
          }
        }
      }
    });
  
    const GraphQLService = await applyGraphQL<Router>({
      Router,
      path: "/graphql",
      typeDefs: Schema,
      resolvers,
      context: (ctx: RouterContext) => {
        return {
          ctx,
          db,
          user: ctx.state.user,
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