import { calcPot } from "./calcPot";
import { Game } from "./newGame";
import { Player, PlayerHandStatus } from "./newPlayer";
import chalk from "chalk";
import { Card } from "../card-deck/newDeck";
import { getSuit } from "../card-deck/getSuit";
import { getFace } from "../card-deck/getFace";

function playerName(player: Player) {
  return player.name.slice(0, 16).padStart(16, " ");
}

function chips(player: Player) {
  return `$${Number(player.stack)
    .toLocaleString(undefined, { minimumFractionDigits: 2 })
    .slice(0, 15)}`.padStart(16, " ");
}

function bets(player: Player) {
  return `$${Number(player.currentHand?.bet ?? 0)
    .toLocaleString(undefined, { minimumFractionDigits: 2 })
    .slice(0, 15)}`.padStart(16, " ");
}

const SUIT_ICONS = {
  H: "♥",
  C: "♣",
  D: "♦",
  S: "♠",
};

function renderCard(card: Card, isFolded: boolean) {
  // todo! breaks DI philosphy, needs to be passed in
  const suit = getSuit(card);
  const face = getFace(card);
  const renderableCard = `${face}${SUIT_ICONS[suit]}`;
  const isRedCard = ["H", "D"].includes(suit);
  return !isFolded
    ? (isRedCard ? chalk.red : chalk.black)(renderableCard)
    : (isRedCard ? chalk.dim.red : chalk.grey)(renderableCard);
}

// todo: exception cases
function cards(player: Player, isActive: boolean) {
  if (!player.currentHand?.hand) return "";
  // return JSON.stringify({ hand: player.currentHand.hand });
  // console.log(player.currentHand.hand);

  const renderedCards = player.currentHand.hand
    .map((card) => {
      const isFolded =
        player.currentHand.handStatus === PlayerHandStatus.FOLDED;
      const canSeeCards = isActive; // && not bot
      return player.currentHand.handStatus === PlayerHandStatus.PREDEAL
        ? ""
        : canSeeCards
        ? renderCard(card, isFolded)
        : (isFolded ? chalk.grey : chalk.blue)(" ▣");
    })
    .join(" ");

  return `           ${renderedCards}`;
}

// todo: take getSuit, getFace
export function renderBoard(game: Game, activePlayer: number) {
  return `Players
${game.players.map(playerName).join("")}
${game.players.map(chips).join("")}
${game.players.map((p, i) => cards(p, activePlayer === i)).join("")}

${game.players.map(bets).join("")}

Total Pot: $${calcPot(game)}
`;
}
