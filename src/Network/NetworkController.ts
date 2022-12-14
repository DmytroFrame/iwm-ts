import Player from "../Game/Player.ts";
import Online from "../Game/Online.ts";
import { Handshaking, nextState } from "./Protocol/Server/Handshaking.ts";
import { StatusResponse } from "./Protocol/Client/StatusResponse.ts";
import { Skiplisten } from "./Protocol/Client/Skiplisten.ts";
import { Disconnect } from "./Protocol/Client/Disconnect.ts";
import { PingResponse } from "./Protocol/Client/PingResponse.ts";
import { LoginStart } from "./Protocol/Server/LoginStart.ts";

export default class NetworkController {
  private stream: Deno.Conn;
  private fistByte = -1;
  private lastByte = -1;

  public constructor(stream: Deno.Conn) {
    this.stream = stream;
    this.controller();
  }

  private async controller() {
    console.log("\nConnect from: ", this.stream.remoteAddr);
    await this.readFirstBytes();

    switch (this.lastByte) {
      case 0:
        console.clear()
        await this.routeHandshaking();
        break;

      case 69:
        await this.routeWebPing();
        break;

      default:
        await this.routeDefault();
        break;
    }
    this.closeClient();
  }

  private async routeHandshaking() {
    console.log("This from Minecraft Client");
    const handshaking = await Handshaking(this.stream);
    console.log(handshaking);
    if (handshaking.nextState === nextState.Status) {
      await Skiplisten(this.stream);
      await StatusResponse(this.stream);
      await Skiplisten(this.stream);
      await PingResponse(this.stream)
      return
    }
    if (Online.getOnline >= Online.getMaxOnline) {
      await Disconnect(this.stream, `Sory but server is full!`);
      return;
    }
     
    Online.addPlayer(new Player("usesrs"));
    // console.log(await LoginStart(this.stream))
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
    await Skiplisten(this.stream);
      
    
  }

  private async routeWebPing() {
    console.log("This ping from Web Browser");
    await this.stream.read(new Uint8Array(1000));
    const content = JSON.stringify({
      max: Online.getMaxOnline,
      online: Online.getOnline,
      players: Online.getPlayersList(30),
    });
    const response = `HTTP/1.1 200 OK\r\nContent-Length: ${content.length}\r\nContent-Type: application/json; charset=utf-8\r\nAccess-Control-Allow-Origin: *\r\nX-Powered-By: iWM Server\r\n\r\n${content}`;
    await this.stream.write(new TextEncoder().encode(response));
  }

  private async routeDefault() {
    console.log("This Any, i don't know wat is?");
    const buffer = new Uint8Array(200);
    buffer.set([this.fistByte, this.lastByte]);
    await this.stream.read(buffer);

    if (buffer[0] == 250 && buffer[1] == 0) {
      console.log(
        "I know, this ping service.",
        new TextDecoder().decode(buffer)
      );
    } else {
      console.log(buffer, new TextDecoder().decode(buffer));
    }
  }

  private async readFirstBytes() {
    const buffer = new Uint8Array(2);
    if ((await this.stream.read(buffer)) == 0) {
      return this.closeClient();
    }
    this.fistByte = buffer[0];
    this.lastByte = buffer[1];
  }

  private closeClient() {
    console.log("Close connect from: ", this.stream.remoteAddr);
    this.stream.close();
  }
}
