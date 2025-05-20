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
        ...Dungeon.turnResultMessages.moveSuccess(gameState),
        ...Dungeon.gameActionMessages.enemyReveal(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    startSuccess: function (gameState) {
      return [
        ...Dungeon.playerActionMessages.commitStart(gameState),
        ...Dungeon.turnResultMessages.moveSuccess(gameState),
        ...Dungeon.gameActionMessages.enemyReveal(gameState),
        ...Dungeon.gameModeMessages[gameState.mode](gameState),
      ];
    },

    gameEnding: function (gameState) {
      return [...Dungeon.gameModeMessages[gameState.mode](gameState)];
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
      return [
        {
          source: "game",
          message: [
            `The enemy's blade arcs through the air in a sweeping slash.`,
            `Their blade cuts through the space between you with deadly intent.`,
            `The enemy swings their weapon in a wide, powerful stroke.`,
            `Their sword slices through the air in a diagonal attack.`,
            `The enemy's blade whips toward you in a rapid strike.`,
            `Their weapon carves a path through the air toward you.`,
            `The enemy executes a swift horizontal cut with their sword.`,
            `Their blade dances through the air in a figure-eight pattern.`,
            `The enemy's sword slices toward your vulnerable points.`,
            `Their weapon sweeps through the air in a spinning attack.`,
          ],
        },
      ];
    },

    enemyDefend: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `The enemy raises their shield, readying themselves for your attack.`,
            `The enemy's shield arm tenses as they prepare to block your strike.`,
            `The enemy's shield comes up to guard their vulnerable points.`,
            `The enemy plants their feet firmly, shield raised to meet your assault.`,
            `The enemy's defensive posture tightens as they ready their shield.`,
            `The enemy brings their shield to bear, anticipating your strike.`,
            `The enemy's shield arm draws up, ready to intercept your attack.`,
            `The enemy's shield gleams as they brace for your incoming blow.`,
            `The enemy's defensive stance solidifies behind their raised shield.`,
            `The enemy's shield is positioned to deflect your attack.`,
          ],
        },
      ];
    },

    enemyCast: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `The enemy's hands glow with arcane energy as they begin an incantation.`,
            `Dark magic crackles around the enemy's fingers as they prepare their spell.`,
            `The enemy's eyes flash with magical power as they channel their energy.`,
            `Arcane symbols materialize in the air as the enemy weaves their spell.`,
            `The enemy's voice rises in a mystical chant, gathering magical energy.`,
            `A magical aura surrounds the enemy as they focus their spellcasting.`,
            `The enemy's catalyst hums with power as they begin their incantation.`,
            `Mystical energy swirls around the enemy as they prepare to cast.`,
            `The enemy's fingers trace ancient patterns in the air, building their spell.`,
            `A dark magical presence fills the room as the enemy channels their power.`,
          ],
        },
      ];
    },

    enemyReveal: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `A goblin leaps from the shadows, its jagged blade glinting in the torchlight.`,
            `The sound of chittering laughter reveals a goblin warrior crouched in the corner.`,
            `A goblin's eyes gleam with malice as it steps from behind a crumbling pillar.`,
            `The torchlight catches the glint of a goblin's armor as it emerges from the darkness.`,
            `A goblin warrior snarls as it brandishes its crude weapon, ready for battle.`,
            `The scrape of metal on stone announces a goblin's presence in the chamber.`,
            `A goblin's hunched silhouette materializes from the shadows, weapon at the ready.`,
            `The stench of goblin sweat fills the air as one steps forward to challenge you.`,
            `A goblin's battle cry echoes through the chamber as it reveals itself.`,
            `The torchlight dances off a goblin's blade as it takes a fighting stance.`,
          ],
        },
      ];
    },
  },

  playerActionMessages: {
    commitAttack: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your sword arcs through the air in a sweeping slash.`,
            `You swing your blade in a wide, powerful stroke.`,
            `Your weapon cuts through the space between you and your foe.`,
            `You bring your sword down in a diagonal slash.`,
            `Your blade slices through the air with deadly intent.`,
            `You execute a swift horizontal cut with your sword.`,
            `Your weapon carves a path toward your enemy.`,
            `You slash your sword in a figure-eight pattern.`,
            `Your blade whips through the air in a rapid strike.`,
            `You perform a spinning slash with your sword.`,
          ],
        },
      ];
    },

    commitCast: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You begin to channel arcane energy through your catalyst.`,
            `Your hands glow with magical power as you prepare your spell.`,
            `You whisper the ancient incantation, feeling the magic build within you.`,
            `Arcane symbols materialize in the air as you focus your magical energy.`,
            `Your catalyst hums with power as you ready your spell.`,
            `The air crackles with magical energy as you begin your incantation.`,
            `Your fingers trace mystical patterns as you channel your spell.`,
            `A magical aura surrounds you as you prepare to unleash your power.`,
            `You feel the weight of ancient magic as you begin your spellcasting.`,
          ],
        },
      ];
    },

    commitDefend: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You raise your shield, bracing for the incoming attack.`,
            `Your shield arm tenses as you prepare to block their strike.`,
            `You position your shield defensively, ready to absorb their blow.`,
            `Your defensive stance solidifies as you raise your shield.`,
            `You steady your shield arm, preparing to deflect their attack.`,
            `Your shield comes up to guard your vulnerable points.`,
            `You plant your feet firmly, shield raised to meet their assault.`,
            `Your defensive posture tightens as you ready your shield.`,
            `You bring your shield to bear, anticipating their strike.`,
            `Your shield arm draws up, ready to intercept their attack.`,
          ],
        },
      ];
    },

    commitStart: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `The ancient stone door creaks open, revealing the darkness within.`,
            `Your torch illuminates the first steps of your dungeon descent.`,
            `The stale air of the dungeon greets you as you cross the threshold.`,
            `Your footsteps echo through the chamber as you begin your journey.`,
            `The torchlight dances on the walls as you venture into the unknown.`,
            `The weight of your equipment reminds you of the challenges ahead.`,
            `Your senses sharpen as you take your first steps into the dungeon.`,
            `The air grows colder as you leave the surface world behind.`,
            `Your shadow stretches long as you enter the dungeon's embrace.`,
            `The sound of dripping water echoes as you begin your descent.`,
          ],
        },
      ];
    },

    commitMove: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You step into a new chamber, your torch revealing ancient stone walls.`,
            `The doorway leads you into another room of the dungeon's depths.`,
            `Your footsteps echo as you enter a different section of the dungeon.`,
            `The torchlight reveals a new chamber as you cross the threshold.`,
            `You cautiously enter another room, scanning for potential threats.`,
            `The air changes as you move into a different part of the dungeon.`,
            `Your shadow stretches across the floor of the new chamber.`,
            `The sound of your movement fills the space as you enter the room.`,
            `You find yourself in another section of the dungeon's maze.`,
            `The chamber opens before you as you move deeper into the dungeon.`,
          ],
        },
      ];
    },

    selectAttack: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You raise your sword, readying yourself for a powerful strike.`,
            `Your blade gleams as you take an offensive stance.`,
            `You grip your sword tightly, preparing to launch your attack.`,
            `Your weapon hand tenses as you prepare to strike.`,
            `You shift your weight forward, sword poised to strike.`,
            `Your blade hums through the air as you ready your attack.`,
            `You take a deep breath, focusing your strength for the coming strike.`,
            `Your sword arm draws back, preparing to unleash your attack.`,
            `You steady your stance, blade raised for the offensive.`,
            `Your weapon glints as you prepare to engage the enemy.`,
          ],
        },
      ];
    },

    selectCast: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You begin to channel arcane energy through your catalyst.`,
            `Your hands glow with magical power as you prepare your spell.`,
            `You whisper the ancient incantation, feeling the magic build within you.`,
            `Arcane symbols materialize in the air as you focus your magical energy.`,
            `Your catalyst hums with power as you ready your spell.`,
            `You feel the magical energy coursing through your veins as you prepare to cast.`,
            `The air crackles with magical energy as you begin your incantation.`,
            `Your fingers trace mystical patterns as you channel your spell.`,
            `A magical aura surrounds you as you prepare to unleash your power.`,
            `You feel the weight of ancient magic as you begin your spellcasting.`,
          ],
        },
      ];
    },

    selectDefend: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You raise your shield, bracing for the incoming attack.`,
            `Your shield arm tenses as you prepare to block their strike.`,
            `You position your shield defensively, ready to absorb their blow.`,
            `Your defensive stance solidifies as you raise your shield.`,
            `You steady your shield arm, preparing to deflect their attack.`,
            `Your shield comes up to guard your vulnerable points.`,
            `You plant your feet firmly, shield raised to meet their assault.`,
            `Your defensive posture tightens as you ready your shield.`,
            `You bring your shield to bear, anticipating their strike.`,
            `Your shield arm draws up, ready to intercept their attack.`,
          ],
        },
      ];
    },

    selectMove: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You cautiously approach the doorway to the next chamber.`,
            `Your footsteps echo as you prepare to venture deeper into the dungeon.`,
            `You steel yourself as you move toward the next room.`,
            `The torchlight flickers as you step toward the unknown ahead.`,
            `You take a deep breath before advancing to the next chamber.`,
            `Your senses sharpen as you prepare to enter the next room.`,
            `You grip your weapon tightly as you move forward into the darkness.`,
            `The air grows colder as you approach the next chamber.`,
            `You pause briefly before crossing the threshold into the next room.`,
            `Your shadow stretches long as you move toward the next doorway.`,
          ],
        },
      ];
    },

    selectStart: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `The dungeon's entrance looms before you, its darkness promising both danger and treasure.`,
            `Ancient stone steps descend into the depths, waiting for your first step.`,
            `The air grows still as you prepare to cross the threshold into the unknown.`,
            `Torchlight flickers against the dungeon walls, casting long shadows that seem to beckon you forward.`,
            `The weight of your equipment reminds you of the challenges that lie ahead.`,
          ],
        },
      ];
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

    // An attackDraw occurs when an enemy also selects attack
    attackDraw: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your sword clashes against the enemy's weapon in a shower of sparks.`,
            `The enemy's blade meets yours with a resounding clang.`,
            `Your slash is parried as their weapon intercepts your strike.`,
            `Steel meets steel as your attack is deflected by their blade.`,
            `Your sword rebounds off their weapon with a metallic ring.`,
            `The enemy's weapon blocks your slash with perfect timing.`,
            `Your blade is turned aside by their defensive counter.`,
            `The clash of weapons echoes through the chamber as your attacks cancel out.`,
            `Your sword strike is met with equal force by their weapon.`,
            `The enemy's blade catches yours in a deadlock.`,
          ],
        },
      ];
    },

    // An attackFail occurs when an enemy selects defend
    attackFail: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your sword bounces off their shield, leaving you open to their counterattack.`,
            `The enemy's shield deflects your strike, and they exploit your momentary stagger.`,
            `Your blade skitters across their shield, and they catch you off balance with their weapon.`,
            `Their shield turns aside your attack, and they strike while you're recovering.`,
            `Your sword clangs against their shield, and they press the advantage as you reel.`,
            `The enemy's shield blocks your swing, and they counter while you're vulnerable.`,
            `Your attack is stopped cold by their shield, and they slash at your exposed side.`,
            `Their shield absorbs your strike, and they catch you with a quick riposte.`,
            `Your sword is deflected by their shield, and they strike while you're off guard.`,
            `The enemy's shield parries your attack, and they exploit your opening with their weapon.`,
          ],
        },
      ];
    },

    // An attackSuccess occurs when an enemy selects cast
    attackSuccess: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You disrupt the enemy's incantation, slashing them in the process.`,
            `Your blade slices through their spellcasting, breaking their concentration.`,
            `The enemy's magical words are cut short as your blade finds its mark.`,
            `Their spell fizzles out as your blade interrupts their arcane gesture.`,
            `Your sweeping strike catches them mid-incantation, disrupting their magic.`,
            `The enemy's spellcasting is interrupted by your well-timed slash.`,
            `Their magical barrier shatters as your blade cuts through their concentration.`,
            `Your attack slices through their spell, leaving them vulnerable.`,
            `The enemy's magical preparation is cut short by your decisive strike.`,
            `Their spell unravels as your blade disrupts their magical focus.`,
          ],
        },
      ];
    },

    castDraw: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your spells collide in mid-air, canceling each other out in a burst of magical energy.`,
            `The opposing magical forces meet and dissipate in a shower of sparks.`,
            `Your incantations clash, their magical energies neutralizing one another.`,
            `The competing spells unravel as they meet, their power dispersing into the air.`,
            `Your magical energies cancel each other out in a flash of light.`,
            `The opposing spells fizzle out as they collide, their power negated.`,
            `Your magical forces meet in equilibrium, neither able to overcome the other.`,
            `The spells dissipate as they strike each other, leaving only residual magic.`,
            `Your competing incantations nullify each other in a magical standoff.`,
            `The opposing magical energies neutralize in a burst of arcane power.`,
          ],
        },
      ];
    },

    castFail: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `The enemy's blade interrupts your incantation, breaking your concentration.`,
            `Your spell fizzles out as their sword cuts through your magical gesture.`,
            `Their attack disrupts your spellcasting, leaving you vulnerable.`,
            `The enemy's strike catches you mid-incantation, scattering your magical energy.`,
            `Your spell unravels as their blade interrupts your arcane words.`,
            `Their weapon breaks your magical focus, causing your spell to fail.`,
            `The enemy's attack shatters your concentration, disrupting your spell.`,
            `Your incantation is cut short as their blade finds its mark.`,
            `Their strike interrupts your spellcasting, leaving your magic unfinished.`,
            `The enemy's blade disrupts your magical preparation, causing your spell to fail.`,
          ],
        },
      ];
    },

    castSuccess: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your spell arcs over their shield, striking them directly.`,
            `The magical energy flows around their shield, finding its mark.`,
            `Your incantation bypasses their defense, the spell striking true.`,
            `Their shield is useless as your magic pierces through their guard.`,
            `The spell weaves around their shield, hitting them with full force.`,
            `Your magical attack finds a gap in their defense, striking home.`,
            `Their shield offers no protection against your arcane assault.`,
            `The spell surges past their shield, delivering its full power.`,
            `Your magic flows over their shield, striking them unhindered.`,
            `Their defensive stance is meaningless as your spell finds its target.`,
          ],
        },
      ];
    },

    defendDraw: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your shields meet in a resounding clash, neither giving ground.`,
            `The defensive stances cancel each other out in a stalemate of steel.`,
            `Your shields lock together, creating an impasse of defensive might.`,
            `The opposing shields create a wall of defense, neither side able to break through.`,
            `Your defensive postures mirror each other, resulting in a standoff.`,
            `The shields meet with equal force, creating a deadlock of protection.`,
            `Your defensive stances create a barrier that neither can overcome.`,
            `The shields clash in a test of defensive strength, ending in a draw.`,
            `Your defensive positions create an impenetrable wall between you.`,
            `The shields meet in perfect opposition, neither side gaining advantage.`,
          ],
        },
      ];
    },

    defendFail: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Their spell flows around your shield, striking you directly.`,
            `Your shield is useless as their magic pierces through your defense.`,
            `The enemy's incantation bypasses your guard, the spell finding its mark.`,
            `Their magical energy weaves around your shield, hitting you with full force.`,
            `Your defensive stance offers no protection against their arcane assault.`,
            `The enemy's spell surges past your shield, delivering its full power.`,
            `Their magic finds a gap in your defense, striking you unhindered.`,
            `Your shield is meaningless as their spell arcs over your guard.`,
            `The enemy's magical attack flows over your shield, striking true.`,
            `Their spell penetrates your defensive position, leaving you vulnerable.`,
          ],
        },
      ];
    },

    defendSuccess: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `Your shield blocks their attack, and you strike while they're off balance.`,
            `Their blade bounces off your shield, leaving them open to your counter.`,
            `You deflect their strike with your shield, then exploit their momentary stagger.`,
            `Your shield turns aside their attack, and you press the advantage.`,
            `Their weapon skitters off your shield, and you catch them in their recovery.`,
            `You block their attack with your shield, then strike at their exposed side.`,
            `Their blade is stopped by your shield, and you counter while they're vulnerable.`,
            `Your shield absorbs their strike, and you catch them with a quick riposte.`,
            `Their attack is deflected by your shield, and you strike while they're off guard.`,
            `Your shield parries their blow, and you exploit their opening with your weapon.`,
          ],
        },
      ];
    },

    moveSuccess: function (gameState) {
      return [
        {
          source: "game",
          message: [
            `You enter a chamber with ancient stone walls covered in mysterious runes.`,
            `The room opens into a wide space, its ceiling lost in shadows above.`,
            `Your torch reveals a chamber with crumbling pillars and scattered debris.`,
            `The air grows colder as you step into this new section of the dungeon.`,
            `You find yourself in a room with walls that seem to absorb the torchlight.`,
            `The chamber's floor is covered in dust that hasn't been disturbed in ages.`,
            `Your footsteps echo in a room with walls that glisten with moisture.`,
            `The torchlight reveals a chamber with strange markings on the floor.`,
            `You enter a room where the stonework shows signs of ancient craftsmanship.`,
            `The chamber's atmosphere feels heavy with the weight of forgotten history.`,
          ],
        },
      ];
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
