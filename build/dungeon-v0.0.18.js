const Dungeon = {
  eventMessages: {
    // Events follow a format of "playerAction-gameAction-turnResult-updatedMode"
    attractLoad: function (gameState) {
      return [...Dungeon.gameModeMessages[gameState.mode](gameState)];
    },

    attackDraw: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitAttack(gameState),
        ...Dungeon.gameActionMessages.enemyAttack(gameState),
        ...Dungeon.turnResultMessages.attackDraw(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    attackFail: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitAttack(gameState),
        ...Dungeon.gameActionMessages.enemyDefend(gameState),
        ...Dungeon.turnResultMessages.attackFail(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    attackSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitAttack(gameState),
        ...Dungeon.gameActionMessages.enemyCast(gameState),
        ...Dungeon.turnResultMessages.attackSuccess(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    castDraw: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitCast(gameState),
        ...Dungeon.gameActionMessages.enemyCast(gameState),
        ...Dungeon.turnResultMessages.castDraw(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    castFail: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitCast(gameState),
        ...Dungeon.gameActionMessages.enemyAttack(gameState),
        ...Dungeon.turnResultMessages.castFail(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    castSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitCast(gameState),
        ...Dungeon.gameActionMessages.enemyDefend(gameState),
        ...Dungeon.turnResultMessages.castSuccess(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    defendDraw: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitDefend(gameState),
        ...Dungeon.gameActionMessages.enemyDefend(gameState),
        ...Dungeon.turnResultMessages.defendDraw(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    defendFail: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitDefend(gameState),
        ...Dungeon.gameActionMessages.enemyCast(gameState),
        ...Dungeon.turnResultMessages.defendFail(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    defendSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitDefend(gameState),
        ...Dungeon.gameActionMessages.enemyAttack(gameState),
        ...Dungeon.turnResultMessages.defendSuccess(gameState),
        ...Dungeon.turnResultMessages.battleStatus(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    moveSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitMove(gameState),
        ...Dungeon.gameActionMessages.enemyReveal(gameState),
        ...Dungeon.turnResultMessages.moveSuccess(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    startSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitStart(gameState),
        ...Dungeon.gameActionMessages.enemyReveal(gameState),
        ...Dungeon.turnResultMessages.startSuccess(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    startSelect: function (gameState) {
      return [...Dungeon.playerActionMessages.selectStart(gameState)];
    },

    attackSelect: function (gameState) {
      return [...Dungeon.playerActionMessages.selectAttack(gameState)];
    },

    castSelect: function (gameState) {
      return [...Dungeon.playerActionMessages.selectCast(gameState)];
    },

    defendSelect: function (gameState) {
      return [...Dungeon.playerActionMessages.selectDefend(gameState)];
    },

    moveSelect: function (gameState) {
      return [...Dungeon.playerActionMessages.selectMove(gameState)];
    },
  },

  gameActionMessages: {
    enemyAttack: function (gameState) {
      return [{ source: "game", message: [`The enemy attacks.`] }];
    },

    enemyDefend: function (gameState) {
      return [{ source: "game", message: [`The enemy defends.`] }];
    },

    enemyCast: function (gameState) {
      return [{ source: "game", message: [`The enemy casts.`] }];
    },

    enemyReveal: function (gameState) {
      return [{ source: "game", message: [`The enemy reveals.`] }];
    },
  },

  playerActionMessages: {
    commitAttack: function (gameState) {
      return [{ source: "game", message: [`You attack.`] }];
    },

    commitCast: function (gameState) {
      return [{ source: "game", message: [`You cast.`] }];
    },

    commitDefend: function (gameState) {
      return [{ source: "game", message: [`You defend`] }];
    },

    commitStart: function (gameState) {
      return [{ source: "game", message: [`You start.`] }];
    },

    commitMove: function (gameState) {
      return [{ source: "game", message: [`You move.`] }];
    },

    selectAttack: function (gameState) {
      return [{ source: "game", message: [`You select attack.`] }];
    },

    selectCast: function (gameState) {
      return [{ source: "game", message: [`You select cast.`] }];
    },

    selectDefend: function (gameState) {
      return [{ source: "game", message: [`You select defend.`] }];
    },

    selectMove: function (gameState) {
      return [{ source: "game", message: [`You select move.`] }];
    },

    selectStart: function (gameState) {
      return [{ source: "game", message: [`You select start.`] }];
    },
  },

  gameModeMessages: {
    battle: function (gameState) {
      return [{ source: "game", message: "Select your next action." }];
    },

    attract: function (gameState) {
      return [
        {
          source: "game",
          message: `Quick Dungeon is an early WIP. Thanks for sneaking a peek.`,
        },
        {
          source: "game",
          message: `I have actively introduced regressions in the current version.`,
        },
        {
          source: "game",
          message:
            "Select 'Start' and commit your choice with the primary action button",
        },
      ];
    },

    defeat: function (gameState) {
      return [{ source: "game", message: "You were defeated." }];
    },

    ending: function (gameState) {
      return [
        {
          source: "game",
          message:
            "You won the dungeon because we're still coding it and this is as far as we've made it.",
        },
      ];
    },

    victory: function (gameState) {
      return [{ source: "game", message: `You are victorious.` }];
    },
  },

  turnResultMessages: {
    battleStatus: function (gameState) {
      return [
        {
          source: "status",
          message: [
            `Player HP ${gameState.player.health}/${gameState.player.maxHealth} | Enemy HP ${gameState.enemy.health}/${gameState.enemy.maxHealth}`,
          ],
        },
      ];
    },

    attackDraw: function (gameState) {
      return [{ source: "game", message: [`You draw.`] }];
    },

    attackFail: function (gameState) {
      return [{ source: "game", message: [`You fail.`] }];
    },

    attackSuccess: function (gameState) {
      return [{ source: "game", message: [`You win.`] }];
    },

    castDraw: function (gameState) {
      return [{ source: "game", message: [`You draw.`] }];
    },

    castFail: function (gameState) {
      return [{ source: "game", message: [`You fail.`] }];
    },

    castSuccess: function (gameState) {
      return [{ source: "game", message: [`You win.`] }];
    },

    defendDraw: function (gameState) {
      return [{ source: "game", message: [`You draw.`] }];
    },

    defendFail: function (gameState) {
      return [{ source: "game", message: [`You fail.`] }];
    },

    defendSuccess: function (gameState) {
      return [{ source: "game", message: [`You win.`] }];
    },

    moveSuccess: function (gameState) {
      return [{ source: "game", message: [`You moved.`] }];
    },

    startSuccess: function (gameState) {
      return [{ source: "game", message: [`The battle has started.`] }];
    },
  },

  tells: {
    attack: function (gameState) {
      return Util.selectRandom(["They are going to attack"]);
    },
    cast: function (gameState) {
      return Util.selectRandom(["They are going to cast"]);
    },
    defend: function (gameState) {
      return Util.selectRandom(["They are going to defend"]);
    },
  },
};
