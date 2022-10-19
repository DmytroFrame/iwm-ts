const SEGMENT_BITS = 0x7f;
const CONTINUE_BIT = 0x80;

export default class ProtocolTypes {
  private stream: Deno.Conn;

  constructor(stream: Deno.Conn) {
    this.stream = stream;
  }

  private async readBytes(size = 1): Promise<Uint8Array> {
    const buffer = new Uint8Array(size);
    await this.stream.read(buffer);
    return buffer;
  }

  public async readVarInt() {
    let value = 0;
    let position = 0;
    let currentByte = 0;

    while (true) {
      currentByte = (await this.readBytes())[0];

      value |= (currentByte & SEGMENT_BITS) << position;
      if ((currentByte & CONTINUE_BIT) == 0) break;
      position += 7;

      if (position >= 32) throw new Error("VarInt is too big");
    }
    return value;
  }

  public async readUnsignedShort() {
    const buffer = await this.readBytes(2);
    return (((buffer[0] << 8) | buffer[1]) << 16) >> 16;
  }

  public async readString() {
    const length = await this.readVarInt();
    return new TextDecoder().decode(await this.readBytes(length));
  }
}
