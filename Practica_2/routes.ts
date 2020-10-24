import {Router} from "http://deno.land/x/oak/mod.ts";
import {mainApi} from "../NewServer/src/mainApi.ts";
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import {takeChar, takeCharById, deleteCharById, switchStatus} from "../NewServer/src/newCharacters.ts";
import {takeEpi, takeEpiById} from "../NewServer/src/newEpisode.ts";
import {takeLoc, takeLocById} from "../NewServer/src/newLocation.ts";

const router = new Router();
router.get("/", mainApi);

router
    .get("/characters", takeChar)
    .get("/characters/:id", takeCharById)
    .put("/switchstatus/:id", switchStatus)

router
    .get("/episodes", takeEpi)
    .get("/episodes/:id", takeEpiById)

router
    .get("/locations", takeLoc)
    .get("/locations/:id", takeLocById)

router
    .delete("/characters/:id", deleteCharById)

router
    .get("/status", (ctx) =>{
        ctx.response.body = {
            Status: 200,
            Body: "Ok"
        }
    })


export default router;