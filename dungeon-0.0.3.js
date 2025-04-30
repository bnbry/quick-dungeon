// The UI layer handles all of the details of the web user interface and interacts with the Adapter
const UI = {
  API: {},
  private: {},
};

// The Adapter layer translates between the Core layer and UI layer
const Adapter = {
  API: {},
  private: {},
};

// The Core layer handles all of the details of game logic and state
const Core = {
  API: {},
  private: {},
};

UI.API = {
  init: function () {
    const gameState = Core.API.init();
    const messages = [
      "Very much an early WIP. Thanks for sneaking a peek.",
      "You wake in a torchlit cave. Sword, shield and magic catalyst.",
      `${gameState.enemy.name} the ${gameState.enemy.kind} stands menacingly before you.`,
      `They wield ${gameState.enemy.weapon}, shield, and pyromancer's flame.`,
      "Select an action option and execute it with the primary button.",
    ];
    UI.API.update(gameState, messages);
  },

  update: function (gameState, messages) {
    UI.private.resetActionButton();
    UI.private.streamMessages(messages);
    UI.private.renderActions(gameState);
    UI.private.initListeners();
  },

  onOptionSelect: function (target) {
    const messages = [];
    const actionValue = target.dataset.value;

    if (actionValue == "attack") {
      messages.push(
        "You ready your sword to cut down your foe before they can cast a spell."
      );
    } else if (actionValue == "cast") {
      messages.push(
        "You mentally recite the incantation, preparing to pierce the foes defenses."
      );
    } else if (actionValue == "defend") {
      messages.push(
        "You flex your shield arm and prepare to block the foes melee attack."
      );
    }

    UI.private.streamMessages(messages);
    const actionButton = UI.targets.queryActionButton();
    actionButton.dataset.value = target.dataset.value;
    actionButton.textContent = target.dataset.value;
    actionButton.removeAttribute("disabled");
  },

  onActionPerform: function (target) {
    if (target.hasAttribute("disabled")) {
      return;
    }

    if (Core.state.player.health <= 0) {
      UI.private.streamMessages(["You're already dead"]);
      return;
    } else if (Core.state.enemy.health <= 0) {
      UI.private.streamMessages(["They're already dead"]);
      return;
    }

    const gameState = Core.API.handleAction(target.dataset.value);
    const playerAction = gameState.playerAction;
    const enemyAction = gameState.enemyAction;
    const messages = [];

    // naive rock paper scissors
    if (playerAction == "attack") {
      messages.push("You swing your sword ferociously.");

      if (enemyAction == "attack") {
        messages.push(
          `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`
        );
        messages.push(
          `Sword and ${gameState.enemy.weapon} clang against each other.`
        );
      } else if (enemyAction == "defend") {
        messages.push(`${gameState.enemy.name} raises their shield.`);
        messages.push(
          `Your sword bounces off the enemies shield, leaving you open to a quick swipe of the ${gameState.enemy.weapon}`
        );
      } else if (enemyAction == "cast") {
        messages.push(`${gameState.enemy.name} attempts to cast a spell`);
        messages.push("Your attack disrupts the enemy, a clean hit");
      }
    } else if (playerAction == "defend") {
      messages.push("You raise your shield and brace for impact.");

      if (enemyAction == "attack") {
        messages.push(
          `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`
        );
        messages.push(
          `You deflect the ${gameState.enemy.weapon} with your shield and strike back at the stunned foe.`
        );
      } else if (enemyAction == "defend") {
        messages.push(`${gameState.enemy.name} raises their shield.`);
        messages.push(
          "You stare each other down, neither of you gaining ground behind your shields."
        );
      } else if (enemyAction == "cast") {
        messages.push(`${gameState.enemy.name} casts dark flame.`);
        messages.push("Your shield offers no defense to the forbidden arts.");
      }
    } else if (playerAction == "cast") {
      messages.push("You ready your catalyst to cast firebolt.");

      if (enemyAction == "attack") {
        messages.push(
          `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`
        );
        messages.push("It strikes you before your incantation is completed.");
      } else if (enemyAction == "defend") {
        messages.push(`${gameState.enemy.name} raises their shield.`);
        messages.push("Shields offer no protection against your wizardry");
      } else if (enemyAction == "cast") {
        messages.push(`${gameState.enemy.name} casts a magic barrier.`);
        messages.push("Your spell is unable to penetrate the barrier.");
      }
    }

    if (gameState.player.health <= 0) {
      messages.push(`${gameState.enemy.name} has defeated you.`, "You died.");
    } else if (gameState.enemy.health <= 0) {
      messages.push(
        `${gameState.enemy.name} has been defeated.`,
        "You won the dungeon because we're still coding it and this is as far as we've made it."
      );
    } else {
      // if (gameState.player.health == 2) {
      //   messages.push("Your health is waning");
      // } else if (gameState.playerHealth == 1) {
      //   messages.push("You are near death");
      // }
      messages.push("Your battle continues");
    }
    UI.API.update(gameState, messages);
  },
};

UI.private = {
  resetActionButton: function () {
    const actionButton = UI.targets.queryActionButton();
    actionButton.setAttribute("disabled", "");
    actionButton.textContent = "Select Action...";
    actionButton.dataset.value = "";
  },

  createMessageElement: function () {
    const messageElement = document.createElement("li");
    UI.targets.queryOutputStream().prepend(messageElement);

    return messageElement;
  },

  printCharacter: function (character, messageElement) {
    messageElement.textContent = messageElement.textContent + character;
  },

  streamMessage: function (message, messageElement, onComplete) {
    const messageLength = message.length;
    const typeDelay = 10; // milliseconds per character
    const messageDelay = 400;

    message.split("").forEach(function (character, index) {
      setTimeout(function () {
        UI.private.printCharacter(character, messageElement);
      }, index * typeDelay);
    });

    setTimeout(function () {
      if (onComplete) {
        onComplete();
      }
    }, typeDelay * messageLength + messageDelay);
  },

  streamMessages: function (messages, messageElement) {
    if (messages.length == 0) {
      return;
    }

    if (messageElement === undefined) {
      messageElement = UI.private.createMessageElement();
    }

    UI.private.streamMessage(messages[0], messageElement, function () {
      if (messages.length > 1) {
        UI.private.printCharacter("\n\n", messageElement);
        UI.private.streamMessages(messages.slice(1), messageElement);
      }
    });
  },

  renderActions: function () {
    const actionsMenu = UI.targets.queryActionsMenu();
    actionsMenu.innerHTML = UI.markup.battleActions;
  },

  initListeners: function () {
    const battleActions = UI.targets.queryBattleActions();

    battleActions.forEach(function (battleAction) {
      battleAction.removeEventListener("click", UI.private.onActionClick);
      battleAction.addEventListener("click", UI.private.onActionClick);
    });

    const actionButton = UI.targets.queryActionButton();
    actionButton.removeEventListener("click", UI.private.onActionPerform);
    actionButton.addEventListener("click", UI.private.onActionPerform);
  },

  // TODO: clarify naming strategy here
  onActionPerform: function (event) {
    UI.API.onActionPerform(event.currentTarget);
  },

  onActionClick: function (event) {
    UI.API.onOptionSelect(event.currentTarget);
  },
};

UI.targets = {
  queryBattleActions: function () {
    return document.querySelectorAll("[data-option='battleAction']");
  },
  queryActionsMenu: function () {
    return document.querySelector("[data-target='actions-menu']");
  },
  queryActionButton: function () {
    return document.querySelector("[data-target='action']");
  },
  queryOutputStream: function () {
    return document.querySelector("[data-target='output-stream']");
  },
};

UI.markup = {
  battleActions: `
    <div class="button-row">
      <a class="button" data-option="battleAction" data-value="attack">attack</a> <!-- thrust, swing, slice -->
      <a class="button" data-option="battleAction" data-value="cast">cast</a> <!-- heal, spell, buff -->
      <a class="button" data-option="battleAction" data-value="defend">defend</a> <!-- guard, parry, dodge/deflect? -->
    </div>
  `,
};

// Core Game Logic

Core.API = {
  init: function () {
    return Core.private.init();
  },
  handleAction: function (playerAction) {
    const enemyActionPool = Core.state.enemy.actions;
    const enemyAction =
      enemyActionPool[Math.floor(Math.random() * enemyActionPool.length)];

    Core.state.enemyAction = enemyAction;
    Core.state.playerAction = playerAction;

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
      type: "brute",
      kind: "Orc",
      weapon: "axe",
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
};

Core.state = {
  player: {
    health: 3,
  },
  enemy: {},
  enemyAction: "",
  playerAction: "",
  actionResult: "", // win, lose, draw
};

Util = {
  selectRandom: function (collection) {
    if (collection.length == 0) {
      return undefined;
    }

    return collection[Math.floor(Math.random() * collection.length)];
  },
};
