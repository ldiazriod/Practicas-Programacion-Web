import type { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";

export interface CarsSchema {
    _id:    {$oid: string};
    id:     number;
    seats:  number;
    client: number | undefined;
}

export interface ICar{
    id:     number;
    seats:  number;
    client: number | undefined;
}

export interface PeopleSchema {
    _id: {$oid: string};
    id: number;
    people: number;
}

export interface IPeople{
    id:     number;
    people: number;
}


export type IContext = Context<Record<string, any>>;