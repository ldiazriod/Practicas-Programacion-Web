import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import {InvoiceSchema, IProducts, ClientSchema, ProductSchema ,IContext} from "../Schemas.ts"

const postInvoice = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const invoiceCollection = db.collection<InvoiceSchema>("InvoiceCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");
        const productCollection = db.collection<ProductSchema>("ProductCollection");

        const {value: invoiceBody} = ctx.request.body({type: "json"});
        const newInvoice: InvoiceSchema = await invoiceBody;
        let badRequest: boolean = false;

        if(newInvoice){
            const searchCif = await clientCollection.findOne({cif: newInvoice.clientCIF})
            if(searchCif){
                const search = newInvoice.products.map((elem) =>{
                    if(elem.amount < 0){
                        badRequest = true;
                    }
                    return{
                        ...elem,
                        sku: elem.sku,
                        amount: elem.amount
                    }as IProducts
                })
                const find = await Promise.all(search);
                if(badRequest){
                    ctx.response.status = 400;
                    ctx.response.body = "Bad request"
                }else{
                    const insert = await invoiceCollection.insertOne(newInvoice)
                    ctx.response.status = 202;
                    ctx.response.body = `The invoice with id: ${insert.$oid} has been accepted`
                }
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Not Found"
            }
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Not Found"
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
}


export {postInvoice}