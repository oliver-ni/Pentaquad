// Generate a random integer from a up to but not including b
export function randint(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

// Generate a unique int of coordinate x, y given a maximum groupSize, in order
// to facilitate creating sets of coordinates for quick piece formation and collision detection.
export function getPID(x, y, groupSize) {
  return x * groupSize + y;
}

// Return whether or not x and y correspond to in-bound indices
export function inBounds(x, y, boardSize) {
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}
