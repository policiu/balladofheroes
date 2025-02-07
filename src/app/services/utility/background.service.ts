import { Injectable } from '@angular/core';
import { AltarEffect } from 'src/app/models/altar/altar-effect.model';
import { AltarInfo } from 'src/app/models/altar/altar-info.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { AltarEffectsEnum } from 'src/app/models/enums/altar-effects-enum.model';
import { AltarEnum } from 'src/app/models/enums/altar-enum.model';
import { EffectTriggerEnum } from 'src/app/models/enums/effect-trigger-enum.model';
import { FollowerActionEnum } from 'src/app/models/enums/follower-action-enum.model';
import { FollowerPrayerTypeEnum } from 'src/app/models/enums/follower-prayer-type-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { AltarService } from '../altar/altar.service';
import { BalladService } from '../ballad/ballad.service';
import { BattleService } from '../battle/battle.service';
import { GameLogService } from '../battle/game-log.service';
import { FollowersService } from '../followers/followers.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { AlchemyService } from '../professions/alchemy.service';
import { ProfessionService } from '../professions/profession.service';
import { UtilityService } from './utility.service';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { ColiseumTournamentEnum } from 'src/app/models/enums/coliseum-tournament-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private globalService: GlobalService, private battleService: BattleService, private utilityService: UtilityService,
    private professionService: ProfessionService, private followerService: FollowersService, private lookupService: LookupService,
    private gameLogService: GameLogService, private balladService: BalladService, private altarService: AltarService,
    private dictionaryService: DictionaryService) { }

  //global -- this occurs even when at a scene or in a town
  handleBackgroundTimers(deltaTime: number, isInTown: boolean) {
    this.handleItemCooldowns(deltaTime);
    this.checkForDailyOccurrences(deltaTime);
    this.professionService.handleProfessionTimer(ProfessionEnum.Alchemy, deltaTime);
    this.professionService.handleProfessionTimer(ProfessionEnum.Jewelcrafting, deltaTime);
    this.handleAltarEffectDurations(deltaTime);
    this.handleFollowerSearch(deltaTime);
    this.handleFollowerPrayer(deltaTime);
    var party = this.globalService.getActivePartyCharacters(true);
    var enemies: Enemy[] = [];
    var activeSubzone = this.balladService.getActiveSubZone();

    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined &&
      activeSubzone.type !== SubZoneEnum.CalydonAltarOfAsclepius && !(this.balladService.isSubzoneTown(activeSubzone.type) &&
        this.globalService.globalVar.activeBattle.activeTournament.type === ColiseumTournamentEnum.None))
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;

    party.forEach(partyMember => {
      //check for defeated      
      var isDefeated = this.battleService.isCharacterDefeated(partyMember);
      if (!isDefeated && !this.globalService.globalVar.isBattlePaused) {
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.AlwaysActive, partyMember, new Character(), party, []);
        this.battleService.handleHpRegen(partyMember, deltaTime);
        this.battleService.handleStatusEffectDurations(true, partyMember, deltaTime);
        this.battleService.checkForEquipmentEffect(EffectTriggerEnum.TriggersEvery, partyMember, this.battleService.getTarget(partyMember, enemies), party, enemies, deltaTime);
        this.checkGodStatuses(partyMember);

        if (!isInTown) {
          this.battleService.handleAutoAttackTimer(partyMember, deltaTime);
          this.handleAbilityCooldowns(partyMember, deltaTime);
        }
      }
    });
  }

  handleTown(deltaTime: number, loading: any) {
    var party = this.globalService.getActivePartyCharacters(true);
    this.gainHpInTown(party, deltaTime);
  }

  handleAbilityCooldowns(character: Character, deltaTime: number) {
    if (character.abilityList !== undefined && character.abilityList.length > 0)
      character.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
        this.battleService.handleAbilityCooldown(character, ability, deltaTime);
      });

    if (character.assignedGod1 !== undefined && character.assignedGod1 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod1);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }

    if (character.assignedGod2 !== undefined && character.assignedGod2 !== GodEnum.None) {
      var god = this.globalService.globalVar.gods.find(item => item.type === character.assignedGod2);
      if (god !== undefined) {
        if (god.abilityList !== undefined && god.abilityList.length > 0)
          god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            this.battleService.handleAbilityCooldown(character, ability, deltaTime);
          });
      }
    }
  }

  gainHpInTown(party: Character[], deltaTime: number) {
    var hpGainPercent = .1;

    this.globalService.globalVar.timers.townHpGainTimer += deltaTime;
    var teamNeedsHealing = party.some(item => item.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(item));

    while (this.globalService.globalVar.timers.townHpGainTimer > this.globalService.globalVar.timers.townHpGainLength && teamNeedsHealing) {
      party.forEach(partyMember => {
        if (partyMember.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(partyMember)) {
          partyMember.battleStats.currentHp += Math.ceil(this.lookupService.getAdjustedMaxHp(partyMember) * hpGainPercent);
        }

        if (partyMember.battleStats.currentHp >= this.lookupService.getAdjustedMaxHp(partyMember)) {
          partyMember.battleStats.currentHp = this.lookupService.getAdjustedMaxHp(partyMember);
        }
      });

      this.globalService.globalVar.timers.townHpGainTimer -= this.globalService.globalVar.timers.townHpGainLength;
      teamNeedsHealing = party.some(item => item.battleStats.currentHp < this.lookupService.getAdjustedMaxHp(item));

      if (!teamNeedsHealing)
        this.globalService.globalVar.timers.townHpGainTimer = 0;
    }
  }

  handleAltarEffectDurations(deltaTime: number) {
    if (this.globalService.globalVar.altars.activeAltarEffect1 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect1.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect1, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect1.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect1);
        this.globalService.globalVar.altars.activeAltarEffect1 = undefined;
      }
    }
    if (this.globalService.globalVar.altars.activeAltarEffect2 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect2.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect2, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect2.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect2);
        this.globalService.globalVar.altars.activeAltarEffect2 = undefined;
      }
    }
    if (this.globalService.globalVar.altars.activeAltarEffect3 !== undefined) {
      this.globalService.globalVar.altars.activeAltarEffect3.duration -= deltaTime;
      this.handleTickingAltarEffect(this.globalService.globalVar.altars.activeAltarEffect3, deltaTime);

      if (this.globalService.globalVar.altars.activeAltarEffect3.duration <= 0) {
        this.handleEndOfDurationAltarEffect(this.globalService.globalVar.altars.activeAltarEffect3);
        this.globalService.globalVar.altars.activeAltarEffect3 = undefined;
      }
    }

    if (this.globalService.globalVar.altars.additionalAltarEffects !== undefined && this.globalService.globalVar.altars.additionalAltarEffects.length > 0) {
      this.globalService.globalVar.altars.additionalAltarEffects.forEach(effect => {
        effect.duration -= deltaTime;
        this.handleTickingAltarEffect(effect, deltaTime);

        if (effect.duration <= 0) {
          this.handleEndOfDurationAltarEffect(effect);
        }
      });

      this.globalService.globalVar.altars.additionalAltarEffects = this.globalService.globalVar.altars.additionalAltarEffects.filter(item => item.duration > 0);
    }
  }

  handleTickingAltarEffect(effect: AltarEffect, deltaTime: number) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    var enemies: Enemy[] | undefined = undefined;
    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined) {
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;
      enemies = enemies.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    }
    effect.tickTimer += deltaTime;

    if (this.utilityService.roundTo(effect.tickTimer, 5) >= effect.tickFrequency) {
      if (effect.type === AltarEffectsEnum.AthenaHealOverTime || effect.type === AltarEffectsEnum.AthenaRareHealOverTime) {
        party.forEach(member => {
          this.battleService.gainHp(member, effect.effectiveness);
        });
      }

      if (effect.type === AltarEffectsEnum.HermesRareReduceAbilityCooldownOverTime) {
        party.forEach(member => {
          if (member.abilityList !== undefined && member.abilityList.length > 0)
            member.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
              ability.currentCooldown /= effect.effectiveness;
            });

          if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
            var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod1);
            if (god !== undefined) {
              if (god.abilityList !== undefined && god.abilityList.length > 0)
                god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                  ability.currentCooldown /= effect.effectiveness;
                });
            }
          }

          if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
            var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod2);
            if (god !== undefined) {
              if (god.abilityList !== undefined && god.abilityList.length > 0)
                god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                  ability.currentCooldown /= effect.effectiveness;
                });
            }
          }
        });
      }

      if (effect.type === AltarEffectsEnum.HadesRareDealElementalDamage) {
        if (enemies !== undefined) {
          enemies.forEach(member => {
            this.battleService.dealTrueDamage(true, member, effect.effectiveness, undefined, effect.element);
          });
        }
      }

      if (effect.type === AltarEffectsEnum.NemesisDealDamage) {
        if (enemies !== undefined) {
          var target = this.lookupService.getRandomPartyMember(enemies);
          this.battleService.dealTrueDamage(true, target, effect.effectiveness);
        }
      }

      effect.tickTimer -= effect.tickFrequency;
    }
  }

  handleEndOfDurationAltarEffect(effect: AltarEffect) {
    var party = this.globalService.getActivePartyCharacters(true);
    party = party.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    var enemies: Enemy[] | undefined = undefined;
    if (this.globalService.globalVar.activeBattle !== undefined && this.globalService.globalVar.activeBattle.currentEnemies !== undefined) {
      enemies = this.globalService.globalVar.activeBattle.currentEnemies.enemyList;
      enemies = enemies.filter(member => !member.battleInfo.statusEffects.some(effect => effect.type == StatusEffectEnum.Dead));
    }

    if (effect.type === AltarEffectsEnum.AthenaHeal) {
      party.forEach(member => {
        this.battleService.gainHp(member, effect.effectiveness);
      });
    }

    if (effect.type === AltarEffectsEnum.AresOverdriveGain || effect.type === AltarEffectsEnum.AresRareOverdriveGain) {
      party.forEach(member => {
        if (member.level >= this.utilityService.characterOverdriveLevel) {
          member.overdriveInfo.gaugeAmount += (member.overdriveInfo.gaugeTotal * (effect.effectiveness - 1)) * this.lookupService.getOverdriveGainMultiplier(member);
          if (member.overdriveInfo.gaugeAmount > member.overdriveInfo.gaugeTotal)
            member.overdriveInfo.gaugeAmount = member.overdriveInfo.gaugeTotal;
        }
      });
    }

    if (effect.type === AltarEffectsEnum.ArtemisDefenseDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ApolloHeal) {
      party = party.sort(function (a, b) {
        return a.battleStats.getHpPercent() > b.battleStats.getHpPercent() ? 1 :
          a.battleStats.getHpPercent() < b.battleStats.getHpPercent() ? -1 : 0;
      });
      var target = party[0];

      this.battleService.gainHp(target, effect.effectiveness);
    }

    if (effect.type === AltarEffectsEnum.HermesAbilityCooldown) {
      party.forEach(member => {
        if (member.abilityList !== undefined && member.abilityList.length > 0)
          member.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
            ability.currentCooldown /= effect.effectiveness;
          });

        if (member.assignedGod1 !== undefined && member.assignedGod1 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod1);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown /= effect.effectiveness;
              });
          }
        }

        if (member.assignedGod2 !== undefined && member.assignedGod2 !== GodEnum.None) {
          var god = this.globalService.globalVar.gods.find(item => item.type === member.assignedGod2);
          if (god !== undefined) {
            if (god.abilityList !== undefined && god.abilityList.length > 0)
              god.abilityList.filter(ability => ability.isAvailable).forEach(ability => {
                ability.currentCooldown /= effect.effectiveness;
              });
          }
        }
      });
    }

    if (effect.type === AltarEffectsEnum.AthenaRareBlind) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 6, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ArtemisRareAttackDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 12, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.ApolloRareOstinato) {
      party.forEach(member => {
        if (member.assignedGod1 === GodEnum.Apollo || member.assignedGod2 === GodEnum.Apollo) {
          //this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.InstantOstinato, -1, effect.effectiveness, true, true), member, enemies);
          //this.battleService.handleuserEffects(true, )
          var ostinato = this.lookupService.characterHasAbility("Ostinato", member);
          if (ostinato !== undefined) {
            this.battleService.useAbility(true, ostinato, member, enemies === undefined ? [] : enemies, party, true, effect.effectiveness - 1);
          }
        }
      });
    }

    if (effect.type === AltarEffectsEnum.AresDamageOverTime) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createDamageOverTimeEffect(12, 3, effect.effectiveness, "Ares Altar", dotTypeEnum.TrueDamage, undefined, true), member);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.AresRareDealHpDamage) {
      var totalHp = 0;
      party.forEach(member => {
        totalHp += member.battleStats.currentHp * (effect.effectiveness - 1);
      });

      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.dealTrueDamage(true, member, totalHp);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRandomDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          ;
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(this.battleService.getRandomPrimaryStatDownStatusEffect(true), 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.DionysusRandomBuff) {
      party.forEach(member => {
        this.battleService.applyStatusEffect(this.globalService.createStatusEffect(this.battleService.getRandomPrimaryStatUpStatusEffect(), 10, effect.effectiveness, false, true), member, enemies);
      });
    }

    if (effect.type === AltarEffectsEnum.DionysusSingleBarrier) {
      var barrierTarget = this.lookupService.getRandomPartyMember(party);
      var barrierAmount = Math.round((effect.effectiveness - 1) * this.lookupService.getAdjustedMaxHp(barrierTarget, true));
      barrierTarget.battleInfo.barrierValue += barrierAmount;
    }

    if (effect.type === AltarEffectsEnum.DionysusRareMultiBarrier) {
      party.forEach(member => {
        var barrierAmount = Math.round((effect.effectiveness - 1) * this.lookupService.getAdjustedMaxHp(member, true));
        member.battleInfo.barrierValue += barrierAmount;
      });
    }

    if (effect.type === AltarEffectsEnum.DionysusRareFullDebuffs) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 15, effect.effectiveness, false, false), member, enemies);
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 15, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.NemesisLuckDebuff) {
      if (enemies !== undefined) {
        enemies.forEach(member => {
          this.battleService.applyStatusEffect(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 10, effect.effectiveness, false, false), member, enemies);
        });
      }
    }

    if (effect.type === AltarEffectsEnum.NemesisRareDuesUp) {
      party.forEach(member => {
        var dues = member.battleInfo.statusEffects.find(item => item.type === StatusEffectEnum.DispenserOfDues);
        if (dues !== undefined)
        {          
          dues.effectiveness *= effect.effectiveness;
        }
      });
    }
  }

  handleFollowerSearch(deltaTime: number) {
    var hour = 1 * 60 * 60; //average per hour

    if (this.globalService.globalVar.timers.followerSearchZoneTimer < 0)
    {
      this.globalService.globalVar.timers.followerSearchZoneTimer = 0;
    }

    var checkTime = this.globalService.globalVar.timers.followerSearchZoneTimerLength;
    this.globalService.globalVar.timers.followerSearchZoneTimer += deltaTime;

    if (this.globalService.globalVar.timers.followerSearchZoneTimer >= this.globalService.globalVar.timers.followerSearchZoneTimerLength) {
      this.globalService.globalVar.timers.followerSearchZoneTimer -= this.globalService.globalVar.timers.followerSearchZoneTimerLength;
      this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo === FollowerActionEnum.SearchingZone).forEach(follower => {
        var rewards = this.followerService.getZoneSearchRewards(follower.assignedZone); //bring this out of the for loop? only if performance is poor
        var zone = this.balladService.findZone(follower.assignedZone);
        var zoneName = zone !== undefined ? zone.zoneName : "";

        rewards.forEach(reward => {
          var chance = reward.amount / (hour / checkTime); //average = amount per hour divided by how often we check
          var rng = this.utilityService.getRandomNumber(0, 1);
          var rewardAmount = 1;

          if (rng <= chance) {
            var foundReward = new ResourceValue(reward.item, rewardAmount);
            if (this.globalService.globalVar.gameLogSettings.get("followerSearch")) {
              this.gameLogService.updateGameLog(GameLogEntryEnum.FollowerSearch, "Your followers found <strong>" + foundReward.amount + " " + this.dictionaryService.getItemName(foundReward.item) + "</strong> while searching " + zoneName + ".");
            }
            this.lookupService.addLootToLog(foundReward.item, foundReward.amount);
            this.lookupService.gainResource(foundReward);
          }
        });
      });
    }
  }

  handleFollowerPrayer(deltaTime: number) {
    if (this.globalService.globalVar.timers.followerPrayerTimer === undefined || this.globalService.globalVar.timers.followerPrayerTimer < 0) {
      this.globalService.globalVar.timers.followerPrayerTimer = 0;
      this.globalService.globalVar.timers.followerPrayerTimerLength = 60;
    }

    this.globalService.globalVar.timers.followerPrayerTimer += deltaTime;    
    if (this.globalService.globalVar.timers.followerPrayerTimer >= this.globalService.globalVar.timers.followerPrayerTimerLength) {      
      this.globalService.globalVar.timers.followerPrayerTimer -= this.globalService.globalVar.timers.followerPrayerTimerLength;
      this.globalService.globalVar.followerData.followers.filter(item => item.assignedTo === FollowerActionEnum.Praying).forEach(follower => {
        if (follower.assignedPrayerType === FollowerPrayerTypeEnum.Activate) {
          var chance = 0;
          if (follower.assignedAltarType === AltarEnum.Small)
            chance = this.utilityService.smallAltarActivationChancePerFollower;
          else if (follower.assignedAltarType === AltarEnum.Large)
            chance = this.utilityService.largeAltarActivationChancePerFollower;

          var rng = this.utilityService.getRandomNumber(0, 1);

          if (rng <= chance) {
            //find available altar, activate it
            var altarOptions: AltarInfo[] = [];
            if (this.globalService.globalVar.altars.altar1 !== undefined && this.globalService.globalVar.altars.altar1.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar1.conditionCount >= this.globalService.globalVar.altars.altar1.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar1);
            if (this.globalService.globalVar.altars.altar2 !== undefined && this.globalService.globalVar.altars.altar2.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar2.conditionCount >= this.globalService.globalVar.altars.altar2.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar2);
            if (this.globalService.globalVar.altars.altar3 !== undefined && this.globalService.globalVar.altars.altar3.type === follower.assignedAltarType &&
              this.globalService.globalVar.altars.altar3.conditionCount >= this.globalService.globalVar.altars.altar3.conditionMax)
              altarOptions.push(this.globalService.globalVar.altars.altar3);

            if (altarOptions.length > 0) {
              var altarRng = this.utilityService.getRandomInteger(0, altarOptions.length - 1);
              this.altarService.pray(altarOptions[altarRng], true, true);
            }
          }
        }
        else if (follower.assignedPrayerType === FollowerPrayerTypeEnum.Pray) {
          if (follower.assignedAltarType === AltarEnum.Small) {
            var chance = this.utilityService.smallAltarPrayChancePerFollower;
            var rng = this.utilityService.getRandomNumber(0, 1);

            if (rng <= chance) {
              var altar = this.altarService.getNewAltar(AltarEnum.Small, undefined, false);
              this.altarService.pray(altar, true);
            }
          }
          if (follower.assignedAltarType === AltarEnum.Large) {
            var chance = this.utilityService.largeAltarPrayChancePerFollower;
            var rng = this.utilityService.getRandomNumber(0, 1);

            if (rng <= chance) {
              var altar = this.altarService.getNewAltar(AltarEnum.Large, undefined, false);
              this.altarService.pray(altar, true);
            }
          }
        }
      });
    }
  }

  handleItemCooldowns(deltaTime: number) {
    if (this.globalService.globalVar.timers.itemCooldowns !== undefined && this.globalService.globalVar.timers.itemCooldowns.length > 0) {
      this.globalService.globalVar.timers.itemCooldowns.forEach(item => {
        item[1] -= deltaTime;
      });
    }

    this.globalService.globalVar.timers.itemCooldowns = this.globalService.globalVar.timers.itemCooldowns.filter(item => item[1] > 0);
  }

  checkForDailyOccurrences(deltaTime: number) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var lastTicketDate = new Date(this.globalService.globalVar.sidequestData.lastWeeklyMeleeTicketReceived);
    if (lastTicketDate === undefined)
      lastTicketDate = new Date();

    var dayOfLastTicket = new Date(lastTicketDate.getFullYear(), lastTicketDate.getMonth(), lastTicketDate.getDate());
    dayOfLastTicket.setHours(0, 0, 0);
    var todaysDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    todaysDate.setHours(0, 0, 0);

    var diffDays = Math.floor(Math.abs((todaysDate.valueOf() - dayOfLastTicket.valueOf()) / oneDay));
    if (diffDays > 0) {
      var ticketMultiplier = 1;
      if (this.globalService.globalVar.isSubscriber)
        ticketMultiplier = 2;

      this.globalService.globalVar.sidequestData.weeklyMeleeEntries += diffDays * ticketMultiplier;
      if (this.globalService.globalVar.sidequestData.weeklyMeleeEntries > (this.utilityService.weeklyMeleeEntryCap * ticketMultiplier))
        this.globalService.globalVar.sidequestData.weeklyMeleeEntries = (this.utilityService.weeklyMeleeEntryCap * ticketMultiplier);
    }
    this.globalService.globalVar.sidequestData.lastWeeklyMeleeTicketReceived = new Date();
  }

  checkGodStatuses(character: Character) {
    if ((character.assignedGod1 === GodEnum.Nemesis || character.assignedGod2 === GodEnum.Nemesis) &&
      !character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      var dispenserOfDues = this.lookupService.characterHasAbility("Dispenser of Dues", character);
      if (dispenserOfDues !== undefined) {
        this.battleService.applyStatusEffect(dispenserOfDues.userEffect[0], character);
      }
    }
    else if ((character.assignedGod1 !== GodEnum.Nemesis && character.assignedGod2 !== GodEnum.Nemesis) &&
      character.battleInfo.statusEffects.some(item => item.type === StatusEffectEnum.DispenserOfDues)) {
      character.battleInfo.statusEffects = character.battleInfo.statusEffects.filter(item => item.type !== StatusEffectEnum.DispenserOfDues);
    }
  }
}
