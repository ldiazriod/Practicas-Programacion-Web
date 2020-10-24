import {Application} from "http://deno.land/x/oak/mod.ts";
import router from "./routes.ts";

const port = 4200;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () =>{
    console.log(`Listening on: localhost: ${port}`);
})

await app.listen({port});