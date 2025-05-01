// The Adapter layer translates between the Core layer and UI layer
const Adapter = {
  API: {},
  private: {},
};

Adapter.API = {
  introMessages: function (gameState) {
    const messages = [];

    messages.push(
      "Very much an early WIP. Thanks for sneaking a peek.",
      "You wake in a torchlit cave. Sword, shield and magic catalyst.",
      `${gameState.enemy.name} the ${gameState.enemy.kind} stands menacingly before you.`,
      `They wield ${gameState.enemy.weapon}, shield, and pyromancer's flame.`,
      "Select an action option and execute it with the primary button."
    );

    return messages;
  },

  optionSelectMessages: function (actionValue) {
    const messages = [];

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

    return messages;
  },

  actionPerformMessages: function (gameState) {
    const messages = [];
    const playerAction = gameState.playerAction;
    const enemyAction = gameState.enemyAction;

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

    return messages;
  },
};
