import React, { useState, useEffect } from "react";

import GameState from "./GameState";
import CoreState from "./coreState/CoreState";
import GameController from "../game/control/GameController";

import GameGraphics from "./graphics/GameGraphics";
import { WINDOW_DIMENSIONS, BOARD_SIZE, REFRESH_MS } from "./rules/Constants";
import { TOTAL_HEIGHT, TOTAL_WIDTH } from "./graphics/Layout";
import Scoresheet from "./graphics/sections/scoresheet/Scoresheet";

// The main component that displays the game. It is intended to hold nothing more than the game,
// and to be surrounded by other components that represent menus, settings, etc.
const GameCanvas = (props) => {
  // The global flow of tempo to facilitate the useEffect update loop
  const [canvasTimer, setCanvasTimer] = useState(0);
  // Keypress logic
  const [gameController, setGameController] = useState(
    new GameController({
      boardSize: BOARD_SIZE,
      windowDimensions: WINDOW_DIMENSIONS,
    })
  );
  // TODO: Create a GameState that wraps around CoreState to control when active game logic takes place
  const [gameState, setGameState] = useState(
    new GameState({
      coreState: new CoreState({
        boardSize: BOARD_SIZE,
      }),
      controller: gameController,
    })
  );
  // The canvas is the root listener for keyDown events, which are delegated to the gameController to map to GameActions.
  const handleKeyDown = (event) => {
    gameController.handleKeyDown(event);
  };
  // MouseMove is also delegated to GameController gthough handled differently.
  const handleMouseMove = (event) => {
    gameController.handleMouseMove(event);
  };
  const handleMouseDown = (event) => {
    gameController.handleMouseDown(event);
  };

  const togglePauseGame = (e) => {
    gameState.togglePause();
  };
  const startNewGame = (e) => {
    gameState.startOver();
  }

  // Disable spacebar scrolling down
  window.onkeydown = function (e) {
    return e.keyCode !== 32 && e.key !== " ";
  };

  // Main update loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState != undefined) {
        setGameState(gameState.update());
      }
      setCanvasTimer(canvasTimer + 1);
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [canvasTimer]);

  return (
    <div
      id="gameCanvas"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      <canvas id="gameGraphics" width={TOTAL_WIDTH} height={TOTAL_HEIGHT}>
        <GameGraphics gameState={gameState} />
      </canvas>
      <Scoresheet gameState={gameState} togglePauseGame={togglePauseGame} startNewGame={startNewGame}/>
    </div>
  );
};

export default GameCanvas;
