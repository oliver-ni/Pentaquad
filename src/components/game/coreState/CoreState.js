import BoundarySets from "./utils/BoundarySets";
import PieceProvider from "./providers/PieceProvider";
import TargetProvider from "./providers/TargetProvider";

import {
  ActionType,
  executeDrop,
  executeFlip,
  executeHold,
  executeLock,
  executeMove,
  executeMoveTo,
  executePlace,
  executeRotate,
} from "../control/GameAction";
import { Angle, Direction, Dxn } from "./utils/Direction";
import { handleClearedLines } from "./utils/ClearedLines";
import { handleClearedTargets } from "./utils/ClearedTargets";
import { getSpawnPosition } from "./utils/Functions";

import { cellPlacementUpdate, place } from "./Placement";

import { BOUNDARY_EXTENSION_SIZE } from "./utils/Params";
import {
  TARGET_SPAWN_MARGIN,
  PLACEMENT_COUNTDOWN,
  FALLING_COUNTDOWN,
} from "../rules/Constants";
import Scorekeeper from "./Scorekeeper";
import { EmptyCellProvider } from "./providers/EmptyCellProvider";
import { NORMAL_CELL_LIFETIME_LVL, FALLING_COUNTDOWN_LVL } from "../rules/Levels";

// The most essential level of state in the game. Each update() call either
// moves an existing block, or places it and creates a new block after shifting
// gravity.
const CoreState = class {
  constructor(props) {
    this.controller = null; // The GameState's main controller, postInit to allow impl room for 2-player hijacking
    this.pieceProvider = new PieceProvider({ coreState: this }); // Create a new PieceProvider to take care of creating/dispensing pieces
    this.targetProvider = new TargetProvider({
      // Create a new TargetProvider to take care of creating/dispensing targets
      coreState: this,
      minBound: TARGET_SPAWN_MARGIN,
      maxBound: props.boardSize - TARGET_SPAWN_MARGIN,
    });
    this.emptyCellProvider = new EmptyCellProvider();
    this.scorekeeper = new Scorekeeper({});

    this.pidSize = (props.boardSize + BOUNDARY_EXTENSION_SIZE * 2) * 2; // All sets of (x, y) pairs checking each other for collisions will have a unique PID dependent on a 3rd parameter describing the max size of the PID group, in order for uniqueness to work.
    this.boardSize = props.boardSize; // The dimension of the square board on which this game takes place.
    this.board = [...Array(props.boardSize)].map(
      (
        e // Create the main board for the game
      ) => Array(props.boardSize).fill(null)
    );
    for (var y = 0; y < this.board.length; y++) {
      for (var x = 0; x < this.board.length; x++) {
        this.board[y][x] = this.emptyCellProvider.newCell();
      }
    }
    // Create 4 different sets to check if a boundary has been hit
    this.collisionSets = new BoundarySets(
      props.boardSize,
      BOUNDARY_EXTENSION_SIZE,
      this.pidSize
    );

    this.gravity = new Direction(Angle.DOWN); // The direction in which the piece moves, and in which the board moves after a line is cleared.
    this.currPiece = null; // The GameState's current unplaced piece
    this.targets = []; // The GameState's roster of target blocks
    this.timer = 0; // A timer that increments once each update updates should only be called from a higher-level state which is allowed to control the flow of "core" tempo.
    this.collisionTimer = 0; // Keep track of how long this piece is in contact in its falling direction
    this.readyToPlace = true; // Flag for placing a block
  }

  // Set this piece's controller, in the future this can end up being called
  // while the game is going on when players hijack each other.
  setController(controller) {
    this.controller = controller;
  }

  // (Facilitated by Controller) Take in a GameAction and use it to change the GameState
  performNextAction(action) {
    var action = this.controller.consumeAction();
    while (action) {
      if (action.type == ActionType.MOVE) {
        if (action.props.dxn.equals(this.currPiece.dxn.opposite())) {
          executeRotate(this, 1);
        } else {
          executeMove(this, action.props.dxn);
        }
      } else if (action.type == ActionType.ROTATE) {
        executeRotate(this, 1);
      } else if (action.type == ActionType.MOVE_TO) {
        executeMoveTo(this, action.props.x, action.props.y);
      } else if (action.type == ActionType.FLIP) {
        executeFlip(this);
      } else if (action.type == ActionType.DROP) {
        executeDrop(this);
      } else if (action.type == ActionType.PLACE) {
        executePlace(this);
      } else if (action.type == ActionType.HOLD) {
        executeHold(this, action.props.item);
      } else if (action.type == ActionType.LOCK) {
        executeLock(this);
      }
      action = this.controller.consumeAction();
    }
  }

  // (Facilitated by PieceProvider) Create a new piece based on this CoreState's gravity, at a random location.
  createNewPiece() {
    var [x, y] = getSpawnPosition(this.gravity, this.boardSize);
    // Get the unmounted piece from PieceProvider; we need this loop in case async piece
    // doesn't arrive in time
    var piece;
    while (!piece) {
      piece = this.pieceProvider.consumePiece(this.scorekeeper.level);
    }
    piece.activatePiece({
      center_x: x,
      center_y: y,
      direction: this.gravity,
      pidSize: this.pidSize,
      ttl: NORMAL_CELL_LIFETIME_LVL[this.scorekeeper.level],
    });
    this.currPiece = piece;
  }

  // (Facilitated by TargetProvider) Create a new Target in a random location.
  createNewTarget() {
    var target = this.targetProvider.consumeTarget();
    if (target) {
      this.targets.push(target);
    }
  }

  // An update that happens each frame; idleMoveIncluded is called once every
  // several frames to actually move the block downwards, and that calls other
  // updates in Cells. Corresponds to idleUpdate and fallingUpdate in Cell and Target classes
  update() {
    if (this.timer % FALLING_COUNTDOWN_LVL[this.scorekeeper.level] == 0) {
      if (this.readyToPlace) {
        this.placementUpdate();
      } else if (this.currPiece && this.collisionTimer == 0) {
        this.fallingUpdate();
      }
    } else if (!this.readyToPlace && this.currPiece && this.controller) {
      this.idleUpdate();
    }
    this.timer += 1;
    return this; // CoreState.update() returns itself
  }

  // Attempt to perform the next action if dispensed by the game controller, and update the
  // collision timer.
  idleUpdate() {
    this.performNextAction();
    if (
      this.currPiece != null &&
      this.currPiece.checkCollision(
        this.gravity,
        this.board,
        this.collisionSets
      )
    ) {
      this.collisionTimer += 1;
      if (this.collisionTimer == PLACEMENT_COUNTDOWN) {
        this.readyToPlace = true;
      }
    } else {
      this.collisionTimer = 0;
    }
  }

  // Move the block down in its falling direction
  fallingUpdate() {
    this.currPiece.move(this.gravity);
  }

  // Place the current piece, create a new one, and check for new filled lines.
  // Basically all the logic that happens whenever the arrangement of board pieces
  // changes. Corresponds to placementUpdate in Cell and Target classes.
  placementUpdate() {
    place(this, this.currPiece);
    this.gravity.turn(
      this.gravity && this.gravity.equals(Dxn[Angle.DOWN]) ? 1 : -1
    );
    // Check and clear any filled targets or lines
    handleClearedTargets(this);
    handleClearedLines(this);
    cellPlacementUpdate(this);
    // Create new game objects
    this.createNewPiece();
    this.createNewTarget();
  }
};

export default CoreState;
