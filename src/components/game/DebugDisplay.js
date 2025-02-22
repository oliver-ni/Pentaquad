import { FILLED_COLOR } from "./theme/Theme";

export const DEBUG = true;
export const MESSAGE_FONTSIZE = 24;
export const MESSAGE_OFFSET = 10;
export const CHARS_PER_LINE = 60;

// TODO: Add more args to debugCell like x and y position or left/right align to render more of these
export function debugCell(canvas, cell, x0, y0, boardX, boardY) {
  canvas.font = (MESSAGE_FONTSIZE - 4).toString() + "px Arial";
  canvas.fillStyle = FILLED_COLOR.getHex();

  var display = JSON.stringify(cell);
  var displayVars = display.split(",");

  // for (var i = 0; i < displayVars.length; i++) {
  //   canvas.fillText(displayVars[i], x0 + MESSAGE_OFFSET, y0 + MESSAGE_SIZE * (i + 1));
  // }

  // for (var i = 0; i < display.length / CHARS_PER_LINE - 1; i++) {
  //   canvas.fillText(display.slice(i * CHARS_PER_LINE, (i + 1) * CHARS_PER_LINE), x0 + MESSAGE_OFFSET, y0 + MESSAGE_SIZE * (i + 1))
  // }
  // canvas.fillText(display.slice(i * CHARS_PER_LINE), x0 + MESSAGE_OFFSET, y0 + MESSAGE_SIZE * (i + 1))

  canvas.fillText(
    boardX.toString() + ", " + boardY.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE
  );
  canvas.fillText(
    "type: " + cell.type.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 2
  );
  canvas.fillText(
    "baseColor: " + cell.baseColor.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 3
  );
  canvas.fillText(
    "currentColor: " + cell.baseColor.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 4
  );
  canvas.fillText(
    "x offset: " + cell.xOffset.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 5
  );
  canvas.fillText(
    "y offset: " + cell.yOffset.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 6
  );
  canvas.fillText(
    "timer: " + cell.timer.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 7
  );
  canvas.fillText(
    "meter: " + cell.meter.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 8
  );
  canvas.fillText(
    "lifetime: " + cell.lifetime.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 9
  );
  canvas.fillText(
    "ttl: " + cell.ttl.toString(),
    x0 + MESSAGE_OFFSET,
    y0 + MESSAGE_FONTSIZE * 10
  );
}
