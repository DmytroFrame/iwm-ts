import Online from "../../../Game/Online.ts";
import ProtocolTypes from "../ProtocolTypes.ts";

export async function StatusResponse(stream: Deno.Conn) {
  const response = {
    version: {
      name: "1.19.20",
      protocol: 760,
    },
    players: {
      max: 100,
      online: Online.getOnline(),
      sample: Online.getPlayersList(10).map((player) => ({
        name: player.username,
        id: player.uuid,
      })),
    },
    description: {
      text: "Hello world",
    },
    favicon: "data:image/png;base64,<data>",
    previewsChat: true,
    enforcesSecureChat: true,
  };
  const protocol = new ProtocolTypes(stream);
  const arrayBytes: number[] = [];
  arrayBytes.push(0x00);
  arrayBytes.concat(protocol.writeString(JSON.stringify(response)));
  await protocol.writeBytes(arrayBytes);
}
