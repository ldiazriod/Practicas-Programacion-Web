import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import {InvoiceSchema, IProduct, ClientSchema, ProductSchema ,IContext, ITotalInvoice} from "../Schemas.ts"
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";

const getInvoiceById = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const invoiceCollection = db.collection<InvoiceSchema>("InvoiceCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");
        const productCollection = db.collection<ProductSchema>("ProductCollection");

        const { id } = helpers.getQuery(ctx, {mergeParams: true});

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Server Error: ${e.message}`
    }
}