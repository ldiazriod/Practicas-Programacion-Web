import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { CarsSchema, ICar, IContext, PeopleSchema } from "../Schemas.ts";

const putCar = async (ctx: IContext) => {
    try{
       const db: Database = ctx.state.db;
       const CarCollection = db.collection<CarsSchema>("CarCollection")
       const PeopleCollection = db.collection<PeopleSchema>("PeopleCollection")
       let badRequest: boolean = false;
       const {value: carBody} = ctx.request.body({type: "json"});
       const carArray: Partial<CarsSchema>[] = await carBody;
       const auxId: number[] = [];

       if(carArray){
           const result = carArray.map((elem) => {
               if(((elem.seats as number) < 4) || ((elem.seats as number) > 6) || (elem.seats === undefined)){
                   badRequest = true;
               }
               if(elem.id !== undefined){
                if(auxId.length === 0){
                    auxId.push((elem.id as number))
                }else{
                    auxId.forEach( (myId) => {
                        if(myId === (elem.id as number)){
                            badRequest = true;
                        }else{
                            auxId.push(elem.id as number)
                        }
                    })
                }
               }else{
                   badRequest = true;
               }
               const zero: number = 0;
               return {
                ...elem,
                id: elem.id,
                seats: elem.seats,
                client: zero
            }as ICar;
           });

           if(badRequest){
               ctx.response.status = 400;
               ctx.response.body = "Bad Request"
           }else{
            ctx.response.status = 200;
            ctx.response.body = "OK"
            const eraseCollection = await CarCollection.deleteMany({})
            const erasePeopleCollection = await PeopleCollection.deleteMany({})
            const toInsert = await Promise.all(result);
            const newInsert = await CarCollection.insertMany(toInsert)
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
export {putCar};