import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { CarsSchema, ICar, IContext, PeopleSchema } from "../Schemas.ts";

const postLocateById = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const CarCollection = db.collection<CarsSchema>("CarCollection")
        const PeopleCollection = db.collection<PeopleSchema>("PeopleCollection")
        const { id } = helpers.getQuery(ctx, {mergeParams: true});
        const client = await PeopleCollection.findOne({id: Number(id)});

        if(client){
            const foundCar = await CarCollection.findOne({client: client.id})
            if(foundCar){
                ctx.response.status = 200;
                ctx.response.body = `Ok. Car ID ${foundCar.id}`
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Not Found"
            }
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Not found"
        }
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}
export {postLocateById}