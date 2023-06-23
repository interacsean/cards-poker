import { Deck } from "./newDeck";

export const dealCards = (deck: Deck, num: number = 1) => ({
  deck: deck.slice(num),
  cards: deck.slice(0, num),
});
