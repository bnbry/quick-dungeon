const Dungeon = {
  // `reset` mode applies to when a player first wakes or when the reawaken after death
  reset: {
    messages: {
      foreword: function (gameState) {
        return [`Quick Dungeon is an early WIP. Thanks for sneaking a peek.`];
      },
      wake: function (gameState) {
        return [
          `You wake in a torchlit cave. Sword, shield and magic catalyst.`,
        ];
      },
      instructions: function (gameState) {
        return [
          "Select an action option and execute it with the primary button.",
        ];
      },
    },
  },
  battle: {
    messages: {
      enemyReveal: function (gameState) {
        return [
          `${gameState.enemy.name} the ${gameState.enemy.kind} stands menacingly before you.`,
          `They wield ${gameState.enemy.weapon}, shield, and pyromancer's flame.`,
        ];
      },
      attackSelect: function (gameState) {
        return [
          `You ready your sword to cut down your foe before they can cast a spell.`,
        ];
      },
      castSelect: function (gameState) {
        return [
          `You mentally recite the incantation, preparing to pierce the foes defenses.`,
        ];
      },
      defendSelect: function (gameState) {
        return [
          `You flex your shield arm and prepare to block the foes melee attack.`,
        ];
      },
      actions: {
        attack: {
          perform: function (gameState) {
            return ["You swing your sword ferociously."];
          },
          attack: function (gameState) {
            return [
              `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`,
              `Sword and ${gameState.enemy.weapon} clang against each other.`,
            ];
          },
          defend: function (gameState) {
            return [
              `${gameState.enemy.name} raises their shield.`,
              `Your sword bounces off the enemies shield, leaving you open to a quick swipe of the ${gameState.enemy.weapon}`,
            ];
          },
          cast: function (gameState) {
            return [
              `${gameState.enemy.name} attempts to cast a spell`,
              "Your attack disrupts the enemy, a clean hit",
            ];
          },
        },
        defend: {
          perform: function (gameState) {
            return ["You raise your shield and brace for impact."];
          },
          attack: function (gameState) {
            return [
              `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`,
              `You deflect the ${gameState.enemy.weapon} with your shield and strike back at the stunned foe.`,
            ];
          },
          defend: function (gameState) {
            return [
              `${gameState.enemy.name} raises their shield.`,
              "You stare each other down, neither of you gaining ground behind your shields.",
            ];
          },
          cast: function (gameState) {
            return [
              `${gameState.enemy.name} casts dark flame.`,
              "Your shield offers no defense to the forbidden arts.",
            ];
          },
        },
        cast: {
          perform: function (gameState) {
            return ["You ready your catalyst to cast firebolt."];
          },
          attack: function (gameState) {
            return [
              `${gameState.enemy.name} swings their ${gameState.enemy.weapon}.`,
              "It strikes you before your incantation is completed.",
            ];
          },
          defend: function (gameState) {
            return [
              `${gameState.enemy.name} raises their shield.`,
              "Shields offer no protection against your wizardry",
            ];
          },
          cast: function (gameState) {
            return [
              `${gameState.enemy.name} casts a magic barrier.`,
              "Your spell is unable to penetrate the barrier.",
            ];
          },
        },
      },
    },
  },
};
