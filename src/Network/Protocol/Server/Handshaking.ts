import ProtocolTypes from "../ProtocolTypes.ts";

export enum nextState {
  Status = 1,
  Login = 2,
}

export async function Handshaking(stream: Deno.Conn) {
  const protocol = new ProtocolTypes(stream);
  return {
    protocolVersion: await protocol.readVarInt(),
    serverAddress: await protocol.readString(),
    serverPort: await protocol.readUnsignedShort(),
    nextState: (await protocol.readVarInt()) === 1
      ? nextState.Status
      : nextState.Login,
  };
}
