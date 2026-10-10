import kaplay from "kaplay";

// Initialize full-screen KAPLAY canvas
const k = kaplay({
  fullscreen: true,
  scale: 1,
  background: [30, 45, 30], // Ugly temporary background (will be replaced by your image)
});

// ==========================================
// 1. GAME STATE & CONSTANTS
// ==========================================
let spores = 120;
let selectedTower = "shooter"; // 'shooter', 'wall', 'eco'
let waveNumber = 1;
let enemiesInWave = 0;
let maxEnemiesInWave = 6;
let waveActive = true;

const GRID_ROWS = 5;
const GRID_COLS = 9;
const gridTiles = [];

// Calculate board bounds leaving space for UI header & sidebar
const MARGIN_LEFT = k.width() * 0.16;
const MARGIN_TOP = k.height() * 0.14;
const AVAILABLE_WIDTH = k.width() - MARGIN_LEFT - k.width() * 0.04;
const AVAILABLE_HEIGHT = k.height() - MARGIN_TOP - k.height() * 0.05;

const TILE_W = AVAILABLE_WIDTH / GRID_COLS;
const TILE_H = AVAILABLE_HEIGHT / GRID_ROWS;

// Tower Specs
const TOWER_SPECS = {
  shooter: { name: "Shooter", cost: 50, color: k.rgb(220, 60, 60), hp: 40 },
  wall: { name: "Wall", cost: 25, color: k.rgb(160, 110, 50), hp: 150 },
  eco: { name: "Economy", cost: 70, color: k.rgb(240, 210, 50), hp: 30 },
};

// ==========================================
// 2. UI HEADER & SIDEBAR (UGLY BUTTONS)
// ==========================================
const sporeText = k.add([
  k.text(`Spores: ${spores} | Wave: ${waveNumber}`, { size: 22 }),
  k.pos(20, 20),
  k.color(255, 235, 120),
  k.fixed(),
]);

function updateSpores(amt) {
  spores += amt;
  sporeText.text = `Spores: ${spores} | Wave: ${waveNumber}`;
}

// Sidebar Tower Selectors
const towerTypes = ["shooter", "wall", "eco"];
towerTypes.forEach((type, idx) => {
  const spec = TOWER_SPECS[type];
  const btnY = MARGIN_TOP + idx * 80;

  const btn = k.add([
    k.rect(MARGIN_LEFT - 30, 65),
    k.pos(15, btnY),
    k.color(spec.color),
    k.area(),
    k.outline(selectedTower === type ? 4 : 0, k.rgb(255, 255, 255)),
    "towerBtn",
    { type },
  ]);

  k.add([
    k.text(`${spec.name}\n(${spec.cost} S)`, { size: 14 }),
    k.pos(MARGIN_LEFT / 2 - 5, btnY + 32),
    k.anchor("center"),
    k.color(0, 0, 0),
  ]);

  btn.onClick(() => {
    selectedTower = type;
    k.get("towerBtn").forEach((b) => (b.outline.width = 0));
    btn.outline.width = 4;
  });
});

// ==========================================
// 3. GRID SYSTEM & TOWER PLACEMENT
// ==========================================
for (let row = 0; row < GRID_ROWS; row++) {
  gridTiles[row] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    const x = MARGIN_LEFT + col * TILE_W;
    const y = MARGIN_TOP + row * TILE_H;

    const tile = k.add([
      k.rect(TILE_W - 4, TILE_H - 4),
      k.pos(x, y),
      k.color(45, 65, 45),
      k.opacity(0.8), // Semi-transparent so background image will show later
      k.area(),
      "tile",
      { row, col, occupied: false },
    ]);

    tile.onClick(() => {
      if (tile.occupied) return;

      const spec = TOWER_SPECS[selectedTower];
      if (spores >= spec.cost) {
        updateSpores(-spec.cost);
        tile.occupied = true;

        // Spawn Ugly Tower (Circle shape)
        k.add([
          k.circle(Math.min(TILE_W, TILE_H) * 0.35),
          k.pos(x + TILE_W / 2, y + TILE_H / 2),
          k.anchor("center"),
          k.color(spec.color),
          k.area(),
          "mushTower",
          {
            type: selectedTower,
            row,
            col,
            hp: spec.hp,
            maxHp: spec.hp,
            lastShot: 0,
            lastEco: 0,
            tileRef: tile,
          },
        ]);
      }
    });

    gridTiles[row][col] = tile;
  }
}

// ==========================================
// 4. MUSHROOM TOWER LOGIC & TIMERS
// ==========================================
k.onUpdate("mushTower", (m) => {
  // SHOOTER: Fires projectile if enemy exists in row
  if (m.type === "shooter") {
    const enemiesInRow = k.get("enemy").filter((e) => e.row === m.row && e.pos.x > m.pos.x);
    if (enemiesInRow.length > 0 && k.time() - m.lastShot > 1.2) {
      m.lastShot = k.time();

      k.add([
        k.circle(8),
        k.pos(m.pos.x + 15, m.pos.y),
        k.color(255, 80, 80),
        k.area(),
        k.move(0, 320), // Moves right
        "playerBullet",
        { damage: 15, row: m.row },
      ]);
    }
  }

  // ECONOMY: Generates spores every 6 seconds
  if (m.type === "eco") {
    if (k.time() - m.lastEco > 6) {
      m.lastEco = k.time();
      updateSpores(25);
      
      // Visual pulse effect on eco mushroom
      m.scale = k.vec2(1.3);
      k.wait(0.2, () => { if (m.exists()) m.scale = k.vec2(1.0); });
    }
  }
});

// ==========================================
// 5. ENEMY SPAWNER & MOVEMENT LOGIC
// ==========================================
k.loop(2.5, () => {
  if (!waveActive || enemiesInWave >= maxEnemiesInWave) return;

  enemiesInWave++;
  const row = Math.floor(Math.random() * GRID_ROWS);
  const spawnX = k.width() + 20;
  const spawnY = MARGIN_TOP + row * TILE_H + TILE_H / 2;

  // Decide Enemy Type based on random weight
  const roll = Math.random();
  let enemySpec = { type: "elf", color: k.rgb(80, 200, 80), hp: 35, speed: 50, size: [30, 40] };

  if (roll > 0.7) {
    enemySpec = { type: "giant", color: k.rgb(130, 130, 130), hp: 120, speed: 25, size: [45, 55] };
  } else if (roll > 0.5) {
    enemySpec = { type: "witch", color: k.rgb(160, 60, 200), hp: 50, speed: 40, size: [35, 45] };
  }

  k.add([
    k.rect(enemySpec.size[0], enemySpec.size[1]),
    k.pos(spawnX, spawnY),
    k.anchor("center"),
    k.color(enemySpec.color),
    k.area(),
    "enemy",
    {
      type: enemySpec.type,
      row,
      hp: enemySpec.hp,
      speed: enemySpec.speed,
      eating: false,
      lastWitchShot: 0,
    },
  ]);
});

// Enemy Movement & Witch Ranged Attacks
k.onUpdate("enemy", (e) => {
  if (!e.eating) {
    e.move(-e.speed, 0); // Walk Left
  }

  // WITCH SPECIFIC: Stops to shoot purple spell at mushrooms
  if (e.type === "witch" && !e.eating) {
    const towersInRow = k.get("mushTower").filter((m) => m.row === e.row && m.pos.x < e.pos.x);
    if (towersInRow.length > 0 && k.time() - e.lastWitchShot > 2.5) {
      e.lastWitchShot = k.time();

      k.add([
        k.circle(7),
        k.pos(e.pos.x - 15, e.pos.y),
        k.color(200, 50, 255),
        k.area(),
        k.move(180, 220), // Moves left
        "enemyBullet",
        { damage: 12, row: e.row },
      ]);
    }
  }

  // Check if wave complete
  if (enemiesInWave >= maxEnemiesInWave && k.get("enemy").length === 0) {
    triggerNextWave();
  }
});

// ==========================================
// 6. COLLISIONS & DAMAGE MECHANICS
// ==========================================

// Player Bullet hits Enemy
k.onCollide("playerBullet", "enemy", (b, e) => {
  e.hp -= b.damage;
  k.destroy(b);

  // Flash Red on hit
  e.color = k.rgb(255, 0, 0);
  k.wait(0.1, () => {
    if (e.exists()) e.color = e.type === "elf" ? k.rgb(80, 200, 80) : e.type === "giant" ? k.rgb(130, 130, 130) : k.rgb(160, 60, 200);
  });

  if (e.hp <= 0) {
    k.destroy(e);
    updateSpores(15);
  }
});

// Witch Enemy Bullet hits Mushroom
k.onCollide("enemyBullet", "mushTower", (b, m) => {
  m.hp -= b.damage;
  k.destroy(b);

  if (m.hp <= 0) {
    m.tileRef.occupied = false;
    k.destroy(m);
  }
});

// Enemy touches Mushroom (Melee Eating Collision)
k.onCollide("enemy", "mushTower", (e, m) => {
  if (e.row === m.row) {
    e.eating = true;

    const eatTimer = k.loop(0.8, () => {
      if (!e.exists() || !m.exists()) {
        if (e.exists()) e.eating = false;
        eatTimer.cancel();
        return;
      }

      m.hp -= 10;

      if (m.hp <= 0) {
        m.tileRef.occupied = false;
        k.destroy(m);
        e.eating = false;
        eatTimer.cancel();
      }
    });
  }
});

// ==========================================
// 7. WAVE SYSTEM & POST-WAVE QUIZ POP-UP
// ==========================================
function triggerNextWave() {
  waveActive = false;
  waveNumber++;

  // Trigger Quiz at Wave 3
  if (waveNumber === 3) {
    showQuizModal();
  } else {
    maxEnemiesInWave += 4;
    enemiesInWave = 0;
    updateSpores(0);
    waveActive = true;
  }
}

function showQuizModal() {
  // Semi-transparent overlay blocking game clicks
  const modalBg = k.add([
    k.rect(k.width(), k.height()),
    k.color(0, 0, 0),
    k.opacity(0.85),
    k.fixed(),
    k.z(100),
    "quizUI",
  ]);

  // Quiz Card
  const modalBox = k.add([
    k.rect(600, 380),
    k.pos(k.center()),
    k.anchor("center"),
    k.color(230, 220, 190), // Parchment color
    k.fixed(),
    k.z(101),
    "quizUI",
  ]);

  k.add([
    k.text("POST-WAVE ECOLOGY QUIZ", { size: 22 }),
    k.pos(k.center().x, k.center().y - 140),
    k.anchor("center"),
    k.color(40, 40, 40),
    k.fixed(),
    k.z(102),
    "quizUI",
  ]);

  k.add([
    k.text("Fungi are the primary ______ in forest ecosystems, breaking down dead organic matter.", { size: 16, width: 500 }),
    k.pos(k.center().x, k.center().y - 80),
    k.anchor("center"),
    k.color(0, 0, 0),
    k.fixed(),
    k.z(102),
    "quizUI",
  ]);

  const options = [
    { text: "A) Decomposers", correct: true },
    { text: "B) Producers", correct: false },
    { text: "C) Predators", correct: false },
    { text: "D) Consumers", correct: false },
  ];

  options.forEach((opt, idx) => {
    const btnY = k.center().y - 10 + idx * 50;

    const optBtn = k.add([
      k.rect(480, 40),
      k.pos(k.center().x, btnY),
      k.anchor("center"),
      k.color(100, 100, 100),
      k.area(),
      k.fixed(),
      k.z(102),
      "quizUI",
    ]);

    k.add([
      k.text(opt.text, { size: 16 }),
      k.pos(k.center().x, btnY),
      k.anchor("center"),
      k.color(255, 255, 255),
      k.fixed(),
      k.z(103),
      "quizUI",
    ]);

    optBtn.onClick(() => {
      if (opt.correct) {
        updateSpores(50);
        k.debug.log("Correct! +50 Spores");
      }

      // Resume game & start Wave 3
      k.destroyAll("quizUI");
      maxEnemiesInWave += 4;
      enemiesInWave = 0;
      waveActive = true;
    });
  });
}