// The Web layer handles all of the details of the web user interface and interacts with the Adapter
const UI = {
  API: {},
  private: {},
};

UI.API = {
  init: function () {
    const gameState = Core.API.init();
    const messages = Adapter.API.introMessages(gameState);
    UI.API.update(gameState, messages);
  },

  update: function (gameState, messages) {
    UI.private.resetActionButton();
    UI.private.streamMessages(messages);
    UI.private.renderActions(gameState);
    UI.private.initListeners();
  },

  onOptionSelect: function (target) {
    const actionValue = target.dataset.value;
    const messages = Adapter.API.optionSelectMessages(actionValue);
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
    const messages = Adapter.API.actionPerformMessages(gameState);

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
    const typeDelay = 5; // milliseconds per character
    const messageDelay = 250;

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
