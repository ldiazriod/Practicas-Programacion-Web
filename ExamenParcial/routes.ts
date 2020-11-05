import { Context, Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import {postClient} from "../ExamenParcial/controllers/postClient.ts";
import {postProduct} from "../ExamenParcial/controllers/postProduct.ts";
import {postInvoice} from "../ExamenParcial/controllers/postInvoice.ts";
const router = new Router();

router.get("/status", (ctx) => {
    try{
        ctx.response.status = 200;
        ctx.response.body = "OK";
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
})

router.get("/", (ctx) =>{
    try{
        ctx.response.body = "Por Luis Díaz del Río."
        ctx.response.body = "Examen Parcial web 2020"
    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
})

router
    .post("/client", postClient)
    .post("/product", postProduct)
    .post("/invoice", postInvoice)

export {router as default}