import kaplay from "kaplay";

const k = kaplay({
  width: 900,
  height: 550,
  background: [28, 40, 28],
});

let spores = 100;
let selectedTower = "shooter";

const GRID_ROWS = 5;
const GRID_COLS = 9;
const TILE_SIZE = 64;
const GRID_START_X = 160;
const GRID_START_Y = 100;

// 1. Spore Counter Header
const sporeLabel = k.add([
  k.text(`Spores: ${spores}`, { size: 22 }),
  k.pos(20, 20),
  k.color(255, 230, 100),
]);

function addSpores(amount) {
  spores += amount;
  sporeLabel.text = `Spores: ${spores}`;
}

// 2. Tower Selectors on Left Sidebar
const towerTypes = [
  { id: "shooter", name: "Shooter\n(50 Spores)", color: [220, 60, 60], cost: 50 },
  { id: "wall", name: "Wall\n(25 Spores)", color: [200, 140, 60], cost: 25 },
  { id: "eco", name: "Economy\n(70 Spores)", color: [240, 200, 50], cost: 70 },
];

towerTypes.forEach((type, index) => {
  const btnY = 100 + index * 90;

  const btn = k.add([
    k.rect(120, 70),
    k.pos(20, btnY),
    k.color(type.color[0], type.color[1], type.color[2]),
    k.area(),
    k.outline(selectedTower === type.id ? 4 : 0, k.rgb(255, 255, 255)),
    "towerButton",
  ]);

  k.add([
    k.text(type.name, { size: 13 }),
    k.pos(80, btnY + 35),
    k.anchor("center"),
    k.color(0, 0, 0),
  ]);

  btn.onClick(() => {
    selectedTower = type.id;
    k.get("towerButton").forEach((b) => (b.outline.width = 0));
    btn.outline.width = 4;
  });
});

// 3. 5x9 Grid Board & Planting Logic
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    const tileX = GRID_START_X + col * TILE_SIZE;
    const tileY = GRID_START_Y + row * TILE_SIZE;

    const tile = k.add([
      k.rect(TILE_SIZE - 4, TILE_SIZE - 4),
      k.pos(tileX, tileY),
      k.color(45, 65, 45),
      k.area(),
      "gridTile",
      { row, col, occupied: false },
    ]);

    tile.onClick(() => {
      if (tile.occupied) return;

      const currentConfig = towerTypes.find((t) => t.id === selectedTower);

      if (spores >= currentConfig.cost) {
        addSpores(-currentConfig.cost);
        tile.occupied = true;

        k.add([
          k.circle(22),
          k.pos(tileX + TILE_SIZE / 2 - 2, tileY + TILE_SIZE / 2 - 2),
          k.color(currentConfig.color[0], currentConfig.color[1], currentConfig.color[2]),
          k.area(),
          "mushroom",
          { type: selectedTower, row, lastShot: 0 },
        ]);
      }
    });
  }
}

// 4. Automatic Shooter Logic
k.onUpdate("mushroom", (m) => {
  if (m.type === "shooter") {
    if (k.time() - m.lastShot > 1.5) {
      m.lastShot = k.time();

      k.add([
        k.circle(6),
        k.pos(m.pos.x + 20, m.pos.y),
        k.color(255, 100, 100),
        k.area(),
        k.move(0, 300),
        "bullet",
        { damage: 10 },
      ]);
    }
  }
});

// 5. Enemy Spawner (Elves)
k.loop(3, () => {
  const randomRow = Math.floor(Math.random() * GRID_ROWS);
  const spawnY = GRID_START_Y + randomRow * TILE_SIZE + TILE_SIZE / 2;

  k.add([
    k.rect(30, 40),
    k.pos(GRID_START_X + GRID_COLS * TILE_SIZE + 20, spawnY - 20),
    k.color(80, 200, 100),
    k.area(),
    k.move(180, 60),
    "enemy",
    { hp: 30 },
  ]);
});

// 6. Projectile & Enemy Collisions
k.onCollide("bullet", "enemy", (b, e) => {
  e.hp -= b.damage;
  k.destroy(b);

  if (e.hp <= 0) {
    k.destroy(e);
    addSpores(15);
  }
});