// The Core layer handles all of the details of game logic and state
// Core Game Logic

const Core = {
  init: function () {
    return Core.private.init();
  },
  selectAction: function (playerAction) {
    Core.state.selectedAction = playerAction;

    return Core.state;
  },
  handleAction: function (playerAction) {
    if (playerAction == "start") {
      Core.state.playerAction = playerAction;
      Core.state.selectedAction = "none";
      Core.state.mode = "reset";
      Core.state.actions = Core.private.availableActions(Core.state.mode);

      return Core.state;
    }

    if (playerAction == "embark") {
      Core.state.playerAction = playerAction;
      Core.state.selectedAction = "none";
      Core.state.mode = "battle";
      Core.state.actions = Core.private.availableActions(Core.state.mode);

      return Core.state;
    }

    const enemyActionPool = Core.state.enemy.actions;
    const enemyAction =
      enemyActionPool[Math.floor(Math.random() * enemyActionPool.length)];

    Core.state.enemyAction = enemyAction;
    Core.state.playerAction = playerAction;
    Core.state.selectedAction = "none";

    // naive rock paper scissors
    if (playerAction == "attack") {
      if (enemyAction == "attack") {
        Core.state.actionResult = "draw";
      } else if (enemyAction == "defend") {
        Core.state.actionResult = "lose";
        Core.state.player.health -= 1;
      } else if (enemyAction == "cast") {
        Core.state.actionResult = "win";
        Core.state.enemy.health -= 1;
      }
    } else if (playerAction == "defend") {
      if (enemyAction == "attack") {
        Core.state.actionResult = "win";
        Core.state.enemy.health -= 1;
      } else if (enemyAction == "defend") {
        Core.state.actionResult = "draw";
      } else if (enemyAction == "cast") {
        Core.state.actionResult = "lose";
        Core.state.player.health -= 1;
      }
    } else if (playerAction == "cast") {
      if (enemyAction == "attack") {
        Core.state.actionResult = "lose";
        Core.state.player.health -= 1;
      } else if (enemyAction == "defend") {
        Core.state.actionResult = "win";
        Core.state.enemy.health -= 1;
      } else if (enemyAction == "cast") {
        Core.state.actionResult = "draw";
      }
    }

    if (Core.state.enemy.health <= 0) {
      Core.state.mode = "victory";
    } else if (Core.state.player.health <= 0) {
      Core.state.mode = "defeat";
    }

    Core.state.actions = Core.private.availableActions(Core.state.mode);

    return Core.state;
  },
};

Core.private = {
  initialized: false,
  init: function () {
    Core.state.enemy = Core.private.generateEnemy();
    return Core.state;
  },
  generateEnemy: function () {
    const enemyBase = Util.selectRandom(Core.private.enemies);
    const enemy = {
      ...enemyBase,
      name: Util.selectRandom(Core.private.names),
    };

    return enemy;
  },
  enemies: [
    {
      type: "creep",
      kind: "Goblin",
      weapon: "dagger",
      health: 2,
      actions: ["attack", "defend", "defend", "cast"],
    },
    {
      type: "creep",
      kind: "Kobold",
      weapon: "spear",
      health: 2,
      actions: ["attack", "defend", "defend", "cast"],
    },
    {
      type: "brute",
      kind: "Orc",
      weapon: "axe",
      health: 4,
      actions: ["attack", "attack", "defend", "cast"],
    },
    {
      type: "brute",
      kind: "Ogre",
      weapon: "club",
      health: 4,
      actions: ["attack", "attack", "defend", "cast"],
    },
    {
      type: "arcane",
      kind: "Ghoul",
      weapon: "sickle",
      health: 3,
      actions: ["attack", "defend", "cast", "cast"],
    },
    {
      type: "arcane",
      kind: "Skeleton",
      weapon: "scythe",
      health: 3,
      actions: ["attack", "defend", "cast", "cast"],
    },
  ],
  /**
   * Enemy Names
   *
   * This data is used to select a "unique" name for each enemy. The list is mostly taken from:
   * https://medium.com/@barelyharebooks/a-master-list-of-300-fantasy-names-characters-towns-and-villages-47c113f6a90b
   */ names: [
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
      reset: ["embark", "talk", "rest"],
      battle: ["attack", "cast", "defend"],
      victory: [],
      defeat: [],
    };

    return actions[mode];
  },
};

Core.state = {
  player: {
    health: 3,
  },
  enemy: {},
  enemyAction: "none",
  playerAction: "none",
  actionResult: "", // win, lose, draw
  mode: "attract",
  actions: Core.private.availableActions("attract"),
  selectedAction: "none",
};

Util = {
  selectRandom: function (collection) {
    if (collection.length == 0) {
      return undefined;
    }

    return collection[Math.floor(Math.random() * collection.length)];
  },
};
