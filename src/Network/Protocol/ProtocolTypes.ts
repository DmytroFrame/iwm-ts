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

  public writeVarInt(value: number): number[] {
    const buffer: number[] = [];
    while (true) {
      if ((value & ~SEGMENT_BITS) == 0) {
        buffer.push(value);
        break;
      }
      buffer.push((value & SEGMENT_BITS) | CONTINUE_BIT);

      // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
      value >>>= 7;
    }
    return buffer;
  }

  public async writeBytes(array: number[] | Uint8Array) {
    const arrayLengthToBytes = this.writeVarInt(array.length);
    const buffer = new Uint8Array(arrayLengthToBytes.length + array.length);
    buffer.set([...arrayLengthToBytes, ...array]);
    console.log("WRITE:", buffer)
    return await this.stream.write(buffer);
  }

  public writeString(text: string): number[] {
    const decodeText = new TextEncoder().encode(text);
    const textLengthToBytes = this.writeVarInt(decodeText.length);
    return [...textLengthToBytes, ...decodeText];
  }

  public async readSkip(): Promise<void> {
    const length = await this.readVarInt();
    const buffer = new Uint8Array(length)
    await this.stream.read(buffer)
    console.log("SKIP:", buffer)
  }
}
