import {
    Application,
    Router,
    RouterContext,
  } from "https://deno.land/x/oak@v6.2.0/mod.ts";

  import {
    applyGraphQL,
    GQLError,
  } from "https://deno.land/x/oak_graphql/mod.ts";

import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

try{
    const DB_URL = Deno.env.get("DB_URL");
    const DB_NAME = Deno.env.get("DB_NAME");
    
    if(!DB_URL || !DB_NAME){
        throw new Error("DB_URL or DB_NAME is not defined");
    }

    const client = new MongoClient();
    client.connectWithUri(DB_URL);
    const db = client.database(DB_NAME);

    const context = {db}
    const app = new Application();

    const GraphQLService = await applyGraphQL<Router>({
        Router,
        path: "/graphql",
        typeDefs: Schema,
        resolvers,
        context: (ctx: RouterContext) => {
            return{
                ctx,
                db,
            };
        }
    })
    app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  
    console.log("Server start at http://localhost:4000");
    await app.listen({ port: 4000 });

}catch (e){
    console.error(e);
}