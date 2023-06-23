import { dealCards } from "./card-deck/dealCards";
import { newDeck } from "./card-deck/newDeck";
import { removeCard } from "./card-deck/removeCard";
import { shuffle } from "./card-deck/shuffle";
import { getUserInput } from "./cli/getUserInput";
import { print } from "./cli/print";
import { makeInitGame } from "./poker/initGame";

const initGame = makeInitGame({
  getUserInput,
  dealCards,
  newDeck,
  removeCard,
  shuffle,
  print,
});
initGame();
