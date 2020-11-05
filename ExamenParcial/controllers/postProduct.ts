import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import {ProductSchema, IProduct ,IContext} from "../Schemas.ts"

//TODO: Hacer comprobaciones de que los valores del json son correctos

const postProduct = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const productCollection = db.collection<ProductSchema>("ProductCollection")

        const {value: productBody} = ctx.request.body({type: "json"})
        const newProduct: ProductSchema = await productBody;

        if(newProduct){
            const searchProduct = await productCollection.findOne({sku: newProduct.sku});
            if(searchProduct){
                ctx.response.status = 400;
                ctx.response.body = "Bad Request"
            }else{
                ctx.response.status = 200;
                ctx.response.body = "OK"
                const insertProduct = await productCollection.insertOne(newProduct)
            }
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
}


export {postProduct}