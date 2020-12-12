/*
import {
    Collection,
    Database
  } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
  import {
    GQLError,
  } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
  import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

  import {TaskSchema, UserSchema} from "../mongo/SChema.ts"

  interface IContext {
      db: Database
  }

  interface ITask{
    id: string,
    name: string,
    description: string,
    year: number,
    date: string,
    assignee_mail: string,
    reporter_mail: string,
  }

  interface IUser{
     email: string,
     password: string,
     assignee: ITask[],
     reporter: ITask[],
  }

  const users: IUser[] = []
  const tasks: ITask[] = []

  const UserTask = {
      assignee: async (parent: {assignee: ITask[]}) => {
          return parent.assignee.map(assigTask => users.find(usr => usr.email === assigTask.assignee_mail))
      },
      reporter: async (parent: {reporter: ITask[]}, args: any, ctx: IContext) => {
          const db: Database = ctx.db;


      }
  }
  */