import NetworkController from "./Network/NetworkController.ts";

export class IWMServer {
  public async listen(port: number) {
    if (port >= 65535 || port < 0) {
      throw new Error("invalid port value, port cannot have more than 65535");
    }
    console.log("Server start on port:", port);

    const listen = Deno.listen({ port, transport: "tcp" });
    for await (const stream of listen) {
      new NetworkController(stream);
    }
  }
}
