const Dungeon = {
  transition: {
    // `reset` mode applies to when a player first wakes or when the reawaken after death
    attract: {
      attract: function (gameState) {
        return [
          {
            source: "game",
            message: `Quick Dungeon is an early WIP. Thanks for sneaking a peek.`,
          },
          {
            source: "game",
            message:
              "Select 'Start' and commit your choice with the primary action button",
          },
        ];
      },
      reset: function (gameState) {
        return [
          {
            source: "ally",
            message: "Wake up, wake up stranger",
          },
          {
            source: "game",
            message: `You wake in a torchlit cave. ${gameState.player.melee}, ${gameState.player.guard} and ${gameState.player.range}. A strange apparition hovering over you.`,
          },
          {
            source: "ally",
            message:
              "You're finally awake, splendid. Now how about we go ahead and fight our way out of this dungeon, if its not too much trouble.",
          },
        ];
      },
    },
    reset: {
      battle: function (gameState) {
        return [
          {
            source: "game",
            message: [
              `${gameState.enemy.name} the ${gameState.enemy.kind} stands menacingly before you.`,
              `A strange creature roars and readies itself for battle`,
            ],
          },
          {
            source: "ally",
            message: `They don't look friendly.`,
          },
          {
            source: "game",
            message: `They wield ${gameState.enemy.melee}, shield, and pyromancer's flame.`,
          },
          {
            source: "ally",
            message: `Is that pyromancy? I'm going to loot your corpse when you die.`,
          },
        ];
      },
    },
    battle: {
      battle: function (gameState) {
        return [{ source: "game", message: "Your battle continues." }];
      },
      victory: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} has been defeated.`,
          },
        ];
      },
      defeat: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} has defeated you.`,
          },
          { source: "game", message: "You died." },
          {
            source: "ally",
            message:
              "Sorry it didn't work out. Upside is I am taking your magic catalyst.",
          },
          {
            source: "game",
            message: "Death is not the end",
          },
        ];
      },
    },
    defeat: {
      reset: function (gameState) {
        return [{ source: "game", message: ["wake again"] }];
      },
    },
    victory: {
      battle: function (gameState) {
        return [
          {
            source: "game",
            message: [
              `${gameState.enemy.name} the ${gameState.enemy.kind} stands menacingly before you.`,
              `A strange creature roars and readies itself for battle`,
            ],
          },
          {
            source: "ally",
            message: `They don't look friendly.`,
          },
          {
            source: "game",
            message: `They wield ${gameState.enemy.melee}, shield, and pyromancer's flame.`,
          },
          {
            source: "ally",
            message: `Is that pyromancy? I'm going to loot your corpse when you die.`,
          },
        ];
      },
      ending: function (gameState) {
        return [
          {
            source: "game",
            message:
              "You won the dungeon because we're still coding it and this is as far as we've made it.",
          },
          {
            source: "ally",
            message:
              "Seemed kind of easy, I wouldn't pat yourself on the back too much.",
          },
        ];
      },
    },
  },
  select: {
    start: function (gameState) {
      return [{ source: "game", message: "Wake up and start your journey." }];
    },
    move: function (gameState) {
      return [
        { source: "game", message: "Enter the dungeon if you dare..." },
        {
          source: "ally",
          message: "I hope you are better at this than the last one.",
        },
      ];
    },
    talk: function (gameState) {
      return [
        {
          source: "ally",
          message: `How about you let your ${gameState.player.melee} do the talking in the next room`,
        },
      ];
    },
    attack: function (gameState) {
      return [
        {
          source: "game",
          message: `You ready your ${gameState.player.melee} to cut down your foe before they can cast a spell.`,
        },
      ];
    },
    cast: function (gameState) {
      return [
        {
          source: "game",
          message: `You mentally recite the incantation, preparing to pierce the foes defenses.`,
        },
      ];
    },
    defend: function (gameState) {
      return [
        {
          source: "game",
          message: `You flex your shield arm and prepare to block the foes melee attack.`,
        },
      ];
    },
    reset: function (gameState) {
      return [
        { source: "game", message: "Wake up and continue your journey." },
        { source: "ally", message: "Everyone dies their first time." },
      ];
    },
  },
  commit: {
    start: {
      perform: function (gameState) {
        return [];
      },
      none: function (gameState) {
        return [];
      },
    },

    reset: {
      perform: function (gameState) {
        return [];
      },
      none: function (gameState) {
        return [];
      },
    },

    move: {
      perform: function (gameState) {
        return [];
      },
      none: function (gameState) {
        return [];
      },
    },

    attack: {
      perform: function (gameState) {
        return [
          {
            source: "game",
            message: [
              `You swing your ${gameState.player.melee} ferociously.`,
              `You thrust your ${gameState.player.melee} towards the enemy.`,
              `You raise your ${gameState.player.melee} and slice down violently.`,
            ],
          },
        ];
      },
      attack: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} swings their ${gameState.enemy.melee}.`,
          },
          {
            source: "game",
            message: `${gameState.player.melee} and ${gameState.enemy.melee} clang against each other.`,
          },
          {
            source: "ally",
            message: `Clang! You two look ridiculous. Have you done battle before?`,
          },
        ];
      },
      defend: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} raises their shield.`,
          },
          {
            source: "game",
            message: [
              `Your ${gameState.player.melee} bounces off the enemies shield, leaving you open to a quick swipe of the ${gameState.enemy.melee}`,
              `The enemy deflects your ${gameState.player.melee} attack and slashes back with their ${gameState.enemy.melee}.`,
            ],
          },
          {
            source: "ally",
            message: [
              `Oof! You know you don't have any potions right?`,
              `You should cast when they defend themselves, they can't block magic with a shield.`,
            ],
          },
        ];
      },
      cast: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} attempts to cast a spell`,
          },
          {
            source: "game",
            message: "Your attack disrupts the incantation as you slash them.",
          },
          {
            source: "ally",
            message: `Ewww thats not the color blood should be.`,
          },
        ];
      },
    },
    defend: {
      perform: function (gameState) {
        return [
          {
            source: "game",
            message: "You raise your shield and brace for impact.",
          },
          {
            source: "ally",
            message: `Bit passive.`,
          },
        ];
      },
      attack: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} swings their ${gameState.enemy.melee}.`,
          },
          {
            source: "game",
            message: `You deflect the ${gameState.enemy.melee} with your shield and strike back at the stunned foe.`,
          },
          {
            source: "ally",
            message: `Well when I'm wrong, I'm wrong.`,
          },
        ];
      },
      defend: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} raises their shield.`,
          },
          {
            source: "game",
            message:
              "You stare each other down, neither of you gaining ground behind your shields.",
          },
          {
            source: "ally",
            message: `Wow.`,
          },
        ];
      },
      cast: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} casts dark flame.`,
          },
          {
            source: "game",
            message: "Your shield offers no defense to the forbidden arts.",
          },
          {
            source: "ally",
            message: `You really should have attacked.`,
          },
        ];
      },
    },
    cast: {
      perform: function (gameState) {
        return [
          {
            source: "game",
            message: "You ready your catalyst to cast firebolt.",
          },
          {
            source: "ally",
            message: `I can tell your brain is struggling, so I guess, firebolt?`,
          },
        ];
      },
      attack: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} swings their ${gameState.enemy.melee}.`,
          },
          {
            source: "game",
            message: "It strikes you before your incantation is completed.",
          },
          {
            source: "ally",
            message: `Ouch, you've got to be regretting some choices right about now.`,
          },
        ];
      },
      defend: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} raises their shield.`,
          },
          {
            source: "game",
            message: "Shields offer no protection against your wizardry",
          },
          {
            source: "ally",
            message: `FIREBOLT!!!`,
          },
        ];
      },
      cast: function (gameState) {
        return [
          {
            source: "game",
            message: `${gameState.enemy.name} casts a magic barrier.`,
          },
          {
            source: "game",
            message: "Your spell is unable to penetrate the barrier.",
          },
          {
            source: "ally",
            message: `That was at least better than when you both just stand their with your shields up.`,
          },
        ];
      },
    },
  },
};
