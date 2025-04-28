const Interface = {};
const Core = {};

Interface.API = {
  init: function () {
    const gameState = Core.API.init();
    const messages = [
      "Very much an early WIP. Thanks for sneaking a peak.",
      `${gameState.enemy.name} the ${gameState.enemy.kind} stands before you.`,
    ];
    Interface.private.streamMessages(messages);
    Interface.private.renderActions(gameState);
  },

  onOptionSelect: function (target) {
    Interface.private.streamMessage(
      `You have picked an action, ${target.dataset.value}`
    );
    const actionButton = Interface.targets.queryActionButton();
    actionButton.dataset.value = target.dataset.value;
    actionButton.dataset.option = target.dataset.option;
    actionButton.textContent = target.dataset.value;
    actionButton.removeAttribute("disabled");
  },

  onActionPerform: function (target) {
    Interface.private.streamMessage(
      `you ${target.dataset.value}, but we haven't coded that yet`
    );
  },
};

Interface.private = {
  createMessageElement: function () {
    const messageElement = document.createElement("li");
    Interface.targets.queryOutputStream().prepend(messageElement);

    return messageElement;
  },

  printCharacter: function (character, messageElement) {
    messageElement.textContent = messageElement.textContent + character;
  },

  streamMessage: function (message, onComplete) {
    const messageElement = Interface.private.createMessageElement();
    const messageLength = message.length;
    const typeDelay = 10; // milliseconds per character
    const halfSecond = 500;

    message.split("").forEach(function (character, index) {
      setTimeout(function () {
        Interface.private.printCharacter(character, messageElement);
      }, index * typeDelay);
    });

    setTimeout(function () {
      if (onComplete) {
        onComplete();
      }
    }, typeDelay * messageLength + halfSecond);
  },

  streamMessages: function (messages) {
    Interface.private.streamMessage(messages[0], function () {
      if (messages.length > 1) {
        Interface.private.streamMessages(messages.slice(1));
      }
    });
  },

  renderActions: function () {
    const actionsMenu = Interface.targets.queryActionsMenu();
    actionsMenu.innerHTML = Interface.markup.battleActions;
    Interface.private.initListeners();
  },

  initListeners: function () {
    const battleActions = Interface.targets.queryBattleActions();

    battleActions.forEach(function (battleAction) {
      battleAction.addEventListener("click", function (event) {
        Interface.API.onOptionSelect(event.currentTarget);
      });
    });

    const actionButton = Interface.targets.queryActionButton();
    actionButton.addEventListener("click", function (event) {
      Interface.API.onActionPerform(event.currentTarget);
    });
  },
};

Interface.targets = {
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

Interface.markup = {
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
  update: function (action) {
    return action;
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
      health: 5,
      actions: ["attack"],
      tell: ["lifts his bludgeon"],
    };
  },
};

Core.state = {
  enemy: {},
};
