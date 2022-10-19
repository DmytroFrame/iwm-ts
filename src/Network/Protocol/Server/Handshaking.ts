import ProtocolTypes from "../ProtocolTypes.ts";

export async function Handshaking(stream: Deno.Conn) {
  const protocol = new ProtocolTypes(stream);
  const handshaking = {
    protocolVersion: await protocol.readVarInt(),
    serverAddress: await protocol.readString(),
    serverPort: await protocol.readUnsignedShort(),
    nextState: await protocol.readVarInt(),
  };
  console.log(handshaking);
  return handshaking;
}
