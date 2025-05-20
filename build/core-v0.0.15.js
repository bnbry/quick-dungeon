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

    return CoreState;
  },

  handleAction: function (playerAction) {
    return Core.actionHandlers[playerAction]();
  },

  handleNone: function () {
    return CoreState;
  },

  handleStart: function () {
    return Core.enterReset();
  },

  handleTutorial: function () {
    return CoreState;
  },

  handleAbout: function () {
    return CoreState;
  },

  handleReset: function () {
    return Core.enterReset();
  },

  handleMove: function () {
    CoreState.currentRoom += 1;

    if (CoreState.currentRoom >= CoreState.rooms.length) {
      return Core.enterEnding();
    }

    return Core.enterBattle();
  },

  handleTalk: function () {
    return CoreState;
  },

  handleInspect: function () {
    return CoreState;
  },

  handleAttack: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.drawTurn();
    } else if (enemyAction == "defend") {
      Core.loseTurn();
    } else if (enemyAction == "cast") {
      Core.winTurn();
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleDefend: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.winTurn();
    } else if (enemyAction == "defend") {
      Core.drawTurn();
    } else if (enemyAction == "cast") {
      Core.loseTurn();
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleCast: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      Core.loseTurn();
    } else if (enemyAction == "defend") {
      Core.winTurn();
    } else if (enemyAction == "cast") {
      Core.drawTurn();
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  winTurn: function () {
    CoreState.actionResult = "win";
    CoreState.enemy.health -= 1;
  },

  loseTurn: function () {
    CoreState.actionResult = "lose";
    CoreState.player.health -= 1;
  },

  drawTurn: function () {
    CoreState.actionResult = "draw";
  },

  enterReset: function () {
    CoreState.mode = "reset";
    CoreState.currentRoom = 1;
    CoreState.player.health = CoreState.player.maxHealth;
    CoreState.enemy = {};
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.enemyAction = "none";
    CoreState.selectedAction = "none";
    CoreState.actions = Core.availableActions(CoreState.mode);

    return CoreState;
  },

  enterBattle: function () {
    CoreState.mode = "battle";
    CoreState.player.perception += 1;
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.enemyAction = "none";
    CoreState.selectedAction = "none";
    CoreState.actions = Core.availableActions(CoreState.mode);
    CoreState.enemy = Core.currentEnemy(CoreState);

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
        mode: "reset",
        enemy: {},
        discovered: true,
      },
      {
        mode: "battle",
        enemy: Core.generateEnemy(2),
        discovered: false,
      },
      {
        mode: "battle",
        enemy: Core.generateEnemy(3),
        discovered: false,
      },
      {
        mode: "battle",
        enemy: Core.generateEnemy(4),
        discovered: false,
      },
    ];
  },

  generateBoss: function () {
    const enemyBase = Util.selectRandom(Core.bosses);
    const enemy = {
      ...enemyBase,
      name: Util.selectRandom(Core.names),
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
      healthMultiplier: 1,
    },
    {
      type: "attacker",
      healthMultiplier: 1,
    },
    {
      type: "caster",
      healthMultiplier: 1,
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
  /**
   * Enemy Names
   *
   * This data is used to select a "unique" name for each enemy. The list is mostly taken from:
   * https://medium.com/@barelyharebooks/a-master-list-of-300-fantasy-names-characters-towns-and-villages-47c113f6a90b
   */
  names: [
    "Lydan",
    "Syrin",
    "Ptorik",
    "Joz",
    "Varog",
    "Gethrod",
    "Hezra",
    "Feron",
    "Ophni",
    "Gatlin",
    "Krinn",
    "Revvyn",
    "Hodus",
    "Kontas",
    "Azamarr",
    "Jather",
    "Tekren",
    "Matti",
    "Baske",
    "Kagran",
    "Gargul",
    "Vadim",
    "Fangar",
    "Krisni",
    "Baxar",
    "Rankar",
    "Verssek",
    "Rivik",
    "Zagaroth",
    "Dagrod",
    "Gentar",
    "Feston",
    "Syrana",
    "Resha",
    "Varin",
    "Yuni",
    "Talis",
    "Kessa",
    "Magaltie",
    "Desmina",
    "Krynna",
    "Asralyn",
    "Herra",
    "Pret",
    "Tessel",
    "Zara",
    "Belen",
    "Rei",
    "Ciscra",
    "Temy",
    "Estyn",
    "Maarika",
    "Lynorr",
    "Tiv",
    "Annihya",
    "Semet",
    "Tamrin",
    "Antia",
    "Reslyn",
    "Basak",
    "Vixra",
    "Pekka",
    "Xavia",
    "Beatha",
    "Yarri",
    "Liris",
    "Sonali",
    "Razra",
    "Soko",
    "Maeve",
    "Everen",
    "Yelina",
    "Morwena",
    "Hagar",
    "Palra",
    "Elysa",
    "Ketra",
    "Agama",
    "Thesra",
    "Tezani",
    "Ralia",
    "Naima",
    "Rydna",
    "Baakshi",
    "Ibera",
    "Phlox",
    "Braithe",
    "Taewen",
    "Silene",
    "Phressa",
    "Anika",
    "Rasy",
    "Vita",
    "Drusila",
    "Minha",
    "Surane",
    "Lassona",
    "Merula",
    "Lyla",
    "Zet",
    "Orett",
    "Naphtalia",
    "Turi",
    "Rhays",
    "Shike",
    "Hartie",
    "Beela",
    "Leska",
    "Vemery",
    "Lunex",
    "Fidess",
    "Tisette",
    "Partha",
    "Aleksi",
    "Erol",
    "Lorre",
    "Renn",
    "Dylane",
    "Cormyl",
    "Laurille",
  ],

  availableActions: function (mode) {
    const actions = {
      attract: ["start", "tutorial", "about"],
      reset: ["move", "talk", "inspect"],
      battle: ["attack", "cast", "defend"],
      victory: ["move", "talk", "inspect"],
      defeat: ["reset"],
      ending: ["move", "talk", "inspect"],
    };

    return actions[mode];
  },
};

Core.actionHandlers = {
  none: Core.handleNone,
  attack: Core.handleAttack,
  defend: Core.handleDefend,
  cast: Core.handleCast,
  move: Core.handleMove,
  talk: Core.handleTalk,
  inspect: Core.handleInspect,
  start: Core.handleStart,
  tutorial: Core.handleTutorial,
  about: Core.handleAbout,
  reset: Core.handleReset,
};

Util = {
  selectRandom: function (collection) {
    if (collection.length == 0) {
      return undefined;
    }

    return collection[Math.floor(Math.random() * collection.length)];
  },
};
