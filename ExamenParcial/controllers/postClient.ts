import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import {ClientSchema, IClient, IContext} from "../Schemas.ts"

//TODO: Hacer comprobaciones de que los valores del json son correctos

const postClient = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const clientCollection = db.collection<ClientSchema>("ClientCollection")

        const {value: clientBody} = ctx.request.body({type: "json"})
        const newClient: ClientSchema = await clientBody;

        if(newClient){
            const search = await clientCollection.findOne({cif: newClient.cif})
            if(search && (newClient.address === undefined )){
                ctx.response.status = 400;
                ctx.response.body = "Bad Request"
            }else{
                const insertInMongo = await clientCollection.insertOne(newClient);
                ctx.response.status = 200;
                ctx.response.body = "OK"
            }
        }
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
}

export {postClient}