import NetworkStream from "./Network/NetworkStream.ts";

async function bootsrap() {
  const port = 4000;
  console.log("Server start on port:", port)

  const listen = Deno.listen({ port, transport: "tcp" });
  for await (const stream of listen) {
    new NetworkStream(stream);
  }
}

bootsrap();
