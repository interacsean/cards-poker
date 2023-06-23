import { Player, PlayerHandStatus } from "./newPlayer";

export function playerMakeBet(player: Player, bet: number) {
  return {
    ...player,
    stack: player.stack - bet,
    currentHand: {
      ...(player.currentHand || { handStatus: PlayerHandStatus.PREDEAL }),
      hand: null,
      bet: (player.currentHand?.bet || 0) + bet,
    },
  };
}
