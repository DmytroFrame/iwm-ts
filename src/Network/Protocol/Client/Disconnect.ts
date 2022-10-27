import ProtocolTypes from "../ProtocolTypes.ts";

export async function Disconnect(stream: Deno.Conn, message: string) {
  const protocol = new ProtocolTypes(stream);
  const response = {
    text: message,
  };
  return await protocol.writeBytes([
    0x00,
    ...protocol.writeString(JSON.stringify(response)),
  ]);
}
