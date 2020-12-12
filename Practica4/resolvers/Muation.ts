import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { graphql, GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { TaskSchema, UserSchema} from "../mongo/SChema.ts";
import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";

interface IAddTaskArgs {
    task: {
      id: string;
      name: string;
      description: string;
      year: number;
      month: number;
      day: number;
      status: string;
      assignee_mail: string;
      reporter_mail: string;
    }
  }
  
  interface IUpdateTaskArgs {
    task: {
      id: string;
      name: string;
      description: string;
      year: number;
      month: number;
      day: number;
      status: string;
    };
  }
  
  interface IRemoveTaskArgs {
    id: string
  }
  
  interface IContext {
    db: Database
  }
  
  interface ITask{
    id: string,
    name: string,
    description?: string,
    status: string,
    date: string,
  }
  
  interface IAddUserArgs{
    email: string,
    password: string,
  }
  
  const Mutation = {
    addTask: async (parent: any, args: IAddTaskArgs, ctx: IContext): Promise<Boolean> => {
      try {
        console.log("Estoy aquí");
        const db: Database = ctx.db;
        const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Tasks");
  
        console.log(`id: ${args.task.id}`);
        const found = await tasksCollection.findOne({ id: args.task.id });
        if (found) throw new GQLError("task with id already in DB");
  
        const { name, description, id, status, year, day, month, assignee_mail, reporter_mail } = args.task;
        const task = {
          name,
          description,
          id,
          status,
          date: new Date(year, month, day),
          assignee_mail,
          reporter_mail,
        };
        await tasksCollection.insertOne(task);
        return true;
      } catch (e) {
        throw new GQLError(e);
      }
    },

    signIn: async (parent: any, args: IAddUserArgs, ctx: IContext):Promise<Boolean> =>{
        try{
            const db: Database = ctx.db;
            const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>("Users")

            const findUser = await UsersCollection.findOne({email: args.email});
            if(findUser) throw new GQLError("User already exist")
            await UsersCollection.insertOne({email: args.email, password: args.password})
            return true;
        }catch (e){
            throw new GQLError(e);
        }
    },

    removeTask: async (parent: any, args: IRemoveTaskArgs, ctx: IContext): Promise<Boolean> => {
      try {
        const db: Database = ctx.db;
        const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Tasks");
        await tasksCollection.deleteOne({ id: args.id });
        return true;
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    updateTask: async (parent: any, args: IUpdateTaskArgs, ctx: IContext): Promise<Boolean> => {
      try {
        const db: Database = ctx.db;
        const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Tasks");
  
        const found = await tasksCollection.find({ id: args.task.id });
        if (!found) throw new GQLError("task with id does not exist");
  
        const { name, description, id, status, year, day, month } = args.task;
        const task = {
          name,
          description,
          id,
          status,
          date: new Date(year, month, day),
        };
  
        await tasksCollection.updateOne({ id: args.task.id }, task);
        return true;
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    completeTask: async (parents: any, args: { id: string }, ctx: IContext) => {
      try {
        const db: Database = ctx.db;
        const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Tasks");
  
        const found = await tasksCollection.findOne({ id: args.id });
        if (!found) throw GQLError("Task with id not found");
  
        await tasksCollection.updateOne({ id: args.id }, { status: "DONE" });
        return true;
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    startTask: async (parent: any, args: { id: string }, ctx: IContext) => {
      try {
        const db: Database = ctx.db;
        const tasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Tasks");
  
        const found = await tasksCollection.findOne({ id: args.id });
        if (!found) throw GQLError("Task with id not found");
  
        await tasksCollection.updateOne({ id: args.id }, { status: "DOING" });
        return true;
      } catch (e) {
        throw new GQLError(e);
      }
    },

    deleteAccount: async (parent: any, args: {}, ctx: IContext) => {
        try{
            const db: Database = ctx.db
            const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>("Users")
            const deleteUser = await UsersCollection.deleteOne({in: true})
            if(deleteUser){
                return true;
            }else{
                return false;
            }
        }catch(e){
            throw new GQLError(e)
        }
    },

    logOut: async (parent: any, args: any, ctx: IContext ) => {
        try{
            const db: Database = ctx.db;
            const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>("Users")
            const {matchedCount}  = await UsersCollection.updateOne({in: true }, {$set: {token: null, in: false}})
            if(matchedCount){
                return true;
            }
            return false;
        }catch(e){
            throw new GQLError(e)
        }
    },
    
    logIn: async (parent: any, args: IAddUserArgs, ctx: IContext | any) =>{
      try{
          const db: Database = ctx.db;
          const UsersCollection = db.collection<UserSchema>("Users");
          const findUser = await UsersCollection.findOne({email: args.email, password: args.password});

          if(findUser){
              let result = "";
              const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
              const charactersLength = characters.length;
              for(let i = 0; i < charactersLength; i++){
                  result += characters.charAt(Math.floor(Math.random() * charactersLength))
              }
              const addToken = await UsersCollection.updateOne({email: args.email, password: args.password}, {$set:{token: result, in: true}})
              return result;
          }else{
              throw new GQLError("The user does not exist or the information provide is wrong")
          }
      }catch(e){
          throw new GQLError(e)
      }
    },
  };
  
  export {Mutation }