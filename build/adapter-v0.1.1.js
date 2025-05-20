// The Adapter layer translates between the Core layer and UI layer
// It heavily relies on the Dungeon module to drive translations of the Core
// information into presentable data for the UI

const actionsMap = {
  // Attract Mode actions
  start: { value: "start", display: "Start", commit: "Start" },
  tutorial: { value: "none", display: "Tutorial", commit: "Not yet" },
  about: { value: "none", display: "About", commit: "Not yet" },

  // Battle Mode Actions
  attack: { value: "attack", display: "Attack", commit: "Attack" },
  cast: { value: "cast", display: "Cast", commit: "Cast" },
  defend: { value: "defend", display: "Defend", commit: "Defend" },

  // Victory Mode Actions
  move: {
    value: "move",
    display: "Move",
    commit: "Move",
  },
  inspect: { value: "none", display: "Inspect", commit: "Not yet" },
  talk: { value: "none", display: "Talk", commit: "Not yet" },

  retry: {
    value: "retry",
    display: "Revive",
    commit: "Revive and try again...",
  },

  // Utility actions
  none: { value: "none", display: "None", commit: "Select Action..." },
};

let GameState = {
  mode: "attract",
  messages: [],
  selectedAction: {},
  actions: [],
  enemies: {},
  eventEffect: "no-effect",
};

const Adapter = {
  presentCoreState: function (coreState) {
    GameState = {
      ...GameState,
      ...coreState,
      selectedAction: actionsMap[coreState.selectedAction],
      actions: coreState.actions.map((action) => actionsMap[action]),
      enemy: Adapter.resolveEnemy(coreState.enemy),
      messages: [],
    };

    return GameState;
  },

  init: function () {
    const coreState = Core.init();
    const gameState = Adapter.presentCoreState(coreState);
    const messages = Adapter.eventMessages(gameState);

    return {
      ...gameState,
      messages,
    };
  },

  resolveEnemy: function (currentEnemy) {
    if (currentEnemy.id === undefined) {
      return {};
    }

    const storedEnemy = GameState.enemies[currentEnemy.id];
    let resolvedEnemy = {};

    if (storedEnemy) {
      resolvedEnemy = {
        ...storedEnemy,
        ...currentEnemy,
      };
    } else {
      resolvedEnemy = {
        ...currentEnemy,
        kind: "goblin",
        melee: "dagger",
      };
    }

    GameState.enemies[currentEnemy.id] = resolvedEnemy;

    return resolvedEnemy;
  },

  commitAction: function (actionValue) {
    const coreState = Core.handleAction(actionValue);
    const gameState = Adapter.presentCoreState(coreState);
    const messages = Adapter.eventMessages(gameState);
    const eventEffect = Adapter.eventEffects(gameState);

    return {
      ...gameState,
      messages,
      eventEffect,
    };
  },

  selectAction: function (actionValue) {
    const coreState = Core.selectAction(actionValue);
    const gameState = Adapter.presentCoreState(coreState);
    const messages = Adapter.eventMessages(gameState);
    const eventEffect = Adapter.eventEffects(gameState);

    return {
      ...gameState,
      messages,
      eventEffect,
    };
  },

  eventMessages: function (gameState) {
    return Dungeon.eventMessages[gameState.currentEvent](gameState);
  },

  eventEffects: function (gameState) {
    switch (gameState.currentEvent) {
      case "attackFail":
      case "castFail":
      case "defendFail":
        return "pulse-red-effect";
      case "attackSuccess":
      case "castSuccess":
      case "defendSuccess":
        return "pulse-green-effect";
      default:
        return "no-effect";
    }
  },
};
