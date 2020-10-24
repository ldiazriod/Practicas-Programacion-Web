import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import type {myCharacters, myEpisodes, myLocations} from "../NewServer/mySchemas.ts";

const DB_URL = Deno.env.get("DB_URL");
const DB_NAME = Deno.env.get("DB_NAME");

if(!DB_URL || !DB_NAME){
    throw new Error("DB_URL or DB_NAME is not defined");
}

const client = new MongoClient();
client.connectWithUri("mongodb+srv://ldiazriod:nebrija@web-luis.4vdzr.gcp.mongodb.net/luis-web?retryWrites=true&w=majority");
const db = client.database("MyOwnRickAndMortyApi");

export const apiCharacters = db.collection<myCharacters>("Characters");
export const apiEpisodes = db.collection<myEpisodes>("Episodes");
export const apiLocations = db.collection<myLocations>("Locations");