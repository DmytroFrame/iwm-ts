// let online = 0;

import Player from "../Game/Player.ts";

export default class Online {
  private static players: Player[] = [];

  static getOnline(): number {
    return this.players.length;
  }

  static getPlayersList(count: number): Player[] {
    if (count > this.players.length) {
      count = this.players.length;
    }

    return this.players
      .slice(0, count)
      .map(
        (player) => ({
          username: player.username,
          uuid: player.uuid,
          id: player.id,
        } as Player),
      );
  }

  static addPlayer(player: Player) {
    return this.players.push(player);
  }

  // static

  // static setOnline() {
  //     return this.online += 1
  // }
}
