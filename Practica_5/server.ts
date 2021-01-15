import {  Application, Router, RouterContext } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import                                              "https://deno.land/x/dotenv/load.ts";
import { MongoClient }                         from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {applyGraphQL, GQLError}                from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { UserSchema }                          from "../Practica_5/mongo/schema.ts";
import { Mutation }                            from "../Practica_5/resolvers/Mutation.ts"
import {Schema}                                from "../Practica_5/schema/schema.ts"

//! Completada conjuntamente con Jorge Gil, Óscar González y yo.

const resolvers = {
    Mutation,
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
            const noAuthNeededResolvers = ["logIn"];
            if(noAuthNeededResolvers.some((elem) => value.query.includes(elem))){
                await next();
            }else{
                const token = ctx.request.headers.get("token") || "none";
                const user = await db.collection<UserSchema>("UserCollection").findOne({token});
                if(user) {
                    const authNeededResolverGlobal = ["logOut", "getPost"]
                    const authNeededResolversAdmin = ["createUser", "deleteUser"];
                    const authNeededResolversAuthor = ["createPost", "deletePost"];
                    const authNeededResolverUser = ["createComment", "deleteComment"];
                    if(authNeededResolverGlobal.some((elem) => value.query.includes(elem))){
                        ctx.state.user = user;
                        await next();
                    }else if(authNeededResolversAdmin.some((elem) => value.query.includes(elem))){
                        if(user.rol.includes("ADMIN")){
                            await next();
                        }else{
                            ctx.response.status = 401;
                            ctx.response.body = {error: "Auth Admin error"}
                        }
                    }else if(authNeededResolversAuthor.some((elem) => value.query.includes(elem))){
                        if(value.query.includes("deletePost")){
                            if(user.rol.includes("AUTHOR") || user.rol.includes("EDITOR")){
                                ctx.state.user = user;
                                await next();
                            }else{
                                ctx.response.status = 401;
                                ctx.response.body = {error: "Auth error"}
                            }
                        }else if(user.rol.includes("AUTHOR")){
                            ctx.state.user = user;
                            await next();
                        }else{
                            ctx.response.status = 401;
                            ctx.response.body = {error: "Auth Author error"}
                        }
                    }else if(authNeededResolverUser.some((elem) => value.query.includes(elem))){
                        if(value.query.includes("deleteComment")){
                            if(user.rol.includes("USER") || user.rol.includes("EDITOR")){
                                ctx.state.user = user;
                                await next();
                            }else{
                                ctx.response.status = 401;
                                ctx.response.body = {error: "Auth error"}
                            }
                        }else if(user.rol.includes("USER")){
                            ctx.state.user = user;
                            await next();
                        }
                    }
                }else{
                    ctx.response.status = 401;
                    ctx.response.body = {error: "Authentication Error"};
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