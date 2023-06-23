import { Card, Deck } from "../card-deck/newDeck";
import { shuffle } from "../card-deck/shuffle";
import { Player } from "./newPlayer";

export type Game = {
  players: Player[];
  communityCards: Card[];
  deck: Deck;
  button: number;
  blinds: [number, number];
};

type Deps = {
  newDeck: Deck;
  shuffle: typeof shuffle;
};

export function makeNewGame(deps: Deps) {
  return function newGame(
    players: Player[],
    startingPlayer: number | null = null
  ): Game {
    return {
      players,
      communityCards: [],
      button: startingPlayer ?? 0,
      deck: shuffle(deps.newDeck),
      blinds: [0.25, 0.5],
    };
  };
}
