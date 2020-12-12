import {
    Collection,
    Database
  } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
  import {
    GQLError,
  } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
  import { graphql, GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import {TaskSchema, UserSchema} from "../mongo/SChema.ts";
import { info } from "https://deno.land/std@0.69.0/log/mod.ts";
import { readHeaders } from "https://deno.land/x/oak@v6.3.1/headers.ts";
import { httpErrors } from "https://deno.land/x/oak@v6.3.1/httpError.ts";
import { Context } from "https://deno.land/x/oak@v6.3.1/context.ts";

interface IGetTaskArgs {
    id: string;
  }
  
  interface IGetTaskByStatusArgs {
    status: string;
  }
  
  interface IGetTaskByDateArgs {
    year: number;
    month: number;
    day: number;
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
    reporter: string,
    assignee: string,
  }


  const Query = {
    getTask: async (parent: any, args: IGetTaskArgs, ctx: IContext): Promise<ITask | null> => {
      try {
        const db: Database = ctx.db;
        const tasks = db.collection<TaskSchema>("Tasks");
        const task: TaskSchema | null = await tasks.findOne({ id: args.id });
  
        let date: string;
        if (task) {
          date = task.date.toString();
          return {
            ...task,
            date,
          };
        }
  
        return null;
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    getTasks: async (parent: any, args: any, ctx: IContext) => {
      try {
        const db: Database = ctx.db;
        const tasksCollection = db.collection<TaskSchema>("Tasks");
        const tasks = await tasksCollection.find();
        const result = tasks.map((t) => {
          return {
            ...t,
            date: t.date.toString(),
          };
        });
        return result;
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    getTaskByStatus: async (
      parent: any,
      args: IGetTaskByStatusArgs,
      ctx: IContext
    ) => {
      try {
        if (!["TODO", "DOING", "DONE"].includes(args.status)) {
          throw new GQLError("Incorrect status");
        }
  
        const db: Database = ctx.db;
        const tasksCollection = db.collection<TaskSchema>("Tasks");
        const tasks = await tasksCollection.find({ status: args.status });
  
        return tasks.map((t) => {
          return {
            ...t,
            date: t.date.toString(),
          };
        });
      } catch (e) {
        throw new GQLError(e);
      }
    },
  
    getTaskByDate: async (
      parent: any,
      args: IGetTaskByDateArgs,
      ctx: IContext
    ) => {
      try {
        const db: Database = ctx.db;
        const tasksCollection = db.collection<TaskSchema>("Tasks");
        const { year, month, day } = args;
        const upToDate = new Date("2021-11-09 23:00:00.000Z");
        const tasks = await tasksCollection.find({
          date: { $lte: new Date("2021-11-09 23:00:00.000Z") },
        });
  
        return tasks.map((t) => {
          return {
            ...t,
            date: t.date.toString(),
          };
        });
      } catch (e) {
        throw new GQLError(e);
      }
    },
    getMyTasks: async (parent: any, args: any, ctx: IContext) => {
      const db: Database = ctx.db
      const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>("Users")
      const TasksCollection: Collection<TaskSchema> = db.collection<TaskSchema>("Task")

      const findLogUser = await UsersCollection.findOne({in: true})
      if(findLogUser){
        const findAllUserTask = await TasksCollection.find({reporter: findLogUser.email})
        return findAllUserTask;
      }else{
        throw new GQLError("Usuario no logeado o encontrado")
      }
    }
  };
  
  export {Query}