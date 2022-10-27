import { IWMServer } from "./src/Server.ts";

const server = new IWMServer({
    maxOnline: 3,
})
await server.listen(4000)
