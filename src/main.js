import kaplay from "kaplay";

// 1. Initialize KAPLAY in full-screen mode
const k = kaplay({
  fullscreen: true,
  scale: 1,
  background: [28, 40, 28], // Forest floor color
});

// 2. Define Board Specifications
const GRID_ROWS = 5;
const GRID_COLS = 9;

// State array to keep track of every tile's data
const gridData = [];

function buildFullScreenGrid() {
  // Clear any existing tiles if window resizes
  k.destroyAll("gridTile");
  gridData.length = 0;

  // Leave margins for future UI (top header & left sidebar)
  const MARGIN_LEFT = k.width() * 0.15; // 15% margin on left for tower sidebar
  const MARGIN_TOP = k.height() * 0.12;  // 12% margin on top for spore header
  
  const AVAILABLE_WIDTH = k.width() - MARGIN_LEFT - (k.width() * 0.05);
  const AVAILABLE_HEIGHT = k.height() - MARGIN_TOP - (k.height() * 0.05);

  // Calculate dynamic tile size to perfectly fill remaining screen space
  const tileWidth = AVAILABLE_WIDTH / GRID_COLS;
  const tileHeight = AVAILABLE_HEIGHT / GRID_ROWS;

  // Build the 5x9 Grid
  for (let row = 0; row < GRID_ROWS; row++) {
    gridData[row] = [];

    for (let col = 0; col < GRID_COLS; col++) {
      const x = MARGIN_LEFT + col * tileWidth;
      const y = MARGIN_TOP + row * tileHeight;

      // Render individual tile
      const tile = k.add([
        k.rect(tileWidth - 4, tileHeight - 4), // 4px padding gap
        k.pos(x, y),
        k.color(45, 65, 45),
        k.area(),
        "gridTile",
        {
          row,
          col,
          occupied: false,
          tileWidth,
          tileHeight,
        },
      ]);

      // Click event logic for individual tile
      tile.onClick(() => {
        if (!tile.occupied) {
          tile.occupied = true;
          tile.color = k.rgb(80, 120, 80);
          k.debug.log(`Clicked Grid Tile: Row ${row}, Column ${col}`);
        }
      });

      gridData[row][col] = tile;
    }
  }
}

// Build grid on startup
buildFullScreenGrid();

// Re-calculate grid if the browser window changes size
k.onResize(() => {
  buildFullScreenGrid();
});