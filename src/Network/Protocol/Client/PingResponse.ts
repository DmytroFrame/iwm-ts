export async function PingResponse(stream: Deno.Conn) {
  const buffer = new Uint8Array([9, 1, 0, 0, 0, 0, 0, 212, 237, 81]);
  return await stream.write(buffer);
}
