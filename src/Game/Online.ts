// let online = 0;

import Player from "../Game/Player.ts";

export default class Online {
  private static maxOnline: number
  private static players: Player[] = [];

  static get getOnline(): number {
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

  static setMaxOnline(online: number) {
    this.maxOnline = online
  }

  static get getMaxOnline(): number {
    return this.maxOnline
  }

  // static

  // static setOnline() {
  //     return this.online += 1
  // }
}
