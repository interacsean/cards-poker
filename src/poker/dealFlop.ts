import { Deck } from "../card-deck/newDeck";
import { dealCards } from "../card-deck/dealCards";

type Deps = {
  dealCards: typeof dealCards;
};

export function makeDealFlop(deps: Deps) {
  return function dealFlop(deck: Deck) {
    return deps.dealCards(deck, 3);
  };
}
