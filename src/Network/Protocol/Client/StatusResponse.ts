import Online from "../../../Game/Online.ts";
import { IWMServer } from "../../../Server.ts";
import ProtocolTypes from "../ProtocolTypes.ts";

export async function StatusResponse(stream: Deno.Conn) {
  const protocol = new ProtocolTypes(stream);
  const response = {
    version: {
      name: "1.19.20",
      protocol: 760,
    },
    players: {
      max: Online.getMaxOnline,
      online: Online.getOnline,
      sample: Online.getPlayersList(20).map((player) => ({
        name: player.username,
        id: player.uuid,
      })),
    },
    description: {
      text: IWMServer.description,
    },
    favicon: IWMServer.description,
    previewsChat: IWMServer.previewsChat,
    enforcesSecureChat: IWMServer.enforcesSecureChat,
  };
  return await protocol.writeBytes([
    0x00,
    ...protocol.writeString(JSON.stringify(response)),
  ]);
}
