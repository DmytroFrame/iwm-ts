import Online from "./Game/Online.ts";
import NetworkController from "./Network/NetworkController.ts";

export interface IWMServerInit {
  maxOnline?: number;
  description?: string;
  favicon?: string;
  previewsChat?: boolean;
  enforcesSecureChat?: boolean;
}

export class IWMServer {
  static description: string;
  static favicon: string;
  static previewsChat: boolean;
  static enforcesSecureChat: boolean;

  constructor(options?: IWMServerInit) {
    Online.setMaxOnline(options?.maxOnline || 100);
    IWMServer.description = options?.description || "Power by iWM Server.";
    IWMServer.favicon = options?.favicon || "data:image/png;base64,<data>";
    IWMServer.previewsChat = options?.previewsChat || true;
    IWMServer.enforcesSecureChat = options?.enforcesSecureChat || true;
  }

  public async listen(port: number) {
    if (port >= 65535 || port < 0) {
      throw new Error("invalid port value, port cannot have more than 65535");
    }
    console.log("Server start on port:", port);

    const listen = Deno.listen({ port, transport: "tcp" });
    try {
      for await (const stream of listen) {
        new NetworkController(stream);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
