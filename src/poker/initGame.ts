import { dealCards } from "../card-deck/dealCards";
import { newDeck } from "../card-deck/newDeck";
import { removeCard } from "../card-deck/removeCard";
import { shuffle } from "../card-deck/shuffle";
import { makeGameLoop } from "./gameLoop";
import { makeNewGame } from "./newGame";
import { newPlayer } from "./newPlayer";

type Deps = {
  getUserInput: (prompt: string) => Promise<string>;
  newDeck: typeof newDeck;
  shuffle: typeof shuffle;
  dealCards: typeof dealCards;
  removeCard: typeof removeCard;
  print: (output: string) => void;
};

export function makeInitGame({
  getUserInput,
  newDeck,
  shuffle,
  ...deps
}: Deps) {
  const gameLoop = makeGameLoop({ getUserInput, newDeck, shuffle, ...deps });
  return async function initGame() {
    const numPlayers = (await getUserInput("How many players [2]? ")) || "2";

    const players = Array(parseInt(numPlayers, 10))
      .fill("")
      .map((_, i) => newPlayer(`Player ${i + 1}`));

    const game = makeNewGame({ newDeck, shuffle })(players);

    return gameLoop(game);
  };
}
