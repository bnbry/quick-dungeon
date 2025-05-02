// The Web layer handles all of the details of the web user interface and interacts with the Adapter
const UI = {
  API: {},
  private: {},
};

let WebState = {
  mode: "battle",
  messages: [],
  actions: [
    {
      value: "attack",
      display: "Attack",
    },
    {
      value: "cast",
      display: "Cast",
    },
    {
      value: "defend",
      display: "Defend",
    },
  ],
};

const Web = {
  init: function () {
    const newState = Adapter.init();
    WebState = {
      ...WebState,
      ...newState,
    };
    Web.update();
  },

  update: function () {
    UI.private.resetCommitButton();
    UI.private.streamMessages(WebState.messages);
    UI.private.renderActions(WebState.actions);
    UI.private.initListeners();
  },

  onActionSelect: function (event) {
    const target = event.currentTarget;
    const actionValue = target.dataset.value;
    const messages = Adapter.optionSelectMessages(actionValue);
    UI.private.streamMessages(messages);

    const commitButton = UI.targets.queryCommitButton();
    commitButton.dataset.value = target.dataset.value;
    commitButton.textContent = target.dataset.value;
    commitButton.removeAttribute("disabled");
  },

  onActionCommit: function (event) {
    const target = event.currentTarget;

    if (target.hasAttribute("disabled")) {
      return;
    }

    // TODO: lift into Adapter
    const newState = Adapter.commitAction(target.dataset.value);

    WebState = {
      ...WebState,
      ...newState,
    };

    Web.update();
  },
};

UI.private = {
  resetCommitButton: function () {
    const commitButton = UI.targets.queryCommitButton();
    commitButton.setAttribute("disabled", "");
    commitButton.textContent = "Select Action...";
    commitButton.dataset.value = "";
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
    const messageDelay = 100;

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
    actionsMenu.innerHTML = UI.markup.actionRow(WebState.actions);
  },

  initListeners: function () {
    const battleActions = UI.targets.queryActions();

    battleActions.forEach(function (battleAction) {
      battleAction.removeEventListener("click", Web.onActionSelect);
      battleAction.addEventListener("click", Web.onActionSelect);
    });

    const actionButton = UI.targets.queryCommitButton();
    actionButton.removeEventListener("click", Web.onActionCommit);
    actionButton.addEventListener("click", Web.onActionCommit);
  },
};

UI.targets = {
  queryActions: function () {
    return document.querySelectorAll("[data-target='action']");
  },
  queryActionsMenu: function () {
    return document.querySelector("[data-target='actions-menu']");
  },
  queryCommitButton: function () {
    return document.querySelector("[data-target='commit']");
  },
  queryOutputStream: function () {
    return document.querySelector("[data-target='output-stream']");
  },
};

UI.markup = {
  actionRow: function (actions) {
    return `
      <div class="button-row">
        ${actions.map((action) => UI.markup.actionButton(action)).join("\n")}
      </div>
    `;
  },
  actionButton: function (action) {
    return `<a class="button" data-target="action" data-value="${action.value}">${action.display}</a>`;
  },
};
