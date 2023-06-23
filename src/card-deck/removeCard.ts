import { Card, Deck } from "./newDeck";

export const removeCard = (deck: Deck, card: Card) =>
  deck.filter((c) => !(c[0] === card[0] && c[1] === card[1]));
