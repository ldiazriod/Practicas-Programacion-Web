import { fromFileUrl } from "https://deno.land/std@0.69.0/path/win32.ts";
import type {myEpisodes} from "../mySchemas.ts";
import {apiEpisodes} from "../mongoImports.ts";

const mainMenuCharacters = (ctx: any) =>{
    ctx.reponse.body = "Use /episodes to see al episodes in database";
};

const takeEpi = async (ctx: any) =>{
    try{
        const data: myEpisodes[] = await apiEpisodes.find({});
        ctx.response.body = {
            find: true,
            data: data
        };
    }catch(e){
        ctx.reponse.body = {
            find: false,
        };
        console.log("ERROR", e);
    };
};

const takeEpiById = async (ctx: any) =>{
    try{
        let id: string = ctx.params.id;
        const episode: myEpisodes | null = await apiEpisodes.findOne({id: Number(id)});

        if(episode){
            ctx.response.body = {
                find: true,
                data: episode
            };
        }else{
            ctx.response.status = 404;
            ctx.response.body = {
                find: false,
                data: "No episodes found for given ID"
            };
        };
    }catch(e){
        ctx.response.body = null;
        ctx.response.status = 500;
        console.log(e)
    }
};

export {takeEpi, takeEpiById}