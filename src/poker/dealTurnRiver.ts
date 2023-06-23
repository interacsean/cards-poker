import { Card, Deck } from "../card-deck/newDeck";
import { dealCards } from "../card-deck/dealCards";

type Deps = {
  dealCards: typeof dealCards;
};

export function makeDealTurnRiver(deps: Deps) {
  return function dealTurnRiver(communityCards: Card[], deck: Deck) {
    const { deck: newDeck, cards } = deps.dealCards(deck, 1);
    return {
      deck: newDeck,
      cards: communityCards.concat(cards),
    };
  };
}
