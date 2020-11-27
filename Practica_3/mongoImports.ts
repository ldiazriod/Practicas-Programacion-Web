import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import type {ITask} from "../Practica_3/Schemas.ts";

const DB_URL = Deno.env.get("DB_URL");
const DB_NAME = Deno.env.get("DB_NAME");

if(!DB_URL || !DB_NAME){
    throw new Error("DB_URL or DB_NAME is not defined");
}

const client = new MongoClient();
client.connectWithUri(DB_URL);
const db = client.database(DB_NAME);

export const taskCollection = db.collection<ITask>("MyTasks");
