// The Core layer handles all of the details of game logic and state
// Core Game Logic
let CoreState = {};

const Core = {
  init: function () {
    CoreState = {
      player: {
        health: 3,
        maxHealth: 3,
        perception: 0,
        melee: "sword",
        defend: "shield",
        cast: "catalyst",
      },
      enemy: {},
      rooms: Core.generateRooms(),
      currentEvent: "attractLoad",
      currentRoom: 0,
      mode: "attract",
      actions: Core.availableActions("attract"),
      selectedAction: "none",
      playerAction: "none",
      enemyAction: "none",
      actionResult: "", // win, lose, draw
    };

    return CoreState;
  },

  selectAction: function (playerAction) {
    CoreState.selectedAction = playerAction;
    CoreState.currentEvent = `${playerAction}Select`;

    return CoreState;
  },

  handleAction: function (playerAction) {
    return Core.actionHandlers[playerAction]();
  },

  handleNone: function () {
    return CoreState;
  },

  handleStart: function () {
    CoreState.currentRoom += 1;
    CoreState.player.health = CoreState.player.maxHealth;
    CoreState.currentEvent = "startSuccess";

    return Core.enterBattle();
  },

  handleRetry: function () {
    CoreState.currentRoom = 1;
    CoreState.player.maxHealth += 1;
    CoreState.player.perception += 1;
    CoreState.player.health = CoreState.player.maxHealth;
    CoreState.currentEvent = "retrySuccess";

    return Core.enterBattle();
  },

  handleMove: function () {
    CoreState.currentRoom += 1;

    if (CoreState.currentRoom >= CoreState.rooms.length - 1) {
      CoreState.currentEvent = "gameEnding";
      return Core.enterEnding();
    }

    CoreState.currentEvent = "moveSuccess";

    return Core.enterBattle();
  },

  handleAttack: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.drawTurn("attackDraw");
    } else if (enemyAction == "defend") {
      Core.loseTurn("attackFail");
    } else if (enemyAction == "cast") {
      Core.winTurn("attackSuccess");
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleDefend: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.winTurn("defendSuccess");
    } else if (enemyAction == "defend") {
      Core.drawTurn("defendDraw");
    } else if (enemyAction == "cast") {
      Core.loseTurn("defendFail");
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleCast: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.loseTurn("castFail");
    } else if (enemyAction == "defend") {
      Core.winTurn("castSuccess");
    } else if (enemyAction == "cast") {
      Core.drawTurn("castDraw");
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  winTurn: function (event) {
    CoreState.enemy.health -= 1;
    CoreState.currentEvent = event;
  },

  loseTurn: function (event) {
    CoreState.player.health -= 1;
    CoreState.currentEvent = event;
  },

  drawTurn: function (event) {
    CoreState.currentEvent = event;
  },

  enterBattle: function () {
    CoreState.mode = "battle";
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.enemyAction = "none";
    CoreState.selectedAction = "none";
    CoreState.actions = Core.availableActions(CoreState.mode);
    CoreState.enemy = { ...Core.currentEnemy(CoreState) };

    return CoreState;
  },

  enterEnding: function () {
    CoreState.mode = "ending";
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.enemyAction = "none";
    CoreState.selectedAction = "none";
    CoreState.actions = Core.availableActions(CoreState.mode);
    CoreState.enemy = {};

    return CoreState;
  },

  currentEnemy: function (coreState) {
    const currentRoom = coreState.currentRoom;

    return coreState.rooms[currentRoom].enemy;
  },

  commitBattleActions: function () {
    const playerAction = CoreState.selectedAction;
    const enemyActionPool = CoreState.enemy.actions;
    const enemyAction =
      enemyActionPool[Math.floor(Math.random() * enemyActionPool.length)];

    CoreState.enemyAction = enemyAction;
    CoreState.playerAction = playerAction;
    CoreState.selectedAction = "none";
  },

  checkHealthState: function () {
    if (CoreState.enemy.health <= 0) {
      CoreState.mode = "victory";
    } else if (CoreState.player.health <= 0) {
      CoreState.mode = "defeat";
    }
  },

  updateActions: function () {
    CoreState.actions = Core.availableActions(CoreState.mode);
  },

  generateRooms: function () {
    return [
      {
        mode: "attract",
        enemy: {},
        discovered: true,
      },
      {
        mode: "battle",
        enemy: Core.generateEnemy(2),
        discovered: false,
      },
      // {
      //   mode: "battle",
      //   enemy: Core.generateEnemy(3),
      //   discovered: false,
      // },
      // {
      //   mode: "battle",
      //   enemy: Core.generateEnemy(4),
      //   discovered: false,
      // },
      {
        mode: "ending",
        enemy: {},
        discovered: false,
      },
    ];
  },

  generateBoss: function () {
    const enemyBase = Util.selectRandom(Core.bosses);
    const enemy = {
      ...enemyBase,
    };

    return enemy;
  },

  generateEnemy: function (roomLevel) {
    const enemyBase = Util.selectRandom(Core.enemies);
    const enemy = {
      ...enemyBase,
      id: crypto.randomUUID(),
      actions: Core.generateEnemyActions(enemyBase.type),
      level: roomLevel,
      health: enemyBase.healthMultiplier * roomLevel,
      maxHealth: enemyBase.healthMultiplier * roomLevel,
      tells: {
        attack: crypto.randomUUID(),
        defend: crypto.randomUUID(),
        cast: crypto.randomUUID(),
      },
    };

    return enemy;
  },

  generateEnemyActions: function (type) {
    const actions = {
      defender: ["attack", "defend", "defend", "cast"],
      attacker: ["attack", "attack", "defend", "cast"],
      caster: ["attack", "defend", "cast", "cast"],
    };

    const randomAction = Util.selectRandom(actions[type]);

    return [...actions[type], randomAction];
  },

  enemies: [
    {
      type: "defender",
      healthMultiplier: 2,
    },
    {
      type: "attacker",
      healthMultiplier: 2,
    },
    {
      type: "caster",
      healthMultiplier: 2,
    },
  ],

  bosses: [
    {
      type: "arcane",
      kind: "Lich",
      melee: "scythe",
      cast: "cast",
      health: 1,
      maxHealth: 1,
      actions: ["attack", "defend", "defend", "cast", "cast", "cast"],
    },
  ],

  availableActions: function (mode) {
    const actions = {
      attract: ["start", "none", "none"],
      battle: ["attack", "cast", "defend"],
      victory: ["move", "none", "none"],
      defeat: ["retry", "none", "none"],
      ending: ["none", "none", "none"],
    };

    return actions[mode];
  },
};

Core.actionHandlers = {
  attack: Core.handleAttack,
  defend: Core.handleDefend,
  cast: Core.handleCast,
  move: Core.handleMove,
  start: Core.handleStart,
  retry: Core.handleRetry,
  none: Core.handleNone,
};
