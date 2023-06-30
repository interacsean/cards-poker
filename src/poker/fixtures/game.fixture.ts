import { newDeck } from "../../card-deck/newDeck";
import { shuffle } from "../../card-deck/shuffle";
import { Game, makeNewGame } from "../newGame";
import { newPlayer } from "../newPlayer";

export const game: Game = makeNewGame({ shuffle, newDeck })(
  [
    newPlayer('Player 1', 100),
    newPlayer('Player 2', 100),
    newPlayer('Player 3', 100),
    newPlayer('Player 4', 100),
  ]
);
