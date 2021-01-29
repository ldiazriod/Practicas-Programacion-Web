import {
    Database
  } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
  import {
    GQLError,
  } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
  import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";
  
  import { TaskSchema, UserSchema } from "../mongo/schema.ts";
  
  import {IContext, ITask, IUser} from "../types.ts"
  
  const User = {
    assignee: async (parent: IUser, args: any, ctx: IContext): Promise<ITask[] | null> => {
      const db: Database = ctx.db;
      const TasksCollection = db.collection<TaskSchema>("Tasks"); 
      const tasks = await TasksCollection.find({ assignee: parent.email }); //! Buscamos las tareas asignadas al usuario
      return tasks.map((t) => {
        return { //* Devolvemos las tareas con una función map
          ...t,
          date: t.date.toDateString(),
        };
      });
    },
  
    reporter: async (parent: IUser, args: any, ctx: IContext): Promise<ITask[] | null> => {
      const db: Database = ctx.db;
      const TasksCollection = db.collection<TaskSchema>("Tasks");
      const tasks = await TasksCollection.find({ reporter: parent.email }); //!Igual que en assignee
      return tasks.map((t) => {
        return {
          ...t,
          date: t.date.toDateString(),
        };
      });
    },
  };
  
  export {User}