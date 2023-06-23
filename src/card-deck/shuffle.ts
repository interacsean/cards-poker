import { Deck } from "./newDeck";

export const shuffle = (deck: Deck) => {
  const newDeck = [...deck];
  for (var x = newDeck.length - 1; x > 0; x--) {
    var y = Math.floor(Math.random() * x);
    var temp = newDeck[x];
    newDeck[x] = newDeck[y];
    newDeck[y] = temp;
  }
  return newDeck;
};
