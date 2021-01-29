import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import                                              "https://deno.land/x/dotenv/load.ts";
import { MongoClient }                         from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {applyGraphQL, GQLError}                from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import {Schema} from "../ExamenFinal/schema/schema.ts";
import {Mutation} from "../ExamenFinal/resolvers/Mutation.ts"
import {Query} from "../ExamenFinal/resolvers/Query.ts"
import {UserSchema} from "../ExamenFinal/mongo/schemas.ts"

const resolvers = {
    Mutation,
    Query,
}

try{

    const DB_URL = Deno.env.get("DB_URL");
    const DB_NAME = Deno.env.get("DB_NAME");

    if(!DB_URL || !DB_NAME){
        throw Error("Please define DB_URL and DB_NAME on .env file");
    }

    const client = new MongoClient();
    client.connectWithUri(DB_URL);
    const db = client.database(DB_NAME);

    const app = new Application();
    
    app.use(async(ctx, next) => {
        const value = await ctx.request.body().value;

        if(!value || value.operationName === "IntrospectionQuery"){
            await next();
        }else{
            const noAuthNeededResolvers = ["logIn", "sigUp"]
            if(noAuthNeededResolvers.some((elem) => value.query.includes(elem))){
                await next();
            }else{
                const token = ctx.request.headers.get("token") || "none";
                const findUser = await db.collection<UserSchema>("UserCollection").findOne({token});
                const loggOut = ["logOut"]
                if(findUser){
                    const carAuthNeededResolver = ["newCar", "changeStateOfCar"]
                    const userAuthNeededResolver = ["newViaje"]
                    if(loggOut.some((elem) => value.query.includes(elem))){
                        await next();
                    }else if(carAuthNeededResolver.some((elem) => value.query.includes(elem))){
                        if(findUser.rol.includes("CONDUCTOR")){
                            ctx.state.user = findUser;
                            await next();
                        }else{
                            ctx.response.status = 401;
                            ctx.response.body = {error: "Auth Conductor error"};
                        }
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth"}
                    }
                }else{
                    ctx.response.status = 401;
                    ctx.response.body = {error: "Auth error"};
                }
            }
        }
    })



    const GraphQLService = await applyGraphQL<Router>({
        Router,
        path: "/graphql",
        typeDefs: Schema,
        resolvers,
        context: (ctx: RouterContext) => {
            return{
                ctx,
                db,
                user: ctx.state.user,
            }
        }
    })

    app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

    const port = Deno.env.get("PORT") || "4000";
  
    console.log(`Server start at http://localhost:${port}`);
    await app.listen({ port: parseInt(port) });
}catch(e){
    console.log(e);
}