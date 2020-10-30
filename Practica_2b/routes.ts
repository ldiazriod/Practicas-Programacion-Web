import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { putCar } from "../Practica_2b/controllers/putCars.ts"
import { postJourney } from "../Practica_2b/controllers/postJourney.ts";
import { postDropOffId } from "../Practica_2b/controllers/postDropOffById.ts";
import { postLocateById } from "../Practica_2b/controllers/postLocateById.ts";

const router = new Router();

const status = (ctx: any) => {
    try{
        ctx.response.status = 200;
        ctx.response.body = "OK";
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = "Server Error";
    }
}

router
    .get("/status", status)
router
    .put("/cars", putCar);
router
    .post("/journey", postJourney);
router 
    .post("/dropoff/:id", postDropOffId);
router
    .post("/locate/:id", postLocateById);
    
export {router as default};