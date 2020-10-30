import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { CarsSchema, ICar, IContext, PeopleSchema } from "../Schemas.ts";

const postJourney = async (ctx: IContext) =>{
    try{
        const db: Database = ctx.state.db;
        const CarCollection = db.collection<CarsSchema>("CarCollection")
        const clientCollection = db.collection<PeopleSchema>("PeopleCollection")
        let badRequest: boolean = false;

        const {value: newClient} = ctx.request.body({type: "json"});
        const solicitud: Partial<PeopleSchema> = await newClient;

        const searchSameClientID = await clientCollection.findOne({id: solicitud.id})
        if(searchSameClientID){
            badRequest = true;
        }else if(solicitud.id === undefined || solicitud.people === undefined){
            badRequest = true;
        }else if(((solicitud.people as number) < 1) || ((solicitud.people as number) > 6)){
            badRequest = true;
        }else if((solicitud.id as number === 0)){
            badRequest = true;
        }

        if(!badRequest){
            ctx.response.status = 200;
            ctx.response.body = "OK"
            ctx.response.body = "Te estamos buscando un coche..."
            switch(solicitud.people as number){
                case 1: case 2: case 3: case 4:{
                    const findCar4orless = await CarCollection.findOne({seats: 4, client: 0})
                    if(findCar4orless){
                        const {matchedCount} = await CarCollection.updateOne({id: findCar4orless.id}, {$set: {client: solicitud.id as number}})
                        if(matchedCount){
                            ctx.response.status = 202;
                            ctx.response.body = "Accepted"
                            const anadirCliente = await clientCollection.insertOne(solicitud);
                        }
                    }else{
                        const findCar5 = await CarCollection.findOne({seats: 5, client: 0})
                        if(findCar5){
                            const {matchedCount} = await CarCollection.updateOne({id: findCar5.id}, {$set: {client: solicitud.id as number}})
                            if(matchedCount){
                                ctx.response.status = 202;
                                ctx.response.body = "Accepted"
                                const anadirCliente = await clientCollection.insertOne(solicitud);
                            }
                        }else{
                            const findCar6 = await CarCollection.findOne({seats: 6, client:0});
                            if(findCar6){
                                const {matchedCount} = await CarCollection.updateOne({id: findCar6.id}, {$set: {client: solicitud.id as number}})
                                if(matchedCount){
                                    ctx.response.status = 202;
                                    ctx.response.body = "Accepted"
                                    const anadirCliente = await clientCollection.insertOne(solicitud);
                                }
                            }else{
                                ctx.response.status = 404;
                                ctx.response.body = "Not Found"
                            }
                        }
                    }
                    break;
                }
                case 5: {
                    const findCar5 = await CarCollection.findOne({seats: 5, client: 0})
                    if(findCar5){
                        const {matchedCount} = await CarCollection.updateOne({id: findCar5.id}, {$set: {client: solicitud.id as number}});
                        if(matchedCount){
                            ctx.response.status = 202;
                            ctx.response.body = "Accepted"
                            const anadirCliente = await clientCollection.insertOne(solicitud);
                        }
                    }else{
                        const findCar6 = await CarCollection.findOne({seats: 6, client: 0})
                        if(findCar6){
                            const {matchedCount} = await CarCollection.updateOne({id: findCar6.id}, {$set: {client: solicitud.id as number}})
                            if(matchedCount){
                                ctx.response.status = 202;
                                ctx.response.body = "Accepted"
                                const anadirCliente = await clientCollection.insertOne(solicitud);
                            }
                        }else{
                            ctx.response.status = 404;
                            ctx.response.body = "Not found"
                        }
                    }
                    break;
                }
                case 6: {
                    const findCar6 = await CarCollection.findOne({seats: 6, client: 0})
                    if(findCar6){
                        const {matchedCount} = await CarCollection.updateOne({id: findCar6.id}, {$set: {client: solicitud.id as number}})
                        if(matchedCount){
                            ctx.response.status = 202;
                            ctx.response.body = "Accepted"
                            const anadirCliente = await clientCollection.insertOne(solicitud);
                        }
                    }else{
                        ctx.response.status = 404;
                        ctx.response.body = "Not found"
                    }
                    break;
                }
                default: {
                    ctx.response.status = 500;
                    ctx.response.body = "Server Error"
                    break;
                }
            }
        }else{
            ctx.response.status = 400;
            ctx.response.body = "Bad Request"
        }  
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export {postJourney}