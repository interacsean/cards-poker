import { Game } from "./newGame";
import { playerMakeBet } from "./playerMakeBet";

export function takeBlinds(game: Game): Game {
  const sbPlayer = (game.button + 1) % game.players.length;
  const bbPlayer = (game.button + 2) % game.players.length;
  const newPlayers = [...game.players];
  // todo: check if they have the chips
  newPlayers[sbPlayer] = playerMakeBet(game.players[sbPlayer], game.blinds[0]);
  newPlayers[bbPlayer] = playerMakeBet(game.players[bbPlayer], game.blinds[1]);
  return {
    ...game,
    players: newPlayers,
  };
}
