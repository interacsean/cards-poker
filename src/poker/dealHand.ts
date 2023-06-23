import { Card, Deck } from "../card-deck/newDeck";
import { dealCards } from "../card-deck/dealCards";

type Deps = {
  dealCards: typeof dealCards;
};

export function makeDealHand(deps: Deps) {
  return function dealHand(deck: Deck) {
    return deps.dealCards(deck, 2) as { deck: Deck; cards: [Card, Card] };
  };
}
