import type { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";

export interface ClientSchema {
    _id?:    {$oid: string};
    cif:     string;
    name:    string;
    address: string;
    mail:    string;
}

export interface IClient {
    cif: string;
    name: string;
    address: string;
    mail: string;
}

export interface ProductSchema {
    _id?: {$oid: string};
    sku: string;
    name: string;
    price: number 
}

export interface IProduct{
    sku: string;
    name: string;
    price: number;
}

export interface InvoiceSchema {
    _id?: {$oid: string}
    clientCIF: string;
    products: IProducts[];
}

export interface IInvoice {
    clientCIF: string;
    products: IProducTotal[];
}

export interface ITotalInvoice{
    client: IClient;
    products: IProducTotal[]
    totalPrice: number;
}

export interface IProducts {
    sku: string;
    amount: number;
}

interface IProducTotal{
    sku: string;
    amount: number
    totalPrice: number;
}


export type IContext = Context<Record<string, any>>;