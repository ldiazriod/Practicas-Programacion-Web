import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { UserSchema,BlogSchema, IContext } from "../mongo/schema.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const Mutation = {
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

    createUser: async(parent: any, args: {input: {email: string, password: string, rol: string[]}}, ctx: IContext): Promise<boolean> => {
        try{
            const db: Database = ctx.db
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            const exist = await UserCollection.findOne({email: args.input.email, password: args.input.password})
            if(!exist){
                if(args.input.rol.length > 4){
                    throw new GQLError("The user has to many rols")
                }else{
                    await UserCollection.insertOne({email: args.input.email, password: args.input.password, rol: args.input.rol})
                    return true;
                }
            }else{
                throw new GQLError("User already exists");
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    deleteUser: async(parent: any, arg: {email: string}, ctx: IContext): Promise<boolean> =>{
        try{
            const db: Database = ctx.db;
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            await UserCollection.deleteOne({email: arg.email});
            return true;
        }catch(e){
            throw new GQLError(e);
        }
    },

    createPost: async(parent: any, args: {input: {tittle: string, body: string}}, ctx: IContext): Promise<boolean> => {
        try{
            const db: Database = ctx.db;
            const PostCollection: Collection<BlogSchema> = db.collection<BlogSchema>("PostCollection");
            const findCopyTittle = await PostCollection.findOne({tittle: args.input.tittle})
            if(!findCopyTittle){
                await PostCollection.insertOne({tittle: args.input.tittle, body: args.input.body, author: ctx.user.email})
                return true;
            }else{
                throw new GQLError("Post already exists");
            }
        }catch(e){
            throw new GQLError(e);
        }
    },

    deletePost: async(parent: any, args: {tittle: string}, ctx: IContext): Promise<boolean> => {
        try{
            const db: Database = ctx.db;
            const PostCollection: Collection<BlogSchema> = db.collection<BlogSchema>("PostCollection");
            const UserCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")
            if(ctx.user.rol.includes("EDITOR")){
                await PostCollection.deleteOne({tittle: args.tittle})
                return true;
            }else{
                const myTask = await PostCollection.findOne({tittle: args.tittle})
                if(myTask){
                    if(myTask.author === ctx.user.email){
                        await PostCollection.deleteOne(myTask)
                        return true;
                    }else{
                        throw new GQLError("You do not have the permision to delete that post")
                    }
                }else{
                    throw new GQLError("Post do not exists")
                }
            }
        }catch(e){
            throw new GQLError(e)
        }
    },
    /*
    createComment: async(parent: any, args: {tittle: string, input: {body: string}}, ctx: IContext): Promise<boolean> =>{
        try{
            const db: Database = ctx.db;
            const PostCollection: Collection<BlogSchema> = db.collection<BlogSchema>("PostCollection")
            const exist = await PostCollection.findOne({tittle: args.tittle});
            if(exist){
                const myComments = exist.comments;
                if(myComments){
                    myComments.push({body: args.input.body, author: ctx.user.email})
                    await PostCollection.updateOne({tittle: args.tittle}, {$set: {comments: myComments}})
                    return true;
                }else{
                    return false;
                }
                
            }else{
                throw new GQLError("Post don't exist")
            }
        }catch(e){
            throw new GQLError(e)
        }
    },
    */
}

export {Mutation};