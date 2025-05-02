// The Adapter layer translates between the Core layer and UI layer
// It heavily relies on the Dungeon module to drive translations of the Core
// information into presentable data for the UI

const actionsMap = {
  // Attract Mode actions
  start: { value: "start", display: "Start", commit: "Enter the dungeon" },
  tutorial: { value: "none", display: "Tutorial", commit: "Not yet" },
  about: { value: "none", display: "About", commit: "We don't have this" },
  // Battle Mode Actions
  attack: { value: "attack", display: "Attack", commit: "Swing sword" },
  cast: { value: "cast", display: "Cast", commit: "Cast firebolt" },
  defend: { value: "defend", display: "Defend", commit: "Raise shield" },
  // Victory Mode Actions
  inspect: { value: "inspect", display: "Inspect" },
  heal: { value: "heal", display: "Heal" },
  move: { value: "move", display: "Move" },
  // Reset Mode Actions
  // TODO: make a reset mode
  // Utility actions
  none: { value: "none", display: "None", commit: "Select Action..." },
};

let GameState = {
  mode: "attract",
  messages: [],
  selectedAction: {},
  actions: [],
};

const Adapter = {
  presentCoreState: function (coreState) {
    console.log(coreState);

    GameState = {
      ...GameState,
      ...coreState,
      selectedAction: actionsMap[coreState.selectedAction],
      actions: coreState.actions.map((action) => actionsMap[action]),
      messages: [],
    };

    return GameState;
  },

  init: function () {
    const coreState = Core.init();
    const gameState = Adapter.presentCoreState(coreState);
    const messages = Adapter.modeTransitionMessages(gameState, "attract");

    return {
      ...gameState,
      messages,
    };
  },

  commitAction: function (actionValue) {
    const previousMode = GameState.mode;
    const coreState = Core.handleAction(actionValue);
    const gameState = Adapter.presentCoreState(coreState);
    const messages = [
      ...Adapter.actionCommitMessages(gameState),
      ...Adapter.modeTransitionMessages(gameState, previousMode),
    ];

    return {
      ...gameState,
      messages,
    };
  },

  selectAction: function (actionValue) {
    const coreState = Core.selectAction(actionValue);
    const gameState = Adapter.presentCoreState(coreState);
    const messages = Adapter.actionSelectMessages(gameState);

    return {
      ...gameState,
      messages,
    };
  },

  modeTransitionMessages: function (gameState, previousMode) {
    const messages =
      Dungeon.transition[`${previousMode}`][`${gameState.mode}`](gameState);

    return messages;
  },

  actionSelectMessages: function (gameState) {
    const messages = [
      ...Dungeon.select[`${gameState.selectedAction.value}`](gameState),
    ];

    return messages;
  },

  actionCommitMessages: function (gameState) {
    const playerAction = gameState.playerAction;
    const enemyAction = gameState.enemyAction;

    const messages = [
      ...Dungeon.commit[`${playerAction}`].perform(gameState),
      ...Dungeon.commit[`${playerAction}`][`${enemyAction}`](gameState),
    ];

    return messages;
  },
};
