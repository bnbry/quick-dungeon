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
      `${gameState.enemy.name} the ${gameState.enemy.kind} stands before you.`,
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
    UI.private.streamMessage(
      `You have picked an action, ${target.dataset.value}`
    );
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
        messages.push(`${gameState.enemy.name} swings their bludgeon.`);
        messages.push("Sword and bludgeon clang against each other.");
      } else if (enemyAction == "defend") {
        messages.push(`${gameState.enemy.name} raises their shield.`);
        messages.push(
          "Your sword bounces off the enemies shield, leaving you open to a quick swipe of the bludgeon"
        );
      } else if (enemyAction == "cast") {
        messages.push(`${gameState.enemy.name} attempts to cast a spell`);
        messages.push("Your attack disrupts the enemy, a clean hit");
      }
    } else if (playerAction == "defend") {
      messages.push("You raise your shield and brace for impact.");

      if (enemyAction == "attack") {
        messages.push(`${gameState.enemy.name} swings their bludgeon.`);
        messages.push(
          "You deflect the bludgeon with your shield and strike back at the stunned foe."
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
        messages.push(`${gameState.enemy.name} swings their bludgeon.`);
        messages.push("It strikes you before your incantation is completed.");
      } else if (enemyAction == "defend") {
        messages.push(`${gameState.enemy.name} raises their shield.`);
        messages.push("Shields offer no protection against your wizardy");
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
      if (gameState.player.health == 2) {
        messages.push("Your health is waning");
      } else if (gameState.playerHealth == 1) {
        messages.push("You are near death");
      }
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

  streamMessage: function (message, onComplete) {
    const messageElement = UI.private.createMessageElement();
    const messageLength = message.length;
    const typeDelay = 10; // milliseconds per character
    const messageDelay = 750;

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

  streamMessages: function (messages) {
    if (messages.length == 0) {
      return;
    }

    UI.private.streamMessage(messages[0], function () {
      if (messages.length > 1) {
        UI.private.streamMessages(messages.slice(1));
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
    return {
      name: "Gargul",
      type: "brute",
      kind: "orc",
      health: 3,
      actions: ["attack", "defend", "cast"],
      tell: ["lifts his bludgeon"],
    };
  },
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
