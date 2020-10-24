import type {myLocations} from "../mySchemas.ts";
import { apiLocations } from "../mongoImports.ts";

const mainApiLoc = (ctx: any) => {
    ctx.response.body = "USe /locations to see al locations";
};

const takeLoc = async (ctx: any) =>{
    try{
        const data: myLocations[] = await apiLocations.find({});
        ctx.response.body = {
            find: true,
            data: data
        }
    }catch(e){
        ctx.response.body = {
            find: false,
        }
        console.log("ERROR", e);
    };
};

const takeLocById = async (ctx: any) => {
    try{
        let id: string = ctx.params.id;
        const location: myLocations | null = await apiLocations.findOne({id: Number(id)});
    if (location) {
        ctx.response.body = {
          success: true,
          data: location,
        };
      } else {
        ctx.response.status = 404;
        ctx.response.body = {
          success: false,
          data: "No location found for given ID",
        };
      }
    }catch(e) {
        ctx.response.body = null;
        ctx.response.status = 500
        console.log(e);
      }
};

export {takeLoc, takeLocById}
