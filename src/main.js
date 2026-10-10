import kaplay from "kaplay";

// Initialize full-screen KAPLAY canvas
const k = kaplay({
  fullscreen: true,
  scale: 1,
  background: [30, 45, 30],
});

// Global state tracking Secret Mode unlock status
let secretModeUnlocked = false;

// ==========================================
// EDUCATIONAL & QUIZ DATA BANK
// ==========================================
const waveEducationData = {
  1: [
    { title: "Mushroom 1: Bleeding Tooth (Shooter)", text: "The Bleeding Tooth mushroom oozes red fluid. It is a ranged attacker that shoots spores down its row!" },
    { title: "Mushroom 2: Poison Fire Coral (Wall)", text: "Poison Fire Coral acts as a sturdy wall. It has high HP to stall incoming forest enemies." },
    { title: "Mushroom 3: Chicken of the Woods (Economy)", text: "Chicken of the Woods generates spores passively over time to fund your fungal defenses!" }
  ],
  2: [
    { title: "Forest Fact: Mycelium Network", text: "Mycelium forms a massive underground network connecting plant roots to share nutrients across the forest." },
    { title: "Forest Fact: Spore Production", text: "Mushrooms release millions of spores into air currents to colonize new soil areas." }
  ],
  3: [
    { title: "Forest Fact: Decomposers", text: "Fungi break down dead organic matter like fallen logs into rich nutrients for young saplings." }
  ],
  4: [
    { title: "Forest Fact: Mycorrhizae", text: "Symbiotic fungi trade mineral nutrients from deep soil in exchange for sugars produced by trees!" }
  ],
  5: [
    { title: "Forest Fact: Bioluminescence", text: "Certain fungal species produce light underwater or in dark woods to attract spore-spreading insects!" }
  ],
  6: [
    { title: "Forest Fact: Fungal Immunity", text: "Fungi produce natural antimicrobial compounds that help protect forest soils from toxic bacterial blooms." }
  ],
  7: [
    { title: "Forest Fact: Ecosystem Guardians", text: "Healthy fungal networks prevent soil erosion and keep ancient forest ecosystems resilient!" }
  ]
};

const waveQuizData = {
  1: [
    { q: "What role does Poison Fire Coral play?", options: ["A) High-HP Wall", "B) Spore Generator", "C) Fast Attacker", "D) Flying Scout"], correct: 0, reward: 50 },
    { q: "Which mushroom boosts spore production over time?", options: ["A) Bleeding Tooth", "B) Chicken of the Woods", "C) Elf", "D) Poison Fire Coral"], correct: 1, reward: 50 }
  ],
  2: [
    { q: "What is Mycelium?", options: ["A) Tree leaf veins", "B) Underground fungal network", "C) Flower petal", "D) Enemy spell"], correct: 1, reward: 60 }
  ],
  3: [
    { q: "Why are fungi vital decomposers?", options: ["A) They break down dead matter into nutrients", "B) They hunt animals", "C) They produce sunlight", "D) They cause wind"], correct: 0, reward: 70 }
  ],
  4: [
    { q: "What do mycorrhizal fungi exchange with tree roots?", options: ["A) Minerals for sugars", "B) Dirt for water", "C) Rocks for leaves", "D) Spores for wood"], correct: 0, reward: 75 }
  ],
  5: [
    { q: "Why do bioluminescent fungi produce light?", options: ["A) To attract spore-spreading insects", "B) To scare birds", "C) To warm the soil", "D) To cook leaves"], correct: 0, reward: 80 }
  ],
  6: [
    { q: "How do fungal antimicrobials aid forest soil?", options: ["A) Protect against harmful bacteria", "B) Freeze water", "C) Stop rain", "D) Melt rocks"], correct: 0, reward: 90 }
  ],
  7: [
    { q: "What overall benefit do mycelial networks provide?", options: ["A) Ecosystem resilience and soil health", "B) Strong winds", "C) Flooding", "D) Desertification"], correct: 0, reward: 100 }
  ]
};

const WAVE_COMPOSITIONS = {
  1: { elf: 5, witch: 0, giant: 0 },
  2: { elf: 10, witch: 0, giant: 0 },
  3: { elf: 10, witch: 3, giant: 0 },
  4: { elf: 10, witch: 6, giant: 0 },
  5: { elf: 10, witch: 6, giant: 2 },
  6: { elf: 10, witch: 6, giant: 5 },
  7: { elf: 12, witch: 8, giant: 6 },
};

const enemyIntroData = {
  elf: "NEW ENEMY: Corrupted Elf!\nFast movement speed, low health. Walks straight down lanes.",
  giant: "NEW ENEMY: Corrupted Giant!\nVery slow speed, massive health pool. High threat!",
  witch: "NEW ENEMY: Dark Witch!\nRanged attacker. Stops periodically to hurl spells at mushrooms!"
};

const seenEnemies = { elf: false, giant: false, witch: false };
const BASE_WAVE_SPORES = { 1: 150, 2: 100, 3: 120, 4: 140, 5: 160, 6: 180, 7: 200 };

// ==========================================
// SCENE 1: MAIN MENU
// ==========================================
k.scene("menu", () => {
  k.add([
    k.text("MYCELIUM DEFENSE", { size: 42 }),
    k.pos(k.center().x, k.height() * 0.2),
    k.anchor("center"),
    k.color(255, 230, 100)
  ]);

  // PLAY
  const playBtn = k.add([
    k.rect(240, 50),
    k.pos(k.center().x, k.height() * 0.42),
    k.anchor("center"),
    k.color(80, 160, 80),
    k.area(),
  ]);
  k.add([
    k.text("PLAY", { size: 22 }),
    k.pos(k.center().x, k.height() * 0.42),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);
  playBtn.onClick(() => {
    seenEnemies.elf = false;
    seenEnemies.giant = false;
    seenEnemies.witch = false;
    k.go("game", { wave: 1, extraSpores: 0, isSecretMode: false });
  });

  // RULES
  const rulesBtn = k.add([
    k.rect(240, 50),
    k.pos(k.center().x, k.height() * 0.55),
    k.anchor("center"),
    k.color(100, 100, 180),
    k.area(),
  ]);
  k.add([
    k.text("RULES", { size: 22 }),
    k.pos(k.center().x, k.height() * 0.55),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);
  rulesBtn.onClick(() => k.go("rules"));

  // SECRET MODE
  const secretBtn = k.add([
    k.rect(240, 50),
    k.pos(k.center().x, k.height() * 0.68),
    k.anchor("center"),
    k.color(secretModeUnlocked ? k.rgb(180, 70, 200) : k.rgb(70, 70, 70)),
    k.area(),
  ]);
  k.add([
    k.text(secretModeUnlocked ? "SECRET MODE" : "LOCKED MODE", { size: 18 }),
    k.pos(k.center().x, k.height() * 0.68),
    k.anchor("center"),
    k.color(secretModeUnlocked ? k.rgb(255, 255, 255) : k.rgb(150, 150, 150))
  ]);

  secretBtn.onClick(() => {
    if (secretModeUnlocked) {
      k.go("game", { wave: 99, extraSpores: 0, isSecretMode: true });
    } else {
      k.debug.log("Beat all 7 waves to unlock Secret Mode!");
    }
  });
});

// ==========================================
// SCENE 2: RULES
// ==========================================
k.scene("rules", () => {
  k.add([
    k.text("GAME RULES & GUIDE", { size: 32 }),
    k.pos(k.center().x, 50),
    k.anchor("center"),
    k.color(255, 230, 100)
  ]);

  const rulesBody = 
    "GOAL:\nDefend the forest floor through 7 escalating waves!\n\n" +
    "MUSHROOM TOWERS:\n" +
    "• Bleeding Tooth (Shooter): Ranged attacker (50 Spores)\n" +
    "• Poison Fire Coral (Wall): High-HP wall (25 Spores)\n" +
    "• Chicken of the Woods (Economy): Generates spores (70 Spores)\n\n" +
    "ENEMIES:\n" +
    "• Elf: Fast, low health\n" +
    "• Giant: Slow, high HP tank\n" +
    "• Witch: Ranged spellcaster\n\n" +
    "BUILDING PHASE & DEFENSE:\n" +
    "• 30-second building phase before attack (or click Start Wave Early).\n" +
    "• You have 3 lives. If 3 enemies reach the left edge, game is lost!";

  k.add([
    k.text(rulesBody, { size: 15, width: 660, lineSpacing: 5 }),
    k.pos(k.center().x, k.height() * 0.48),
    k.anchor("center"),
    k.color(220, 220, 220)
  ]);

  const backBtn = k.add([
    k.rect(160, 45),
    k.pos(k.center().x, k.height() * 0.88),
    k.anchor("center"),
    k.color(180, 70, 70),
    k.area(),
  ]);
  k.add([
    k.text("BACK", { size: 18 }),
    k.pos(k.center().x, k.height() * 0.88),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);
  backBtn.onClick(() => k.go("menu"));
});

// ==========================================
// SCENE 3: MAIN GAMEPLAY
// ==========================================
k.scene("game", ({ wave, extraSpores, isSecretMode }) => {
  let currentWave = wave;
  let currentSpores = isSecretMode ? 999999 : (BASE_WAVE_SPORES[currentWave] || 100) + extraSpores;
  let selectedTower = "shooter";
  let enemiesEscaped = 0;
  let escapedWarningShown = false;
  let waveFinishedTriggered = false;

  // Building Phase Timer
  let buildTimeRemaining = isSecretMode ? 0 : 30;
  let isBuildingPhase = !isSecretMode;

  // Wave Enemy Queue Construction
  let enemyQueue = [];
  if (isSecretMode) {
    for (let i = 0; i < 100; i++) enemyQueue.push("elf");
    for (let i = 0; i < 50; i++) enemyQueue.push("witch");
    for (let i = 0; i < 30; i++) enemyQueue.push("giant");
  } else {
    const comp = WAVE_COMPOSITIONS[currentWave] || { elf: 5, witch: 0, giant: 0 };
    for (let i = 0; i < comp.elf; i++) enemyQueue.push("elf");
    for (let i = 0; i < comp.witch; i++) enemyQueue.push("witch");
    for (let i = 0; i < comp.giant; i++) enemyQueue.push("giant");
  }

  let totalEnemiesInWave = enemyQueue.length;
  let spawnedEnemiesCount = 0;

  const GRID_ROWS = 5;
  const GRID_COLS = 9;
  const gridTiles = [];

  const MARGIN_LEFT = k.width() * 0.16;
  const MARGIN_TOP = k.height() * 0.14;
  const AVAILABLE_WIDTH = k.width() - MARGIN_LEFT - k.width() * 0.04;
  const AVAILABLE_HEIGHT = k.height() - MARGIN_TOP - k.height() * 0.05;

  const TILE_W = AVAILABLE_WIDTH / GRID_COLS;
  const TILE_H = AVAILABLE_HEIGHT / GRID_ROWS;

  const TOWER_SPECS = {
    shooter: { name: "Shooter", cost: 50, color: k.rgb(220, 60, 60), hp: 40 },
    wall: { name: "Wall", cost: 25, color: k.rgb(160, 110, 50), hp: 150 },
    eco: { name: "Economy", cost: 70, color: k.rgb(240, 210, 50), hp: 30 },
  };

  // Top-Left Return Button & Confirmation
  const returnBtn = k.add([
    k.rect(100, 35),
    k.pos(15, 15),
    k.color(180, 60, 60),
    k.area(),
    k.fixed(),
  ]);
  k.add([
    k.text("RETURN", { size: 12 }),
    k.pos(65, 32),
    k.anchor("center"),
    k.fixed(),
  ]);

  returnBtn.onClick(() => showExitConfirmation());

  function showExitConfirmation() {
    k.paused = true;

    k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0),
      k.opacity(0.8),
      k.fixed(),
      k.z(200),
      "exitUI"
    ]);

    k.add([
      k.rect(480, 220),
      k.pos(k.center()),
      k.anchor("center"),
      k.color(50, 50, 50),
      k.fixed(),
      k.z(201),
      "exitUI"
    ]);

    k.add([
      k.text("Are you sure you want to exit?\nYou might lose all your progress!", { size: 16, width: 420, align: "center" }),
      k.pos(k.center().x, k.center().y - 40),
      k.anchor("center"),
      k.fixed(),
      k.z(202),
      "exitUI"
    ]);

    const yesBtn = k.add([
      k.rect(120, 40),
      k.pos(k.center().x - 80, k.center().y + 40),
      k.anchor("center"),
      k.color(180, 60, 60),
      k.area(),
      k.fixed(),
      k.z(202),
      "exitUI"
    ]);
    k.add([
      k.text("YES", { size: 16 }),
      k.pos(k.center().x - 80, k.center().y + 40),
      k.anchor("center"),
      k.fixed(),
      k.z(203),
      "exitUI"
    ]);
    yesBtn.onClick(() => {
      k.paused = false;
      k.go("menu");
    });

    const noBtn = k.add([
      k.rect(120, 40),
      k.pos(k.center().x + 80, k.center().y + 40),
      k.anchor("center"),
      k.color(80, 160, 80),
      k.area(),
      k.fixed(),
      k.z(202),
      "exitUI"
    ]);
    k.add([
      k.text("NO", { size: 16 }),
      k.pos(k.center().x + 80, k.center().y + 40),
      k.anchor("center"),
      k.fixed(),
      k.z(203),
      "exitUI"
    ]);
    noBtn.onClick(() => {
      k.destroyAll("exitUI");
      k.paused = false;
    });
  }

  // HUD Elements
  const sporeText = k.add([
    k.text(`Spores: ${isSecretMode ? "∞" : currentSpores} | Wave: ${isSecretMode ? "SECRET" : currentWave + "/7"}`, { size: 18 }),
    k.pos(130, 22),
    k.color(255, 235, 120),
    k.fixed(),
  ]);

  const phaseTimerText = k.add([
    k.text("", { size: 18 }),
    k.pos(k.width() - 250, 22),
    k.color(255, 150, 100),
    k.fixed(),
  ]);

  // Start Wave Early Button UI
  let earlyStartBtn = null;
  let earlyStartLabel = null;

  function endBuildingPhase() {
    isBuildingPhase = false;
    phaseTimerText.text = "ATTACK PHASE!";
    if (earlyStartBtn) k.destroy(earlyStartBtn);
    if (earlyStartLabel) k.destroy(earlyStartLabel);
  }

  if (isBuildingPhase) {
    earlyStartBtn = k.add([
      k.rect(170, 32),
      k.pos(k.width() - 250, 50),
      k.color(80, 150, 80),
      k.area(),
      k.fixed(),
      "buildUI"
    ]);

    earlyStartLabel = k.add([
      k.text("START WAVE EARLY", { size: 12 }),
      k.pos(k.width() - 165, 66),
      k.anchor("center"),
      k.fixed(),
      "buildUI"
    ]);

    earlyStartBtn.onClick(() => {
      endBuildingPhase();
    });

    const timerLoop = k.loop(1, () => {
      if (k.paused) return;
      if (!isBuildingPhase) {
        timerLoop.cancel();
        return;
      }
      buildTimeRemaining--;
      phaseTimerText.text = `Build Phase: ${buildTimeRemaining}s`;

      if (buildTimeRemaining <= 0) {
        endBuildingPhase();
        timerLoop.cancel();
      }
    });
  }

  // Escaped Counter Display above Grid
  const boundaryCounterLabel = k.add([
    k.text("", { size: 36 }),
    k.pos(MARGIN_LEFT + AVAILABLE_WIDTH / 2, MARGIN_TOP - 30),
    k.anchor("center"),
    k.color(255, 50, 50),
    k.fixed(),
    k.z(90),
  ]);

  function updateSpores(amt) {
    if (isSecretMode) return;
    currentSpores += amt;
    sporeText.text = `Spores: ${currentSpores} | Wave: ${currentWave}/7`;
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
    ]);

    k.add([
      k.text(`${spec.name}\n(${spec.cost} S)`, { size: 13 }),
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

  // Grid Creation
  for (let row = 0; row < GRID_ROWS; row++) {
    gridTiles[row] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      const x = MARGIN_LEFT + col * TILE_W;
      const y = MARGIN_TOP + row * TILE_H;

      const tile = k.add([
        k.rect(TILE_W - 4, TILE_H - 4),
        k.pos(x, y),
        k.color(45, 65, 45),
        k.opacity(0.8),
        k.area(),
        "tile",
        { row, col, occupied: false },
      ]);

      tile.onClick(() => {
        if (tile.occupied) return;

        const spec = TOWER_SPECS[selectedTower];
        if (currentSpores >= spec.cost || isSecretMode) {
          updateSpores(-spec.cost);
          tile.occupied = true;

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

  // Pre-Wave Educational Fact Modals (3 consecutive popups for Wave 1)
  function showPreWaveEducation(facts, callback) {
    if (isSecretMode || !facts || facts.length === 0) {
      callback();
      return;
    }

    let factIndex = 0;

    function renderFact() {
      k.destroyAll("eduUI");
      k.paused = true;

      const fact = facts[factIndex];

      k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0.85),
        k.fixed(),
        k.z(150),
        "eduUI"
      ]);

      k.add([
        k.rect(550, 260),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(240, 230, 200),
        k.fixed(),
        k.z(151),
        "eduUI"
      ]);

      k.add([
        k.text(fact.title, { size: 20 }),
        k.pos(k.center().x, k.center().y - 70),
        k.anchor("center"),
        k.color(40, 40, 40),
        k.fixed(),
        k.z(152),
        "eduUI"
      ]);

      k.add([
        k.text(fact.text, { size: 16, width: 480, align: "center" }),
        k.pos(k.center().x, k.center().y - 10),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.fixed(),
        k.z(152),
        "eduUI"
      ]);

      const isLastFact = factIndex === facts.length - 1;

      const nextBtn = k.add([
        k.rect(140, 40),
        k.pos(k.center().x, k.center().y + 75),
        k.anchor("center"),
        k.color(80, 150, 80),
        k.area(),
        k.fixed(),
        k.z(152),
        "eduUI"
      ]);

      k.add([
        k.text(isLastFact ? "CLOSE" : "NEXT FACT", { size: 14 }),
        k.pos(k.center().x, k.center().y + 75),
        k.anchor("center"),
        k.fixed(),
        k.z(153),
        "eduUI"
      ]);

      nextBtn.onClick(() => {
        factIndex++;
        if (factIndex < facts.length) {
          renderFact();
        } else {
          k.destroyAll("eduUI");
          k.paused = false;
          callback();
        }
      });
    }

    renderFact();
  }

  // Enemy Intro Modal (Wave 1)
  function checkEnemyIntro(enemyType, callback) {
    if (!seenEnemies[enemyType] && currentWave === 1 && !isSecretMode) {
      seenEnemies[enemyType] = true;
      k.paused = true;

      k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0.85),
        k.fixed(),
        k.z(160),
        "introUI"
      ]);

      k.add([
        k.rect(500, 220),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(220, 210, 180),
        k.fixed(),
        k.z(161),
        "introUI"
      ]);

      k.add([
        k.text(enemyIntroData[enemyType], { size: 16, width: 440, align: "center" }),
        k.pos(k.center().x, k.center().y - 20),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.fixed(),
        k.z(162),
        "introUI"
      ]);

      const okBtn = k.add([
        k.rect(120, 40),
        k.pos(k.center().x, k.center().y + 55),
        k.anchor("center"),
        k.color(180, 80, 80),
        k.area(),
        k.fixed(),
        k.z(162),
        "introUI"
      ]);

      k.add([
        k.text("CONTINUE", { size: 14 }),
        k.pos(k.center().x, k.center().y + 55),
        k.anchor("center"),
        k.fixed(),
        k.z(163),
        "introUI"
      ]);

      okBtn.onClick(() => {
        k.destroyAll("introUI");
        k.paused = false;
        callback();
      });
    } else {
      callback();
    }
  }

  // Enemy Spawner Loop
  k.loop(2.5, () => {
    if (isBuildingPhase || enemyQueue.length === 0) return;

    const enemyType = enemyQueue.shift();
    const row = Math.floor(Math.random() * GRID_ROWS);
    const spawnX = k.width() + 20;
    const spawnY = MARGIN_TOP + row * TILE_H + TILE_H / 2;

    let enemySpec = { color: k.rgb(80, 200, 80), hp: 35, speed: 50, size: [30, 40] };
    if (enemyType === "giant") {
      enemySpec = { color: k.rgb(130, 130, 130), hp: 120, speed: 25, size: [45, 55] };
    } else if (enemyType === "witch") {
      enemySpec = { color: k.rgb(160, 60, 200), hp: 50, speed: 40, size: [35, 45] };
    }

    checkEnemyIntro(enemyType, () => {
      spawnedEnemiesCount++;
      k.add([
        k.rect(enemySpec.size[0], enemySpec.size[1]),
        k.pos(spawnX, spawnY),
        k.anchor("center"),
        k.color(enemySpec.color),
        k.area(),
        "enemy",
        {
          type: enemyType,
          row,
          hp: enemySpec.hp,
          speed: enemySpec.speed,
          eating: false,
          lastWitchShot: 0,
        },
      ]);
    });
  });

  // Main Loop Rules
  k.onUpdate("mushTower", (m) => {
    if (m.type === "shooter") {
      const enemiesInRow = k.get("enemy").filter((e) => e.row === m.row && e.pos.x > m.pos.x);
      if (enemiesInRow.length > 0 && k.time() - m.lastShot > 1.2) {
        m.lastShot = k.time();
        k.add([
          k.circle(8),
          k.pos(m.pos.x + 15, m.pos.y),
          k.color(255, 80, 80),
          k.area(),
          k.move(0, 320),
          "playerBullet",
          { damage: 15, row: m.row },
        ]);
      }
    }
    if (m.type === "eco" && k.time() - m.lastEco > 6) {
      m.lastEco = k.time();
      updateSpores(25);
    }
  });

  k.onUpdate("enemy", (e) => {
    if (!e.eating&&k.paused===false) e.move(-e.speed, 0);

    // Left Edge Boundary Breach
    if (e.pos.x <= MARGIN_LEFT) {
      k.destroy(e);
      enemiesEscaped++;

      boundaryCounterLabel.text = `${enemiesEscaped}/3`;
      boundaryCounterLabel.textSize = 54;
      k.wait(0.3, () => { if (boundaryCounterLabel.exists()) boundaryCounterLabel.textSize = 36; });

      if (enemiesEscaped === 1 && !escapedWarningShown) {
        escapedWarningShown = true;
        k.paused = true;

        k.add([
          k.rect(k.width(), k.height()),
          k.color(0, 0, 0),
          k.opacity(0.85),
          k.fixed(),
          k.z(190),
          "warnUI"
        ]);

        k.add([
          k.rect(520, 200),
          k.pos(k.center()),
          k.anchor("center"),
          k.color(220, 100, 100),
          k.fixed(),
          k.z(191),
          "warnUI"
        ]);

        k.add([
          k.text("WARNING!\nOne enemy has crossed the towers!\nYou have two more chances.", { size: 18, align: "center", width: 460 }),
          k.pos(k.center().x, k.center().y - 20),
          k.anchor("center"),
          k.color(255, 255, 255),
          k.fixed(),
          k.z(192),
          "warnUI"
        ]);

        const cBtn = k.add([
          k.rect(120, 40),
          k.pos(k.center().x, k.center().y + 50),
          k.anchor("center"),
          k.color(50, 50, 50),
          k.area(),
          k.fixed(),
          k.z(192),
          "warnUI"
        ]);

        k.add([
          k.text("OK", { size: 16 }),
          k.pos(k.center().x, k.center().y + 50),
          k.anchor("center"),
          k.fixed(),
          k.z(193),
          "warnUI"
        ]);

        cBtn.onClick(() => {
          k.destroyAll("warnUI");
          k.paused = false;
        });
      }

      if (enemiesEscaped >= 3) {
        k.go("lose");
      }
    }

    if (e.type === "witch" && !e.eating) {
      const towersInRow = k.get("mushTower").filter((m) => m.row === e.row && m.pos.x < e.pos.x);
      if (towersInRow.length > 0 && k.time() - e.lastWitchShot > 2.5) {
        e.lastWitchShot = k.time();
        k.add([
          k.circle(7),
          k.pos(e.pos.x - 15, e.pos.y),
          k.color(200, 50, 255),
          k.area(),
          k.move(180, 220),
          "enemyBullet",
          { damage: 12, row: e.row },
        ]);
      }
    }

 
    // Check Win Condition for Current Wave
    if (enemyQueue.length === 0 && k.get("enemy").length === 0 && spawnedEnemiesCount >= totalEnemiesInWave && !waveFinishedTriggered) {
      waveFinishedTriggered = true;
      if (isSecretMode) {
        k.go("win", { isSecretMode: true });
      } else {
        showWaveVictoryModal();
      }
    }
  });

  k.onCollide("playerBullet", "enemy", (b, e) => {
    e.hp -= b.damage;
    k.destroy(b);
    if (e.hp <= 0) {
      k.destroy(e);
      updateSpores(15);
    }
  });

  k.onCollide("enemyBullet", "mushTower", (b, m) => {
    m.hp -= b.damage;
    k.destroy(b);
    if (m.hp <= 0) {
      m.tileRef.occupied = false;
      k.destroy(m);
    }
  });

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

  // Mid-Wave Victory Popup Modal
  function showWaveVictoryModal() {
    k.paused = true;

    k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0),
      k.opacity(0.85),
      k.fixed(),
      k.z(165),
      "victoryUI"
    ]);

    k.add([
      k.rect(560, 260),
      k.pos(k.center()),
      k.anchor("center"),
      k.color(240, 230, 200),
      k.fixed(),
      k.z(166),
      "victoryUI"
    ]);

    const msg = currentWave < 7
      ? `Congratulations! You survived wave ${currentWave}/7!\n\nContinue to the after-attack quiz to earn extra spores for the next wave!`
      : `Congratulations! You completed all the waves!\n\nGo to the main menu and unlock the secret mode!`;

    k.add([
      k.text(msg, { size: 18, width: 500, align: "center" }),
      k.pos(k.center().x, k.center().y - 30),
      k.anchor("center"),
      k.color(40, 40, 40),
      k.fixed(),
      k.z(167),
      "victoryUI"
    ]);

    const continueBtn = k.add([
      k.rect(180, 45),
      k.pos(k.center().x, k.center().y + 65),
      k.anchor("center"),
      k.color(80, 160, 80),
      k.area(),
      k.fixed(),
      k.z(167),
      "victoryUI"
    ]);

    k.add([
      k.text(currentWave < 7 ? "START QUIZ" : "MAIN MENU", { size: 16 }),
      k.pos(k.center().x, k.center().y + 65),
      k.anchor("center"),
      k.fixed(),
      k.z(168),
      "victoryUI"
    ]);

    continueBtn.onClick(() => {
      k.destroyAll("victoryUI");
      k.paused = false;
      if (currentWave < 7) {
        triggerPostWaveQuizzes();
      } else {
        secretModeUnlocked = true;
        k.go("win", { isSecretMode: false });
      }
    });
  }

  // Post-Wave Quizzes & Wave Progression Prompt
  function triggerPostWaveQuizzes() {
    const quizzes = waveQuizData[currentWave] || [];
    let quizIdx = 0;
    let quizSporesEarned = 0;

    function renderQuiz() {
      if (quizIdx >= quizzes.length) {
        showNextWavePrompt(quizSporesEarned);
        return;
      }

      k.paused = true;
      const qData = quizzes[quizIdx];

      k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0.85),
        k.fixed(),
        k.z(170),
        "quizUI"
      ]);

      k.add([
        k.rect(580, 360),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(230, 220, 190),
        k.fixed(),
        k.z(171),
        "quizUI"
      ]);

      k.add([
        k.text(`POST-WAVE ${currentWave} QUIZ (${quizIdx + 1}/${quizzes.length})`, { size: 20 }),
        k.pos(k.center().x, k.center().y - 130),
        k.anchor("center"),
        k.color(40, 40, 40),
        k.fixed(),
        k.z(172),
        "quizUI"
      ]);

      k.add([
        k.text(qData.q, { size: 16, width: 480, align: "center" }),
        k.pos(k.center().x, k.center().y - 75),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.fixed(),
        k.z(172),
        "quizUI"
      ]);

      qData.options.forEach((optText, idx) => {
        const btnY = k.center().y - 10 + idx * 48;

        const optBtn = k.add([
          k.rect(460, 38),
          k.pos(k.center().x, btnY),
          k.anchor("center"),
          k.color(100, 100, 100),
          k.area(),
          k.fixed(),
          k.z(172),
          "quizUI"
        ]);

        k.add([
          k.text(optText, { size: 14 }),
          k.pos(k.center().x, btnY),
          k.anchor("center"),
          k.fixed(),
          k.z(173),
          "quizUI"
        ]);

        optBtn.onClick(() => {
          if (idx === qData.correct) {
            quizSporesEarned += qData.reward;
          }
          k.destroyAll("quizUI");
          quizIdx++;
          renderQuiz();
        });
      });
    }

    function showNextWavePrompt(extraSpores) {
      const nextWaveNum = currentWave + 1;

      k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0.85),
        k.fixed(),
        k.z(180),
        "nextUI"
      ]);

      k.add([
        k.rect(540, 240),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(240, 230, 200),
        k.fixed(),
        k.z(181),
        "nextUI"
      ]);

      k.add([
        k.text(`Ready for wave #${nextWaveNum}\n(with ${extraSpores} extra spores you earned from the quiz)?`, { size: 18, width: 480, align: "center" }),
        k.pos(k.center().x, k.center().y - 30),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.fixed(),
        k.z(182),
        "nextUI"
      ]);

      const yesBtn = k.add([
        k.rect(120, 40),
        k.pos(k.center().x - 70, k.center().y + 50),
        k.anchor("center"),
        k.color(80, 160, 80),
        k.area(),
        k.fixed(),
        k.z(182),
        "nextUI"
      ]);

      k.add([
        k.text("YES", { size: 16 }),
        k.pos(k.center().x - 70, k.center().y + 50),
        k.anchor("center"),
        k.fixed(),
        k.z(183),
        "nextUI"
      ]);

      yesBtn.onClick(() => {
        k.destroyAll("nextUI");
        k.paused = false;
        k.go("game", { wave: nextWaveNum, extraSpores: extraSpores, isSecretMode: false });
      });

      const noBtn = k.add([
        k.rect(120, 40),
        k.pos(k.center().x + 70, k.center().y + 50),
        k.anchor("center"),
        k.color(180, 60, 60),
        k.area(),
        k.fixed(),
        k.z(182),
        "nextUI"
      ]);

      k.add([
        k.text("NO", { size: 16 }),
        k.pos(k.center().x + 70, k.center().y + 50),
        k.anchor("center"),
        k.fixed(),
        k.z(183),
        "nextUI"
      ]);

      noBtn.onClick(() => {
        k.destroyAll("nextUI");
        k.paused = false;
        k.go("menu");
      });
    }

    renderQuiz();
  }

  showPreWaveEducation(waveEducationData[currentWave], () => {});
});

// ==========================================
// SCENE 4: GAME OVER (LOSE)
// ==========================================
k.scene("lose", () => {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(120, 10, 10),
    k.fixed()
  ]);

  k.add([
    k.text("YOU LOSE", { size: 52 }),
    k.pos(k.center().x, k.height() * 0.4),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);

  const restartBtn = k.add([
    k.rect(220, 50),
    k.pos(k.center().x, k.height() * 0.6),
    k.anchor("center"),
    k.color(40, 40, 40),
    k.area(),
  ]);

  k.add([
    k.text("TRY AGAIN", { size: 20 }),
    k.pos(k.center().x, k.height() * 0.6),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);

  restartBtn.onClick(() => k.go("menu"));
});

// ==========================================
// SCENE 5: VICTORY (WIN)
// ==========================================
k.scene("win", ({ isSecretMode }) => {
  k.add([
    k.text(isSecretMode ? "SECRET MODE CLEARED!" : "VICTORY! ALL WAVES CLEARED!", { size: 30 }),
    k.pos(k.center().x, k.height() * 0.35),
    k.anchor("center"),
    k.color(255, 230, 100)
  ]);

  if (!isSecretMode) {
    k.add([
      k.text("You have unlocked Secret Mode on the Main Menu!", { size: 18 }),
      k.pos(k.center().x, k.height() * 0.45),
      k.anchor("center"),
      k.color(200, 255, 200)
    ]);
  }

  const menuBtn = k.add([
    k.rect(220, 50),
    k.pos(k.center().x, k.height() * 0.6),
    k.anchor("center"),
    k.color(80, 160, 80),
    k.area(),
  ]);

  k.add([
    k.text("MAIN MENU", { size: 20 }),
    k.pos(k.center().x, k.height() * 0.6),
    k.anchor("center"),
    k.color(255, 255, 255)
  ]);

  menuBtn.onClick(() => k.go("menu"));
});

// Start app on main menu
k.go("menu");