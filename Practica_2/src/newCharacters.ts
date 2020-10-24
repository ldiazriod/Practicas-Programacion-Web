import type {myCharacters} from "../mySchemas.ts";
import {apiCharacters} from "../mongoImports.ts";

//TODO: Pasar de ID a nombre episodio
//TODO: Eliminar _id


const takeChar = async (ctx: any) => {
    try{
        const data: myCharacters[] = await apiCharacters.find({});
        ctx.response.status = 200;
        ctx.response.body = {
            find: true,
            Body: data
        }
    }catch(e){
        ctx.body = {
            find: false,
        }
        console.log("Not find, ERROR: ", e);
    };
};

const switchStatus = async (ctx: any) => {
    const id: string = ctx.params.id;
       let searchCharacter: any = await apiCharacters.findOne({"id": Number(id)})
       if(searchCharacter.status){
           if(searchCharacter.status === "Alive"){
               searchCharacter.status = "Dead"
           }else if(searchCharacter.status === "Dead"){
               searchCharacter.status = "Alive"
           }else{
               ctx.response.body = {
                   Body: "Unknown status"
               }
           }
       }

       const {matchedCount} = await apiCharacters.updateOne({id: Number(id)}, {$set: {status: searchCharacter.status}})
       if(matchedCount){
           ctx.response.status = 200
           ctx.response.body = {
               find: true,
               Body: "The character has been updated"
           }
           return;
       }else{
           ctx.response.body = {
               find: false,
               data: "Character not found"
           }
           ctx.response.status = 404
       }
       
}


const takeCharById = async (ctx: any) => {
    try{
        let id: string = ctx.params.id;
        const newChar: myCharacters | null = await apiCharacters.findOne({id: Number(id)}); 
        const aux: number[] = []
        if(newChar){
            ctx.response.status = 200;
            ctx.response.body = {
                find: true,
                data: newChar
            }
            
        }else{
            ctx.response.status = 404;
            ctx.response.body = {
                find: false,
                data: "Character not found"
            };
        }
    }catch(e){
        ctx.response.body = null;
        ctx.response.status = 500;
        console.log(e);
    };
};

const deleteCharById = async (ctx: any) =>{
    let id = ctx.params.id;
    const delCharacter = await apiCharacters.deleteOne({id: Number(id)});

    if(delCharacter === 1){
        ctx.response.status = 200;
        ctx.response.body = {
            find: true,
            Body: "OK"
        }
    }else{
        ctx.response.status = 404;
        ctx.response.body = {
            find: false,
            data: "No found"
        }
    }
}


const postChar = async (ctx: any) => {
    console.log("post character")
    if(!ctx.request.hasBody){
        ctx.response.status = 404;
        ctx.response.body = {
            find: false,
            data: "No ID found"
        };
    }
    const body = ctx.request.body();
    let char: Partial<myCharacters> | undefined;
}


export {takeChar, takeCharById, deleteCharById, switchStatus}