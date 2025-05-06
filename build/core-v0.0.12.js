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
      },
      enemy: {},
      rooms: Core.generateRooms(),
      currentRoom: 0,
      enemyAction: "none",
      playerAction: "none",
      actionResult: "", // win, lose, draw
      mode: "attract",
      actions: Core.availableActions("attract"),
      selectedAction: "none",
    };

    return CoreState;
  },

  selectAction: function (playerAction) {
    CoreState.selectedAction = playerAction;

    return CoreState;
  },

  handleAction: function (playerAction) {
    const action = playerAction.charAt(0).toUpperCase() + playerAction.slice(1);

    console.log(action);

    return Core[`handle${action}`]();
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
      CoreState.actionResult = "draw";
    } else if (enemyAction == "defend") {
      CoreState.actionResult = "lose";
      CoreState.player.health -= 1;
    } else if (enemyAction == "cast") {
      CoreState.actionResult = "win";
      CoreState.enemy.health -= 1;
    }

    console.log(enemyAction);
    console.log(CoreState.player.health);
    console.log(CoreState.enemy.health);

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleDefend: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      CoreState.actionResult = "win";
      CoreState.enemy.health -= 1;
    } else if (enemyAction == "defend") {
      CoreState.actionResult = "draw";
    } else if (enemyAction == "cast") {
      CoreState.actionResult = "lose";
      CoreState.player.health -= 1;
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  handleCast: function () {
    Core.commitBattleActions();
    const enemyAction = CoreState.enemyAction;

    if (enemyAction == "attack") {
      CoreState.actionResult = "lose";
      CoreState.player.health -= 1;
    } else if (enemyAction == "defend") {
      CoreState.actionResult = "win";
      CoreState.enemy.health -= 1;
    } else if (enemyAction == "cast") {
      CoreState.actionResult = "draw";
    }

    Core.checkHealthState();
    Core.updateActions();

    return CoreState;
  },

  enterReset: function () {
    CoreState.currentRoom = 1;
    CoreState.player.health = 3;
    CoreState.player.perception += 1;
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.enemyAction = "none";
    CoreState.selectedAction = "none";
    CoreState.mode = "reset";
    CoreState.actions = Core.availableActions(CoreState.mode);

    return CoreState;
  },

  enterBattle: function () {
    CoreState.currentRoom = 2;
    CoreState.playerAction = CoreState.selectedAction;
    CoreState.selectedAction = "none";
    CoreState.mode = "battle";
    CoreState.actions = Core.availableActions(CoreState.mode);
    CoreState.enemy = Core.currentEnemy(CoreState);

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

    console.log(playerAction);
    console.log(enemyActionPool);
    console.log(enemyAction);
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
        enemy: Core.generateEnemy(),
        discovered: false,
      },
      {
        mode: "battle",
        enemy: Core.generateEnemy(),
        discovered: false,
      },
      {
        mode: "battle",
        enemy: Core.generateBoss(),
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

  generateEnemy: function () {
    const enemyBase = Util.selectRandom(Core.enemies);
    const enemy = {
      ...enemyBase,
      name: Util.selectRandom(Core.names),
    };

    return enemy;
  },

  enemies: [
    {
      type: "creep",
      kind: "Goblin",
      weapon: "dagger",
      health: 2,
      maxHealth: 2,
      actions: ["attack", "defend", "defend", "cast"],
    },
    {
      type: "creep",
      kind: "Kobold",
      weapon: "spear",
      health: 2,
      maxHealth: 2,
      actions: ["attack", "defend", "defend", "cast"],
    },
    {
      type: "brute",
      kind: "Orc",
      weapon: "axe",
      health: 4,
      maxHealth: 4,
      actions: ["attack", "attack", "defend", "cast"],
    },
    {
      type: "brute",
      kind: "Ogre",
      weapon: "club",
      health: 4,
      maxHealth: 4,
      actions: ["attack", "attack", "defend", "cast"],
    },
    {
      type: "arcane",
      kind: "Ghoul",
      weapon: "sickle",
      health: 3,
      maxHealth: 3,
      actions: ["attack", "defend", "cast", "cast"],
    },
  ],

  bosses: [
    {
      type: "arcane",
      kind: "Lich",
      weapon: "scythe",
      health: 6,
      maxHealth: 6,
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
    "Colborn",
    "Fintis",
    "Gatlin",
    "Hagalbar",
    "Krinn",
    "Lenox",
    "Revvyn",
    "Hodus",
    "Dimian",
    "Paskel",
    "Kontas",
    "Azamarr",
    "Jather",
    "Tekren",
    "Jareth",
    "Adon",
    "Zaden",
    "Eune",
    "Graff",
    "Matti",
    "Tez",
    "Jessop",
    "Gunnar",
    "Pike",
    "Domnhar",
    "Baske",
    "Jerrick",
    "Tyvrik",
    "Henndar",
    "Jaris",
    "Renham",
    "Kagran",
    "Lassrin",
    "Gargul",
    "Vadim",
    "Yorjan",
    "Khron",
    "Jakrin",
    "Fangar",
    "Roux",
    "Krisni",
    "Baxar",
    "Hawke",
    "Gatlen",
    "Barak",
    "Kadric",
    "Paquin",
    "Moki",
    "Rankar",
    "Lothe",
    "Ryven",
    "Pakker",
    "Embre",
    "Verssek",
    "Dagfinn",
    "Nesso",
    "Eldermar",
    "Rivik",
    "Rourke",
    "Hemm",
    "Sarkin",
    "Blaiz",
    "Agro",
    "Zagaroth",
    "Turrek",
    "Esdel",
    "Lustros",
    "Zenner",
    "Baashar",
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
      victory: ["move"],
      defeat: ["reset"],
    };

    return actions[mode];
  },
};

Util = {
  selectRandom: function (collection) {
    if (collection.length == 0) {
      return undefined;
    }

    return collection[Math.floor(Math.random() * collection.length)];
  },
};
