import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

import {IContext, UserSchema, IUser, CocheSchema} from "../mongo/schemas.ts"
import { ChainBuilderPromise } from "https://deno.land/x/mongo@v0.12.1/ts/types.ts";

const Mutation = {
    sigUp: async(parent: any, args: {email: string, licencia: string, password: string}, ctx: IContext): Promise<boolean> =>{
        try{
            const db: Database = ctx.db;
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection");
            const userExists = await UserCollection.findOne({email: args.email, password: args.password})
            if(!userExists){
                await UserCollection.insertOne({email: args.email, rol: args.licencia.toUpperCase(), password: args.password})
                return true;
            }else{
                throw new GQLError("El usuario ya existe")
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    logIn: async(parent: any, args: {email: string; password: string}, ctx: IContext): Promise<string> => {
        try{
            const db: Database = ctx.db;
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const exist = await UserCollection.findOne({email: args.email, password: args.password});
            if(exist){
                const token = v4.generate();
                await ctx.db.collection<UserSchema>("UserCollection").updateOne({email: args.email}, {$set: {token}});
                return token;
            }else{
                throw new GQLError("User and password do not match");
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    logOut: async(parent: any, args: {}, ctx: IContext): Promise<Boolean> =>{
        try{
            const db: Database = ctx.db;
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const exist = await UserCollection.findOne({email: ctx.user.email, token: ctx.user.token})
            if(exist){
                UserCollection.updateOne({email: ctx.user.email}, {$set: {token: ""}})
                return true;
            }else{
                throw new GQLError("Unexpected error")
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    newCar: async(parent: any, args: {matricula: string}, ctx: IContext): Promise<boolean> => {
        try{
            const db: Database = ctx.db;
            const CarCollection: Collection<CocheSchema> = db.collection<CocheSchema>("CarCollection")
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection");
            const exist = await CarCollection.findOne({matricula: args.matricula})
            const findUser = await UserCollection.findOne({token: ctx.user.token})
            if(!exist){
                if(findUser){
                    await CarCollection.insertOne({matricula: args.matricula, conductor: findUser, state: false})
                    await UserCollection.updateOne({token: ctx.user.token}, {$set:{coche: {matricula: args.matricula, state: false, conductor: findUser } }})
                    return true;
                }else{
                    throw new GQLError("User do not exists or is not log")
                }
            }else{
                throw new GQLError("Car already exists")
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    changeStateOfCar: async(parent: any, args: {}, ctx: IContext): Promise<boolean> => {
        try{
            const db: Database = ctx.db;
            const CarCollection: Collection<CocheSchema> = db.collection<CocheSchema>("CarCollection")
            const carStatus = await CarCollection.findOne({conductor: ctx.user})
            if(carStatus){
                if(carStatus.state === true){
                    await CarCollection.updateOne({conductor: ctx.user}, {$set:{state: false}})
                    return true;
                }else{
                    await CarCollection.updateOne({conductor: ctx.user}, {$set:{state: true}})
                    return true;
                }
            }else{
                throw new GQLError("whe can not find the car")
            }

        }catch(e){
            throw new GQLError(e);
        }
    }
    
}

export {Mutation}