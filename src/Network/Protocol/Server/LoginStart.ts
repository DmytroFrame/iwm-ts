import ProtocolTypes from "../ProtocolTypes.ts";

export async function LoginStart(stream: Deno.Conn) {
    const protocol = new ProtocolTypes(stream);
    console.log(await protocol.readVarInt())
    console.log(await protocol.readVarInt())
    return {
        name: await protocol.readString(),
        hasSigData: await protocol.readVarInt(),
        HasPlayerUUID: await protocol.readVarInt()	
    //   serverAddress: await protocol.readString(),
    //   serverPort: await protocol.readUnsignedShort(),
    //   nextState: (await protocol.readVarInt()) === 1
    //     ? nextState.Status
    //     : nextState.Login,
    };
  }
  