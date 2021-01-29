import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";

export interface UserSchema{
    _id: {$oid: string}
    email: string
    password: string;
    rol: string;
    coche?: ICoche;
    viajes: IViaje[];
    token?: string
}

export interface IUser{
    email: string;
    password: string;
    rol: string
    coche?: ICoche;
    viajes: IViaje[]
    token?: string;
}

export interface ViajesSchema {
    _id: {$oid: string}
    conductor: IUser
    coche: ICoche
}

export interface CocheSchema {
    _id: {$oid: string}
    conductor: IUser
    matricula: string;
    viajes: IViaje[]
    state: boolean;
}

export interface ConductorSchema{
    email: string
    coche: ICoche
    token?: string
}

export interface IViaje {
    conductor: IUser;
    cliente: IUser;
    coche: ICoche;
}

export interface ICoche{
    matricula: string;
    conductor: IUser;
    state: boolean;
}

export interface IContext {
    db: Database;
    user: IUser;
}








