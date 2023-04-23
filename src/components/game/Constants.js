import { Color } from "./graphics/utils/Colors";

// Real time/space parameters
export const WINDOW_SIZE = 800;
export const QUEUE_WIDTH = 200;
export const REFRESH_MS = 10;

// Board parameters
export const BOARD_SIZE = 16;
// The distance from the boundary that each piece
export const SPAWN_OFFSET = 2;
// Extend edge boundaries a bit further to ensure pieces finish falling.
export const BOUNDARY_MARGIN = 4;
// Distance from the borders tp spawn in targets
export const TARGET_MARGIN = 4;
// The number of ticks contact must take place in order to place a piece.
export const COLLISION_TIME_LIMIT = 100;
// The maximum number of movements to adjust a rotation
export const MAX_ROTATION_ADJUSTMENT = 2;
// Ticks between each block fall
export const TICKS_TO_FALL = 30; // Wait this many ticks between each idleMove() call on coreState

export const BASE_COLORS = [
  new Color({ red: 255, green: 0, blue: 0 }),
  new Color({ red: 0, green: 255, blue: 0 }),
  new Color({ red: 0, green: 0, blue: 255 }),
  new Color({ red: 255, green: 255, blue: 0 }),
  new Color({ red: 0, green: 255, blue: 255 }),

  new Color({ red: 255, green: 0, blue: 255 }),
  new Color({ red: 0, green: 0, blue: 0 }),
  new Color({ red: 255, green: 0, blue: 255 }),

  new Color({ red: 65, green: 65, blue: 65 }),
  new Color({ red: 125, green: 125, blue: 125 }),
  new Color({ red: 185, green: 185, blue: 185 }),
  new Color({ red: 255, green: 255, blue: 255 }),
];

export const CELL_TYPE = {
  EMPTY: 0,
  NORMAL: 1,
  GHOST: 2,
  BOMB: 3,
  DRILL: 4,
  TOWER: 5,
};

// Stage variables
export const QUEUE_MAX_LENGTH = 5;
export const POWERUP_RARITY = 10;

export const TARGET_STAGE_MAX_LENGTH = 2;
export const TARGET_GRACE_PERIOD = 0;
export const TARGET_SPAWN_RADIUS = 1;
export const TARGET_SPAWN_TIMER = 4;
export const TARGET_GROWTH_TIMER = 6;

export const NORMAL_CELL_LIFETIME = 8;
export const BOMB_RADIUS = 2;

// 5-long piece preset
export const I_PIECE = [
  [0, -2],
  [0, -1],
  [0, 0],
  [0, 1],
  [0, 2],
];
// 4-long piece presets
export const L1_PIECE = [
  [0, -2],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, 1],
];
export const S1_PIECE = [
  [0, -2],
  [0, -1],
  [0, 0],
  [1, 0],
  [1, 1],
];
export const T1_PIECE = [
  [0, -2],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, 0],
];
// 3-long piece presets
export const L2_PIECE = [
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
export const S2_PIECE = [
  [-1, -1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, 1],
];
export const T2_PIECE = [
  [1, 1],
  [0, 1],
  [0, 0],
  [0, -1],
  [-1, 1],
];
export const X_PIECE = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
export const F_PIECE = [
  [0, 0],
  [0, 1],
  [1, 1],
  [0, -1],
  [-1, 0],
];
export const U_PIECE = [
  [1, -1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, 1],
];
export const B_PIECE = [
  [0, -1],
  [0, 0],
  [1, -1],
  [1, 0],
  [1, 1],
];
export const W_PIECE = [
  [-1, 1],
  [0, 1],
  [0, 0],
  [1, 0],
  [1, -1],
];
// A list for easy export
export const PRESETS = [
  L1_PIECE, // normal
  S1_PIECE, // normal
  T1_PIECE, // normal
  F_PIECE, // normal
  B_PIECE, // normal

  L2_PIECE, // diag mirror sym
  W_PIECE, // diag mirror sym
  S2_PIECE, // 180 rot sym

  I_PIECE, // mirror sym
  T2_PIECE, // mirror sym
  U_PIECE, // mirror sym
  X_PIECE, // 90 rot sym
];
