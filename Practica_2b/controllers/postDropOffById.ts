import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { CarsSchema, ICar, IContext, PeopleSchema } from "../Schemas.ts";

const postDropOffId = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const CarCollection = db.collection<CarsSchema>("CarCollection")
        const PeopleCollection = db.collection<PeopleSchema>("PeopleCollection")

        const { id } = helpers.getQuery(ctx, {mergeParams: true});
        const journey = await PeopleCollection.findOne({id: Number(id)})

        if(journey){
            const findCar = await CarCollection.findOne({client: journey.id})
            if(findCar){
                const {matchedCount} = await CarCollection.updateOne({id: findCar.id}, {$set: {client: 0}})
                const deleteClient = await PeopleCollection.deleteOne({id: journey.id})
                if(matchedCount){
                    ctx.response.status = 204;
                    ctx.response.body = "No Content"
                }
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Not found"
            }
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Not Found"
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
} 

export {postDropOffId};