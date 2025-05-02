// The Web layer handles all of the details of the web user interface and interacts with the Adapter
const UI = {
  API: {},
  private: {},
};

const Web = {
  init: function () {
    const currentState = Adapter.init();

    Web.update(currentState);
  },

  update: function (currentState) {
    Web.updateCommitButton(currentState.selectedAction);
    Web.streamMessages(currentState.messages);
    Web.renderActions(currentState.actions);
    Web.initListeners();
  },

  onActionSelect: function (event) {
    const target = event.currentTarget;

    if (target.hasAttribute("disabled")) {
      return;
    }

    const actionValue = target.dataset.value;
    const newState = Adapter.selectAction(actionValue);

    Web.update(newState);
  },

  onActionCommit: function (event) {
    const target = event.currentTarget;

    if (target.hasAttribute("disabled")) {
      return;
    }

    const newState = Adapter.commitAction(target.dataset.value);

    Web.update(newState);
  },

  updateCommitButton: function (selectedAction) {
    const commitButton = Web.queryCommitButton();
    commitButton.dataset.value = selectedAction.value;
    commitButton.textContent = selectedAction.commit;

    if (selectedAction.value == "none") {
      commitButton.setAttribute("disabled", "");
    } else {
      commitButton.removeAttribute("disabled");
    }
  },

  queryCommitButton: function () {
    return document.querySelector("[data-target='commit']");
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
        Web.printCharacter(character, messageElement);
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
      messageElement = Web.createMessageElement();
    }

    Web.streamMessage(messages[0], messageElement, function () {
      if (messages.length > 1) {
        Web.printCharacter("\n\n", messageElement);
        Web.streamMessages(messages.slice(1), messageElement);
      }
    });
  },

  renderActions: function (actions) {
    const actionsMenu = UI.targets.queryActionsMenu();
    actionsMenu.innerHTML = UI.markup.actionRow(actions);
  },

  initListeners: function () {
    const battleActions = UI.targets.queryActions();

    battleActions.forEach(function (battleAction) {
      battleAction.removeEventListener("click", Web.onActionSelect);
      battleAction.addEventListener("click", Web.onActionSelect);
    });

    const actionButton = Web.queryCommitButton();
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
    let disabled = "";

    if (action.value == "none") {
      disabled = "disabled";
    }

    return `<a class="button" data-target="action" data-value="${action.value}" data-commit="${action.commit}" ${disabled}>${action.display}</a>`;
  },
};
