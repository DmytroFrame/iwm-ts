import ProtocolTypes from "../ProtocolTypes.ts";

export async function Skiplisten(stream: Deno.Conn) {
  const protocol = new ProtocolTypes(stream);
  return await protocol.readSkip();
}
