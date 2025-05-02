// The Adapter layer translates between the Core layer and UI layer
// It heavily relies on the Dungeon module to drive translations of the Core
// information into presentable data for the UI
let AdapterState = {};

const Adapter = {
  init: function () {
    const gameState = Core.API.init();
    AdapterState = {
      ...AdapterState,
      ...gameState,
      messages: Adapter.introMessages(gameState),
    };

    return AdapterState;
  },

  commitAction: function (actionValue) {
    let messages = [];

    // TODO: lift into Core
    if (AdapterState.player.health <= 0) {
      messages = ["You're already dead"];
      AdapterState = {
        ...AdapterState,
        messages,
      };
      return AdapterState;
    } else if (AdapterState.enemy.health <= 0) {
      messages = ["They're already dead"];
      AdapterState = {
        ...AdapterState,
        messages,
      };
      return AdapterState;
    }

    const gameState = Core.API.handleAction(actionValue);
    messages = Adapter.actionCommitMessages(gameState);

    AdapterState = {
      ...AdapterState,
      ...gameState,
      messages,
    };

    return AdapterState;
  },

  introMessages: function (gameState) {
    const messages = [
      ...Dungeon.reset.messages.foreword(gameState),
      ...Dungeon.reset.messages.wake(gameState),
      ...Dungeon.battle.messages.enemyReveal(gameState),
      ...Dungeon.reset.messages.instructions(gameState),
    ];

    return messages;
  },

  optionSelectMessages: function (actionValue) {
    // TODO: pass in gameState
    const gameState = Core.state;

    const messages = [
      ...Dungeon.battle.messages[`${actionValue}Select`](gameState),
    ];

    return messages;
  },

  actionCommitMessages: function (gameState) {
    const playerAction = gameState.playerAction;
    const enemyAction = gameState.enemyAction;

    const messages = [
      ...Dungeon.battle.messages.actions[`${playerAction}`].perform(gameState),
      ...Dungeon.battle.messages.actions[`${playerAction}`][`${enemyAction}`](
        gameState
      ),
    ];

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

    return messages;
  },
};
