## Como lanzar el servidor Deno

deno run --allow-net --allow-env --allow-read --allow-write --allow-plugin --unstable app.ts

Tambien se puede utilizar:

-  Con --allow--all añades diractamente todos los --allow de antes.

deno run --allow-all --unstable app.ts 

- Con --watch no hace falta que lanzes el servidor cada vez que cambies algo

deno run --allow-all --watch --unstable app.ts

deno run --allow-net --allow-env --allow-read --allow-write --allow-plugin --watch --unstable app.ts

## Puerto donde esta escuchando el playground de GraphQL

http://localhost:4000/graphql
