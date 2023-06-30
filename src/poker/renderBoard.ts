import { calcPot } from "./calcPot";
import { Game } from "./newGame";
import { unstyle } from 'ansi-colors';
import { Player, PlayerHandStatus } from "./newPlayer";
import chalk from "chalk";
import { Card } from "../card-deck/newDeck";
import { getSuit } from "../card-deck/getSuit";
import { getFace } from "../card-deck/getFace";
import { padChalkedEnd, padChalkedStart } from "../util/padChalked";
import { nextPlayer } from "./nextPlayer";

const palette = {
  darkGreen: chalk.rgb(0, 50, 0),
  bgDarkGreen: chalk.bgRgb(0, 50, 0),
  medGreen: chalk.rgb(20, 120, 20),
  red: chalk.red,
}

function playerName(game: Game) {
  return (player: Player, i: number) => {
    const sbPlayerNum = nextPlayer(game, { playerNum: game.button })
    const position = game.button === i ? '⏺' + game.actionPlayer
      : sbPlayerNum === i ? 'SB'
        : nextPlayer(game, { playerNum: sbPlayerNum }) === i ? 'BB'
          : ''

    const action = i === game.actionPlayer ? palette.red('▶') : '';
    const extraLabel = `${action ? `${action} ` : ''}${position ? palette.medGreen(`${position} `) : ''}`;
    return padChalkedStart(`${extraLabel}${player.name.slice(0, 16 - unstyle(extraLabel).length)}`, 16);
  }
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

  return padChalkedStart(renderedCards, 16);
}

function addBorder(boardText: string) {
  const boardLines = boardText.split("\n");
  const longestLine = boardLines.reduce((longest, line) => unstyle(line).length > longest ? unstyle(line).length : longest, 0);

  const bCol = palette.medGreen;

  const evenLengthBoardLines = boardLines.map(
    line => `${bCol("║")} ${padChalkedEnd(line, longestLine)} ${bCol("║")}`
  );
  return `${bCol(`╔${String("═").repeat(longestLine + 2)}╗`)}
${evenLengthBoardLines.join("\n")}
${bCol(`╚${String("═").repeat(longestLine + 2)}╝`)}`;
}

// todo: take getSuit, getFace
export function renderBoard(game: Game, activePlayer: number) {
  const boardText = `Players
  ${game.players.map(playerName(game)).join("")}
  ${game.players.map(chips).join("")}
  ${game.players.map((p, i) => cards(p, activePlayer === i)).join("")}
  
  ${game.players.map(bets).join("")}

Total Pot: $${calcPot(game)}
`;

  const borderedBoard = addBorder(boardText);
  return palette.bgDarkGreen(borderedBoard);
}
