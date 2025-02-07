import { Injectable } from '@angular/core';
import { Ability } from 'src/app/models/character/ability.model';
import { CharacterStats } from 'src/app/models/character/character-stats.model';
import { Character } from 'src/app/models/character/character.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BestiaryEnum } from 'src/app/models/enums/bestiary-enum.model';
import { CharacterEnum } from 'src/app/models/enums/character-enum.model';
import { dotTypeEnum } from 'src/app/models/enums/damage-over-time-type-enum.model';
import { ElementalTypeEnum } from 'src/app/models/enums/elemental-type-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { StatusEffectEnum } from 'src/app/models/enums/status-effects-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { TargetEnum } from 'src/app/models/enums/target-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { DeploymentService } from '../deployment/deployment.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class EnemyGeneratorService {

  constructor(private globalService: GlobalService, private utilityService: UtilityService, private deploymentService: DeploymentService) { }

  generateEnemy(type: BestiaryEnum) {
    var enemy = new Enemy();
    enemy.type = CharacterEnum.Enemy;
    enemy.bestiaryType = type;

    if (type === BestiaryEnum.WaterSerpent) {
      enemy.name = "Water Serpent";
      enemy.battleStats = new CharacterStats(10, 12, 2, 5, 1, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 22;//this.deploymentService.devModeActive ? 22000 : 22;
      enemy.coinGainFromDefeat = 0;
    }
    if (type === BestiaryEnum.Crustacean) {
      enemy.name = "Crustacean";
      enemy.battleStats = new CharacterStats(14, 10, 7, 3, 1, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 31;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .15));
    }
    if (type === BestiaryEnum.FrenziedGull) {
      enemy.name = "Frenzied Gull";
      enemy.battleStats = new CharacterStats(18, 13, 5, 6, 5, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 33;

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = .5;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 5;
      enemy.abilityList.push(peck);
    }
    if (type === BestiaryEnum.StarvingMongrel) {
      enemy.name = "Starving Mongrel";
      enemy.battleStats = new CharacterStats(17, 10, 9, 10, 5, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 1;
      enemy.xpGainFromDefeat = 35;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .15));
    }
    if (type === BestiaryEnum.WildBoar) {
      enemy.name = "Wild Boar";
      enemy.battleStats = new CharacterStats(25, 10, 12, 5, 5, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .1));
    }
    if (type === BestiaryEnum.KillerBees) {
      enemy.name = "Killer Bees";
      enemy.battleStats = new CharacterStats(12, 8, 7, 10, 12, 10);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 20;
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, 2, .01));
    }
    if (type === BestiaryEnum.Patriarch) {
      enemy.name = "Patriarch";
      enemy.battleStats = new CharacterStats(125, 17, 14, 5, 5, 40);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 100;

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 1;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 23;
      slash = this.randomizeCooldown(slash);
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .9, false, false));
      enemy.abilityList.push(slash);

      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .01));
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .04));
    }
    if (type === BestiaryEnum.Bandit) {
      enemy.name = "Bandit";
      enemy.battleStats = new CharacterStats(33, 15, 12, 7, 10, 10);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40;
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, 1, .1));
    }
    if (type === BestiaryEnum.Thief) {
      enemy.name = "Thief";
      enemy.battleStats = new CharacterStats(25, 12, 8, 10, 5, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 40;
      enemy.coinGainFromDefeat = 3;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.Highwayman) {
      enemy.name = "Highwayman";
      enemy.battleStats = new CharacterStats(55, 14, 17, 10, 10, 20);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 45;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, 1, .01));
    }
    if (type === BestiaryEnum.Coyote) {
      enemy.name = "Coyote";
      enemy.battleStats = new CharacterStats(27, 19, 15, 25, 25, 5);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 42;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.LightLeather, ItemTypeEnum.CraftingMaterial, 1, .2));      
    }
    if (type === BestiaryEnum.Archer) {
      enemy.name = "Archer";
      enemy.battleStats = new CharacterStats(200, 25, 16, 10, 12, 60);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 120;
      enemy.coinGainFromDefeat = 3;
      enemy.loot.push(new LootItem(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 2, .125));

      var sureShot = new Ability();
      sureShot.name = "Sure Shot";
      sureShot.isAvailable = true;
      sureShot.effectiveness = 1.3;
      sureShot.cooldown = sureShot.currentCooldown = 25;
      sureShot = this.randomizeCooldown(sureShot);
      sureShot.dealsDirectDamage = true;
      sureShot.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, sureShot.name));
      enemy.abilityList.push(sureShot);
    }
    if (type === BestiaryEnum.RedHarpy) {
      enemy.name = "Red-Feathered Harpy";
      enemy.battleStats = new CharacterStats(74, 24, 21, 25, 10, 10);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 18;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.elementalType = ElementalTypeEnum.Air;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

    }
    if (type === BestiaryEnum.BlueHarpy) {
      enemy.name = "Blue-Feathered Harpy";
      enemy.battleStats = new CharacterStats(83, 29, 23, 20, 10, 10);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 58;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather

      var enrage = new Ability();
      enrage.name = "Enrage";
      enrage.isAvailable = true;
      enrage.cooldown = enrage.currentCooldown = (this.utilityService.enemyLongAutoAttackSpeed - 1);
      enrage.dealsDirectDamage = false;
      enrage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 5, 1.25, false, true));
      enemy.abilityList.push(enrage);
    }
    if (type === BestiaryEnum.GreenHarpy) {
      enemy.name = "Green-Feathered Harpy";
      enemy.battleStats = new CharacterStats(64, 21, 18, 20, 20, 10);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .1));
      //chance to drop leather

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 1.7;
      ravage.cooldown = ravage.currentCooldown = 14;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);
    }
    if (type === BestiaryEnum.FledglingLamia) {
      enemy.name = "Fledgling Lamia";
      enemy.battleStats = new CharacterStats(45, 18, 14, 45, 18, 7);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 50;
      enemy.coinGainFromDefeat = 1;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .05));
    }
    if (type === BestiaryEnum.Lamia) {
      enemy.name = "Lamia";
      enemy.battleStats = new CharacterStats(83, 26, 26, 20, 25, 30);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.xpGainFromDefeat = 60;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 1, .12));

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 12;
      empower = this.randomizeCooldown(empower);
      empower.dealsDirectDamage = false;
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.1, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.1, false, true, true));
      enemy.abilityList.push(empower);
    }
    if (type === BestiaryEnum.Sybaris) {
      enemy.name = "Sybaris";
      enemy.battleStats = new CharacterStats(600, 36, 40, 15, 13, 75);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 150;

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.5;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 22;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(20, 4, .1, bite.name));
      enemy.abilityList.push(bite);

      var empower = new Ability();
      empower.name = "Empower";
      empower.isAvailable = true;
      empower.cooldown = empower.currentCooldown = 14;
      empower.dealsDirectDamage = false;
      empower = this.randomizeCooldown(empower);
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.15, false, true, true));
      empower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.15, false, true, true));
      enemy.abilityList.push(empower);

      enemy.loot.push(new LootItem(ItemsEnum.LamiaHeart, ItemTypeEnum.CraftingMaterial, 3, .09));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, 2, .05));
      //chance to drop Poison Fang (battle item)
    }
    if (type === BestiaryEnum.LargeOctopus) {
      enemy.name = "Large Octopus";
      enemy.battleStats = new CharacterStats(98, 28, 28, 28, 28, 28);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 55;
      enemy.coinGainFromDefeat = 2;
      //chance to drop Lamia Scales

      var constrict = new Ability();
      constrict.name = "Constrict";
      constrict.isAvailable = true;
      constrict.cooldown = constrict.currentCooldown = 16;
      constrict = this.randomizeCooldown(constrict);
      constrict.dealsDirectDamage = false;
      constrict.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .75, false, false));
      enemy.abilityList.push(constrict);
    }
    if (type === BestiaryEnum.UnsettlingShade) {
      enemy.name = "Unsettling Shade";
      enemy.battleStats = new CharacterStats(125, 55, 44, 60, 60, 25);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.xpGainFromDefeat = 70;
      enemy.coinGainFromDefeat = 0;
      enemy.loot.push(new LootItem(ItemsEnum.ForgottenLocket, ItemTypeEnum.Equipment, 1, .0075));

      var ethereal = new Ability();
      ethereal.name = "Ethereal";
      ethereal.isAvailable = true;
      ethereal.cooldown = ethereal.currentCooldown = 30;
      ethereal = this.randomizeCooldown(ethereal);
      ethereal.dealsDirectDamage = false;
      ethereal.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 0, false, true));
      enemy.abilityList.push(ethereal);
    }
    if (type === BestiaryEnum.Gorgon) {
      enemy.name = "Gorgon";
      enemy.battleStats = new CharacterStats(110, 42, 50, 50, 35, 35);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.xpGainFromDefeat = 72;
      enemy.coinGainFromDefeat = 2;
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .01));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 24;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Stheno) {
      enemy.name = "Stheno";
      enemy.battleStats = new CharacterStats(650, 68, 75, 35, 20, 100);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125;
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 2, .08));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 26;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));
      enemy.abilityList.push(gaze);

      var bite = new Ability();
      bite.name = "Snake Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.2;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .2, bite.name));
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.Euryale) {
      enemy.name = "Euryale";
      enemy.battleStats = new CharacterStats(500, 60, 80, 35, 40, 110);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 125;
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 1, .2));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 26;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));
      enemy.abilityList.push(gaze);

      var feint = new Ability();
      feint.name = "Feint";
      feint.isAvailable = true;
      feint.dealsDirectDamage = false;
      feint.cooldown = feint.currentCooldown = 15;
      feint = this.randomizeCooldown(feint);
      feint.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 7, .8, false, false));
      enemy.abilityList.push(feint);
    }
    if (type === BestiaryEnum.Medusa) {
      enemy.name = "Medusa";
      enemy.battleStats = new CharacterStats(1650, 102, 105, 82, 40, 165);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 175;
      enemy.loot.push(new LootItem(ItemsEnum.PetrifiedBark, ItemTypeEnum.CraftingMaterial, 5, .05));

      var gaze = new Ability();
      gaze.name = "Gaze";
      gaze.isAvailable = true;
      gaze.cooldown = gaze.currentCooldown = 25;
      gaze = this.randomizeCooldown(gaze);
      gaze.dealsDirectDamage = false;
      gaze.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 0, false, false));
      enemy.abilityList.push(gaze);
    }
    if (type === BestiaryEnum.Lion) {
      enemy.name = "Lion";
      enemy.battleStats = new CharacterStats(1000, 190, 150, 300, 300, 280);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;

      var swipe = new Ability();
      swipe.name = "Swipe";
      swipe.isAvailable = true;
      swipe.cooldown = swipe.currentCooldown = 13;
      swipe = this.randomizeCooldown(swipe);
      swipe.dealsDirectDamage = true;
      swipe.effectiveness = 1.4;
      enemy.abilityList.push(swipe);
    }
    if (type === BestiaryEnum.EnceladusOne) {
      enemy.name = "Enceladus";
      enemy.battleStats = new CharacterStats(250000, 615, 10000, 60, 2000, 10000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 10;
      enemy.xpGainFromDefeat = 1000;

      var smash = new Ability();
      smash.name = "Smash";
      smash.isAvailable = true;
      smash.cooldown = smash.currentCooldown = 15;      
      smash.dealsDirectDamage = true;
      smash.effectiveness = 2.3;
      smash.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 5, .8, smash.name));
      enemy.abilityList.push(smash);

      var wallop = new Ability();
      wallop.name = "Wallop";
      wallop.isAvailable = true;
      wallop.cooldown = wallop.currentCooldown = 15;      
      wallop.dealsDirectDamage = true;
      wallop.effectiveness = 1.5;
      wallop.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .4, false, false));
      enemy.abilityList.push(wallop);

      var nap = new Ability();
      nap.name = "Nap";
      nap.isAvailable = true;
      nap.cooldown = nap.currentCooldown = 40;
      nap = this.randomizeCooldown(nap);
      nap.dealsDirectDamage = false;
      nap.heals = true;
      nap.effectiveness = 50;
      nap.targetsAllies = true;
      nap.targetType = TargetEnum.Self;
      enemy.abilityList.push(nap);
    }
    if (type === BestiaryEnum.LostSoul) {
      //somewhat easy to rebound from resetting gods
      enemy.name = "Lost Soul";
      enemy.battleStats = new CharacterStats(247, 30, 53, 37, 30, 85);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 96;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .06));
    }
    if (type === BestiaryEnum.Wretched) {
      enemy.name = "Wretched";
      enemy.battleStats = new CharacterStats(228, 44, 62, 53, 40, 85);
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 98;
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .02));

      var deathsTouch = new Ability();
      deathsTouch.name = "Death's Touch";
      deathsTouch.isAvailable = true;
      deathsTouch.cooldown = deathsTouch.currentCooldown = 18;
      deathsTouch = this.randomizeCooldown(deathsTouch);
      deathsTouch.dealsDirectDamage = false;
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 7, .9, false, false));
      deathsTouch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 7, .9, false, false));
      enemy.abilityList.push(deathsTouch);
    }
    if (type === BestiaryEnum.Revenant) {
      enemy.name = "Revenant";
      enemy.battleStats = new CharacterStats(320, 52, 102, 75, 35, 85);
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 103;
      enemy.loot.push(new LootItem(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, 1, .025));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .08));

      var soulRip = new Ability();
      soulRip.name = "Soul Rip";
      soulRip.isAvailable = true;
      soulRip.cooldown = soulRip.currentCooldown = 16;
      soulRip = this.randomizeCooldown(soulRip);
      soulRip.dealsDirectDamage = true;
      soulRip.effectiveness = 1;
      soulRip.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .25, true, true));
      enemy.abilityList.push(soulRip);
    }
    if (type === BestiaryEnum.IncoherentBanshee) {
      enemy.name = "Incoherent Banshee";
      enemy.battleStats = new CharacterStats(467, 63, 82, 40, 45, 75);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 108;
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 1, .015));
      enemy.loot.push(new LootItem(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, 1, .03));

      var rambling = new Ability();
      rambling.name = "Rambling";
      rambling.isAvailable = true;
      rambling.cooldown = rambling.currentCooldown = 16;
      rambling = this.randomizeCooldown(rambling);
      rambling.dealsDirectDamage = false;
      rambling.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 9, .75, false, false, true));
      enemy.abilityList.push(rambling);
    }
    if (type === BestiaryEnum.EngorgedShade) {
      enemy.name = "Engorged Shade";
      enemy.battleStats = new CharacterStats(534, 80, 112, 75, 50, 75);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 110;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .1));
      enemy.loot.push(new LootItem(ItemsEnum.RoughEmeraldFragment, ItemTypeEnum.CraftingMaterial, 1, .02));
    }
    if (type === BestiaryEnum.CacklingSpectre) {
      enemy.name = "Cackling Spectre";
      enemy.battleStats = new CharacterStats(543, 42, 86, 55, 50, 75);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 108;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2, .125));
    }
    if (type === BestiaryEnum.FloatingFlame) {
      enemy.name = "Floating Flame";
      enemy.battleStats = new CharacterStats(424, 70, 84, 60, 50, 150);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMediumElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 107;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .05));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .125));

      var burn = new Ability();
      burn.name = "Burn";
      burn.isAvailable = true;
      burn.cooldown = burn.currentCooldown = 16;
      burn = this.randomizeCooldown(burn);
      burn.dealsDirectDamage = false;
      burn.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 5, .5, burn.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(burn);
    }
    if (type === BestiaryEnum.Butcher) {
      enemy.name = "Butcher";
      enemy.battleStats = new CharacterStats(628, 78, 106, 65, 40, 140);
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 118;
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .005));

      var slice = new Ability();
      slice.name = "Slice";
      slice.isAvailable = true;
      slice.cooldown = slice.currentCooldown = 15;
      slice = this.randomizeCooldown(slice);
      slice.dealsDirectDamage = true;
      slice.effectiveness = 1.75;
      slice.elementalType = ElementalTypeEnum.Fire;
      slice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.1, false, true));
      enemy.abilityList.push(slice);
    }
    if (type === BestiaryEnum.WheelOfFire) {
      enemy.name = "Wheel of Fire";
      enemy.battleStats = new CharacterStats(525, 76, 118, 65, 80, 150);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMediumElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 116;
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2, .125));
      enemy.loot.push(new LootItem(ItemsEnum.RoughRubyFragment, ItemTypeEnum.CraftingMaterial, 1, .02));

      var rollThrough = new Ability();
      rollThrough.name = "Roll";
      rollThrough.isAvailable = true;
      rollThrough.cooldown = rollThrough.currentCooldown = 18;
      rollThrough = this.randomizeCooldown(rollThrough);
      rollThrough.dealsDirectDamage = true;
      rollThrough.isAoe = true;
      rollThrough.effectiveness = 1.25;
      rollThrough.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(rollThrough);
    }
    if (type === BestiaryEnum.Empusa) {
      enemy.name = "Empusa";
      enemy.battleStats = new CharacterStats(725, 98, 95, 80, 45, 75);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 122;
      enemy.loot.push(new LootItem(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, 1, .03));
      enemy.battleStats.elementIncrease.fire = .25;

      var enfire = new Ability();
      enfire.name = "Enfire";
      enfire.isAvailable = true;
      enfire.cooldown = enfire.currentCooldown = 25;
      enfire = this.randomizeCooldown(enfire);
      enfire.dealsDirectDamage = false;
      enfire.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enfire, 20, 1, false, true));
      enemy.abilityList.push(enfire);
    }
    if (type === BestiaryEnum.InsaneSoul) {
      enemy.name = "Insane Soul";
      enemy.battleStats = new CharacterStats(623, 87, 112, 44, 45, 100);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 124;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 2, .05));
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 1, .1));
      enemy.loot.push(new LootItem(ItemsEnum.RoughTopazFragment, ItemTypeEnum.CraftingMaterial, 1, .02));

      var slam = new Ability();
      slam.name = "Slam";
      slam.isAvailable = true;
      slam.cooldown = slam.currentCooldown = 18;
      slam = this.randomizeCooldown(slam);
      slam.dealsDirectDamage = true;
      slam.effectiveness = 1;
      enemy.abilityList.push(slam);
    }
    if (type === BestiaryEnum.DualWieldingButcher) {
      enemy.name = "Dual-Wielding Butcher";
      enemy.battleStats = new CharacterStats(863, 70, 112, 110, 45, 125);
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 136;
      enemy.loot.push(new LootItem(ItemsEnum.SwordOfFlames, ItemTypeEnum.Equipment, 1, .01));
      enemy.loot.push(new LootItem(ItemsEnum.RoughRubyFragment, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.battleStats.elementIncrease.fire = .1;

      var dualSlice = new Ability();
      dualSlice.name = "Dual Slice";
      dualSlice.isAvailable = true;
      dualSlice.cooldown = dualSlice.currentCooldown = 24;
      dualSlice = this.randomizeCooldown(dualSlice);
      dualSlice.dealsDirectDamage = true;
      dualSlice.effectiveness = 1.7;
      dualSlice.elementalType = ElementalTypeEnum.Fire;
      dualSlice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.5, false, true));
      enemy.abilityList.push(dualSlice);
    }
    if (type === BestiaryEnum.HellRider) {
      enemy.name = "Hell Rider";
      enemy.battleStats = new CharacterStats(1133, 100, 151, 40, 50, 120);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 155;
      enemy.loot.push(new LootItem(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, 1, .075));
      enemy.loot.push(new LootItem(ItemsEnum.RoughRubyFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var trample = new Ability();
      trample.name = "Trample";
      trample.isAvailable = true;
      trample.effectiveness = 1.4;
      trample.cooldown = trample.currentCooldown = 23;
      trample = this.randomizeCooldown(trample);
      trample.dealsDirectDamage = true;
      trample.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 2, .25, trample.name));
      enemy.abilityList.push(trample);

      var stagger = new Ability();
      stagger.name = "Stagger";
      stagger.isAvailable = true;
      stagger.effectiveness = 1.75;
      stagger.cooldown = stagger.currentCooldown = 15;
      stagger = this.randomizeCooldown(stagger);
      stagger.dealsDirectDamage = true;
      stagger.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 8, .5, false, false));
      enemy.abilityList.push(stagger);
    }
    if (type === BestiaryEnum.FieryNewt) {
      enemy.name = "Fiery Newt";
      enemy.battleStats = new CharacterStats(712, 54, 82, 55, 55, 100);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.battleStats.elementIncrease.fire += .05;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 118;
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .075));

      var fireBreath = new Ability();
      fireBreath.name = "Fire Breath";
      fireBreath.isAvailable = true;
      fireBreath.cooldown = fireBreath.currentCooldown = 23;
      fireBreath = this.randomizeCooldown(fireBreath);
      fireBreath.dealsDirectDamage = true;
      fireBreath.effectiveness = 1.1;
      fireBreath.elementalType = ElementalTypeEnum.Fire;
      fireBreath.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .85, false, false));
      enemy.abilityList.push(fireBreath);
    }
    if (type === BestiaryEnum.EnflamedSalamander) {
      enemy.name = "Enflamed Salamander";
      enemy.battleStats = new CharacterStats(2150, 153, 190, 62, 70, 180);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleStats.elementIncrease.fire += .1;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 250;
      enemy.loot.push(new LootItem(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, 2, .125));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 3, .05));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 2, .20));

      var tailSwing = new Ability();
      tailSwing.name = "Tail Swipe";
      tailSwing.isAvailable = true;
      tailSwing.cooldown = tailSwing.currentCooldown = 18;
      tailSwing = this.randomizeCooldown(tailSwing);
      tailSwing.dealsDirectDamage = true;
      tailSwing.effectiveness = 1.2;
      tailSwing.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(tailSwing);

      var regeneration = new Ability();
      regeneration.name = "Regeneration";
      regeneration.isAvailable = true;
      regeneration.cooldown = regeneration.currentCooldown = 35;
      regeneration = this.randomizeCooldown(regeneration);
      regeneration.dealsDirectDamage = false;
      regeneration.heals = true;
      regeneration.targetType = TargetEnum.Self;
      regeneration.effectiveness = .6;
      regeneration.targetsAllies = true;
      enemy.abilityList.push(regeneration);
    }
    if (type === BestiaryEnum.FallenHero) {
      enemy.name = "Fallen Hero";
      enemy.battleStats = new CharacterStats(802, 83, 125, 40, 50, 150);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 133;
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 1, .2));

      var shieldUp = new Ability();
      shieldUp.name = "Shields Up";
      shieldUp.isAvailable = true;
      shieldUp.cooldown = shieldUp.currentCooldown = 22;
      shieldUp = this.randomizeCooldown(shieldUp);
      shieldUp.dealsDirectDamage = false;
      shieldUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.25, false, true, true));
      enemy.abilityList.push(shieldUp);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 28;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.1;
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.TwistedSoul) {
      enemy.name = "Twisted Soul";
      enemy.battleStats = new CharacterStats(809, 91, 139, 95, 50, 125);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 130;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .125));
      enemy.loot.push(new LootItem(ItemsEnum.RoughTopazFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 15;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);
    }
    if (type === BestiaryEnum.BlessedShade) {
      enemy.name = "Blessed Shade";
      enemy.battleStats = new CharacterStats(924, 136, 171, 65, 55, 125);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 128;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 1, .25));
      enemy.loot.push(new LootItem(ItemsEnum.RoughEmeraldFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
    }
    if (type === BestiaryEnum.ExiledHoplite) {
      enemy.name = "Exiled Hoplite";
      enemy.battleStats = new CharacterStats(1145, 141, 180, 52, 48, 200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 147;
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .1;
      enemy.loot.push(new LootItem(ItemsEnum.Narcissus, ItemTypeEnum.CraftingMaterial, 2, .075));
      enemy.loot.push(new LootItem(ItemsEnum.BrokenNecklace, ItemTypeEnum.CraftingMaterial, 1, .2));

      var focus = new Ability();
      focus.name = "Focus";
      focus.isAvailable = true;
      focus.cooldown = focus.currentCooldown = 20;
      focus = this.randomizeCooldown(focus);
      focus.dealsDirectDamage = false;
      focus.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Taunt, 12, 1, false, false, undefined, enemy.name));
      enemy.abilityList.push(focus);

      var bash = new Ability();
      bash.name = "Bash";
      bash.isAvailable = true;
      bash.cooldown = bash.currentCooldown = 26;
      bash = this.randomizeCooldown(bash);
      bash.dealsDirectDamage = true;
      bash.effectiveness = 1.4;
      enemy.abilityList.push(bash);
    }
    if (type === BestiaryEnum.Sisyphus) {
      enemy.name = "Sisyphus";
      enemy.battleStats = new CharacterStats(4970, 283, 448, 40, 50, 600);
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .25;
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 300;

      var rockslide = new Ability();
      rockslide.name = "Rockslide";
      rockslide.isAvailable = true;
      rockslide.effectiveness = 1.7;
      rockslide.cooldown = rockslide.currentCooldown = 16;
      rockslide = this.randomizeCooldown(rockslide);
      rockslide.dealsDirectDamage = true;
      rockslide.elementalType = ElementalTypeEnum.Earth;
      rockslide.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 10, .5, false, false));
      enemy.abilityList.push(rockslide);

      var fistsOfFury = new Ability();
      fistsOfFury.name = "Enfire";
      fistsOfFury.isAvailable = true;
      fistsOfFury.cooldown = fistsOfFury.currentCooldown = 14;
      fistsOfFury = this.randomizeCooldown(fistsOfFury);
      fistsOfFury.dealsDirectDamage = false;
      fistsOfFury.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Enfire, 10, 1, false, true));
      enemy.abilityList.push(fistsOfFury);
    }
    if (type === BestiaryEnum.Ixion) {
      enemy.name = "Ixion";
      enemy.battleStats = new CharacterStats(4430, 167, 369, 150, 125, 475);
      enemy.battleInfo.barrierValue = enemy.battleStats.maxHp * .1;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 300;

      var pathOfFlames = new Ability();
      pathOfFlames.name = "Path of Flames";
      pathOfFlames.isAvailable = true;
      pathOfFlames.effectiveness = 1.5;
      pathOfFlames.isAoe = true;
      pathOfFlames.cooldown = pathOfFlames.currentCooldown = 18;
      pathOfFlames = this.randomizeCooldown(pathOfFlames);
      pathOfFlames.dealsDirectDamage = true;
      pathOfFlames.elementalType = ElementalTypeEnum.Fire;
      pathOfFlames.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .25, pathOfFlames.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Fire));
      enemy.abilityList.push(pathOfFlames);

      var speedUp = new Ability();
      speedUp.name = "Speed Up";
      speedUp.isAvailable = true;
      speedUp.cooldown = speedUp.currentCooldown = 8;
      speedUp = this.randomizeCooldown(speedUp);
      speedUp.dealsDirectDamage = false;
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.1, false, true, false, undefined, undefined, true));
      speedUp.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.1, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(speedUp);

      var flamesOfTartarus = new Ability();
      flamesOfTartarus.name = "Flames of Tartarus";
      flamesOfTartarus.isAvailable = true;
      flamesOfTartarus.effectiveness = 4.8;
      flamesOfTartarus.cooldown = flamesOfTartarus.currentCooldown = 1000;
      flamesOfTartarus.dealsDirectDamage = true;
      flamesOfTartarus.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(flamesOfTartarus);
    }
    if (type === BestiaryEnum.Tantalus) {
      enemy.name = "Tantalus";
      enemy.battleStats = new CharacterStats(3684, 204, 349, 76, 125, 450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;

      var torment = new Ability();
      torment.name = "Torment";
      torment.isAvailable = true;
      torment.cooldown = torment.currentCooldown = 17;
      torment = this.randomizeCooldown(torment);
      torment.dealsDirectDamage = true;
      torment.isAoe = true;
      torment.effectiveness = 2.1;
      torment.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(torment);

      var twistedSacrifice = new Ability();
      twistedSacrifice.name = "Twisted Sacrifice";
      twistedSacrifice.isAvailable = true;
      twistedSacrifice.cooldown = twistedSacrifice.currentCooldown = 10;
      twistedSacrifice = this.randomizeCooldown(twistedSacrifice);
      twistedSacrifice.dealsDirectDamage = false;
      twistedSacrifice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.2, false, true, false, undefined, undefined, true));
      twistedSacrifice.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, -1, .8, false, false, false, undefined, undefined, true));
      enemy.abilityList.push(twistedSacrifice);
    }
    //these two are barrier based, can continously create barriers
    if (type === BestiaryEnum.Castor) {
      enemy.name = "Castor";
      enemy.battleStats = new CharacterStats(1750, 141, 162, 82, 75, 200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 250;

      var geminiStrike = new Ability();
      geminiStrike.name = "Gemini Strike";
      geminiStrike.isAvailable = true;
      geminiStrike.cooldown = geminiStrike.currentCooldown = 28;
      geminiStrike = this.randomizeCooldown(geminiStrike);
      geminiStrike.dealsDirectDamage = true;
      geminiStrike.effectiveness = 1.3;
      enemy.abilityList.push(geminiStrike);

      var ride = new Ability();
      ride.name = "Ride Down";
      ride.isAvailable = true;
      ride.cooldown = ride.currentCooldown = 12;
      ride = this.randomizeCooldown(ride);
      ride.dealsDirectDamage = false;
      ride.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 6, 1.3, false, true, true));
      enemy.abilityList.push(ride);
    }
    if (type === BestiaryEnum.Pollux) {
      enemy.name = "Pollux";
      enemy.battleStats = new CharacterStats(1517, 174, 173, 78, 104, 150);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 250;

      var divinity = new Ability();
      divinity.name = "Divinity";
      divinity.isAvailable = true;
      divinity.cooldown = divinity.currentCooldown = 12;
      divinity = this.randomizeCooldown(divinity);
      divinity.dealsDirectDamage = false;
      divinity.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Barrier, -1, .5, true, true, true, enemy.name, .5));
      enemy.abilityList.push(divinity);

      var firePower = new Ability();
      firePower.name = "Fire Power";
      firePower.isAvailable = true;
      firePower.cooldown = firePower.currentCooldown = 18;
      firePower = this.randomizeCooldown(firePower);
      firePower.dealsDirectDamage = false;
      firePower.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 6, 1.15, false, true, true));
      enemy.abilityList.push(firePower);
    }
    if (type === BestiaryEnum.ExplodingSoul) {
      enemy.name = "Exploding Soul";
      enemy.battleStats = new CharacterStats(1731, 182, 243, 140, 110, 180);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 145;
      enemy.loot.push(new LootItem(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, 3, .15));
      enemy.loot.push(new LootItem(ItemsEnum.RoughTopazFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 12;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);

      var explode = new Ability();
      explode.name = "Explode";
      explode.isAvailable = true;
      explode.cooldown = explode.currentCooldown = 30;
      explode.dealsDirectDamage = true;
      explode.effectiveness = 4.7;
      explode.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.SelfKO, 0, 1, true, false));
      enemy.abilityList.push(explode);
    }
    if (type === BestiaryEnum.Lycaon) {
      enemy.name = "Lycaon";
      enemy.battleStats = new CharacterStats(8208, 345, 613, 240, 200, 750);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 500;

      var claw = new Ability();
      claw.name = "Savage Claw";
      claw.isAvailable = true;
      claw.effectiveness = 2.3;
      claw.cooldown = claw.currentCooldown = 13;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .33, claw.name));
      enemy.abilityList.push(claw);

      var lacerate = new Ability();
      lacerate.name = "Lacerate";
      lacerate.isAvailable = true;
      lacerate.effectiveness = 1.4;
      lacerate.cooldown = lacerate.currentCooldown = 20;
      lacerate = this.randomizeCooldown(lacerate);
      lacerate.dealsDirectDamage = true;
      lacerate.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 2, .1, lacerate.name));
      enemy.abilityList.push(lacerate);

      var howl = new Ability();
      howl.name = "Howl";
      howl.isAvailable = true;
      howl.cooldown = howl.currentCooldown = 18;
      howl = this.randomizeCooldown(howl);
      howl.dealsDirectDamage = false;
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 12, 1.25, false, true, true));
      enemy.abilityList.push(howl);
    }
    if (type === BestiaryEnum.Melampus) {
      enemy.name = "Melampus";
      enemy.battleStats = new CharacterStats(10320, 389, 742, 300, 320, 750);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 500;
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.BlessingOfDionysus, -1, .5, false, true, true));
      
      var prod = new Ability();
      prod.name = "Prod";
      prod.isAvailable = true;
      prod.effectiveness = 2.1;
      prod.cooldown = prod.currentCooldown = 16;
      prod = this.randomizeCooldown(prod);
      prod.dealsDirectDamage = true;      
      enemy.abilityList.push(prod);

      var drink = new Ability();
      drink.name = "Drink";
      drink.isAvailable = true;
      drink.cooldown = drink.currentCooldown = 9;
      drink = this.randomizeCooldown(drink);
      drink.dealsDirectDamage = false;
      drink.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.SelfBarrier, -1, 2.5, true, true, false, enemy.name, 1));
      enemy.abilityList.push(drink);
    }
    if (type === BestiaryEnum.Atreus) {
      enemy.name = "Atreus";
      enemy.battleStats = new CharacterStats(16732, 515, 872, 361, 450, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.battleStats.elementIncrease.lightning = .25;
      enemy.xpGainFromDefeat = 650;

      var bronti = new Ability();
      bronti.name = "Bronti";
      bronti.isAvailable = true;
      bronti.effectiveness = 2;
      bronti.cooldown = bronti.currentCooldown = 18;
      bronti.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false));
      bronti = this.randomizeCooldown(bronti);
      bronti.dealsDirectDamage = true;
      bronti.elementalType = ElementalTypeEnum.Lightning;
      enemy.abilityList.push(bronti);

      var risingSun = new Ability();
      risingSun.name = "Rising Sun";
      risingSun.isAvailable = true;
      risingSun.effectiveness = 2;
      risingSun.cooldown = risingSun.currentCooldown = 14;
      risingSun = this.randomizeCooldown(risingSun);
      risingSun.dealsDirectDamage = true;
      risingSun.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(risingSun);
    }
    if (type === BestiaryEnum.Cassandra) {
      enemy.name = "Cassandra";
      enemy.battleStats = new CharacterStats(10450, 487, 815, 294, 483, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 500;

      var foresight = new Ability();
      foresight.name = "Foresight";
      foresight.isAvailable = true;
      foresight.dealsDirectDamage = false;
      foresight.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.SelfBarrier, -1, .8, true, true, false, enemy.name, 1));
      enemy.abilityList.push(foresight);

      var straightArrow = new Ability();
      straightArrow.name = "Straight Arrow";
      straightArrow.isAvailable = true;
      straightArrow.effectiveness = 1.9;
      straightArrow.cooldown = straightArrow.currentCooldown = 15;
      straightArrow = this.randomizeCooldown(straightArrow);
      straightArrow.dealsDirectDamage = true;
      straightArrow.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 4, .4, straightArrow.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(straightArrow);

      //if she dies first, heal Helenus 50% of his HP
      var lastBreath = new Ability();
      lastBreath.name = "Last Breath";
      lastBreath.isAvailable = true;
      lastBreath.dealsDirectDamage = false;
      enemy.abilityList.push(lastBreath);
    }
    if (type === BestiaryEnum.Helenus) {
      enemy.name = "Helenus";
      enemy.battleStats = new CharacterStats(12967, 684, 908, 285, 418, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 500;

      var slice = new Ability();
      slice.name = "Slice";
      slice.isAvailable = true;
      slice.effectiveness = 1.8;
      slice.cooldown = slice.currentCooldown = 18;
      slice = this.randomizeCooldown(slice);
      slice.dealsDirectDamage = true;
      enemy.abilityList.push(slice);
      
      var oneStepAhead = new Ability();
      oneStepAhead.name = "One Step Ahead";
      oneStepAhead.isAvailable = true;
      oneStepAhead.effectiveness = 1;
      oneStepAhead.dealsDirectDamage = true;
      oneStepAhead.cooldown = oneStepAhead.currentCooldown = 19;
      oneStepAhead = this.randomizeCooldown(oneStepAhead);
      oneStepAhead.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(oneStepAhead);

      //if he dies first, increase Helenus's attack by 50% permanently      
      var dyingWish = new Ability();
      dyingWish.name = "Dying Wish";
      dyingWish.isAvailable = true;
      dyingWish.dealsDirectDamage = false;
      dyingWish.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.5, false, true, false));
      enemy.abilityList.push(dyingWish);
    }
    if (type === BestiaryEnum.Rhadamanthus) {
      enemy.name = "Rhadamanthus";
      enemy.battleStats = new CharacterStats(16698, 436, 1292, 415, 415, 1000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 650;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Lightning;

      var lightningStrike = new Ability();
      lightningStrike.name = "Lightning Strike";
      lightningStrike.isAvailable = true;
      lightningStrike.effectiveness = 2.1;
      lightningStrike.cooldown = lightningStrike.currentCooldown = 17;
      lightningStrike.dealsDirectDamage = true;
      lightningStrike.elementalType = ElementalTypeEnum.Lightning;
      lightningStrike.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.15, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(lightningStrike);

      var favoredSon = new Ability();
      favoredSon.name = "Favored Son";
      favoredSon.isAvailable = true;
      favoredSon.cooldown = favoredSon.currentCooldown = 15;
      favoredSon = this.randomizeCooldown(favoredSon);
      favoredSon.dealsDirectDamage = false;
      favoredSon.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 7, 1.25, false, true, false));
      favoredSon.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 7, 1.25, false, true, false));
      enemy.abilityList.push(favoredSon); 
    }
    if (type === BestiaryEnum.Aeacus) {
      enemy.name = "Aeacus";
      enemy.battleStats = new CharacterStats(18815, 602, 1489, 483, 395, 1000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 650;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Holy;

      var divineProtection = new Ability();
      divineProtection.name = "Divine Protection";
      divineProtection.isAvailable = true;
      divineProtection.effectiveness = 1.75;
      divineProtection.cooldown = divineProtection.currentCooldown = 17;
      divineProtection.dealsDirectDamage = true;
      divineProtection.elementalType = ElementalTypeEnum.Holy;
      divineProtection.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, -1, 1.15, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(divineProtection);
      
      var inflexibility = new Ability();
      inflexibility.name = "Inflexibility";
      inflexibility.isAvailable = true;
      inflexibility.cooldown = inflexibility.currentCooldown = 23;
      inflexibility = this.randomizeCooldown(inflexibility);
      inflexibility.dealsDirectDamage = false;      
      inflexibility.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 15, 1.5, false, true, false));
      enemy.abilityList.push(inflexibility); 
    }
    if (type === BestiaryEnum.Minos) {
      enemy.name = "Minos";
      enemy.battleStats = new CharacterStats(25401, 748, 1582, 500, 550, 1200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 800;

      var slamOfTheGavel = new Ability();
      slamOfTheGavel.name = "Slam of the Gavel";
      slamOfTheGavel.isAvailable = true;
      slamOfTheGavel.effectiveness = 1.5;
      slamOfTheGavel.cooldown = slamOfTheGavel.currentCooldown = 14;
      slamOfTheGavel.dealsDirectDamage = true;
      enemy.abilityList.push(slamOfTheGavel);

      var lastHearing = new Ability();
      lastHearing.name = "Last Hearing";
      lastHearing.isAvailable = true;
      lastHearing.cooldown = lastHearing.currentCooldown = 25;
      lastHearing = this.randomizeCooldown(lastHearing);
      lastHearing.dealsDirectDamage = false;
      lastHearing.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 13, 1.45, false, true, false));
      lastHearing.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 13, 1.45, false, true, false));
      lastHearing.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 13, 1.45, false, true, false));
      enemy.abilityList.push(lastHearing);      

      var finalJudgment = new Ability();
      finalJudgment.name = "Final Judgment";
      finalJudgment.isAvailable = true;
      finalJudgment.effectiveness = 2;
      finalJudgment.cooldown = finalJudgment.currentCooldown = 40;
      finalJudgment.dealsDirectDamage = true;
      enemy.abilityList.push(finalJudgment);
    }
    if (type === BestiaryEnum.CreatureFromTheDeep) {
      enemy.name = "Creature From The Deep";
      enemy.battleStats = new CharacterStats(1485, 247, 224, 140, 100, 200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 135;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, 3, .2));

      var spray = new Ability();
      spray.name = "Spray";
      spray.isAvailable = true;
      spray.cooldown = spray.currentCooldown = 17;
      spray = this.randomizeCooldown(spray);
      spray.dealsDirectDamage = true;
      spray.effectiveness = 1.4;
      spray.isAoe = true;
      spray.elementalType = ElementalTypeEnum.Water;
      spray.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 6, .2, false, false, true));
      enemy.abilityList.push(spray);
    }
    if (type === BestiaryEnum.Acheron) {
      enemy.name = "Acheron";
      enemy.battleStats = new CharacterStats(3645, 228, 298, 90, 145, 225);
      enemy.battleStats.elementIncrease.water += .2;
      enemy.battleStats.elementResistance.fire += .2;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 350;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;

      //slow ability cd
      var spray = new Ability();
      spray.name = "Spray";
      spray.isAvailable = true;
      spray.cooldown = spray.currentCooldown = 20;
      spray = this.randomizeCooldown(spray);
      spray.dealsDirectDamage = true;
      spray.effectiveness = 1.4;
      spray.isAoe = true;
      spray.elementalType = ElementalTypeEnum.Water;
      spray.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 10, .2, false, false, true));
      enemy.abilityList.push(spray);

      var defend = new Ability();
      defend.name = "Defend";
      defend.isAvailable = true;
      defend.cooldown = defend.currentCooldown = 24;
      defend = this.randomizeCooldown(defend);
      defend.dealsDirectDamage = false;
      defend.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 7, .5, false, true, false));
      enemy.abilityList.push(defend);
    }
    if (type === BestiaryEnum.UnrulyHound) {
      enemy.name = "Unruly Hound";
      enemy.battleStats = new CharacterStats(1870, 104, 298, 100, 120, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 210;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 2, .075));

      var bark = new Ability();
      bark.name = "Bark";
      bark.isAvailable = true;
      bark.dealsDirectDamage = false;
      bark.cooldown = bark.currentCooldown = 15;
      bark = this.randomizeCooldown(bark);
      bark.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .85, false, false, true));
      enemy.abilityList.push(bark);

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.4;
      bite.cooldown = bite.currentCooldown = 13;
      bite = this.randomizeCooldown(bite);
      bite.dealsDirectDamage = true;
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.FirebreathingSerpent) {
      enemy.name = "Fire-Breathing Serpent";
      enemy.battleStats = new CharacterStats(1660, 171, 282, 120, 120, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 200;
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 2, .08));

      var spittingFlames = new Ability();
      spittingFlames.name = "Fire Breath";
      spittingFlames.isAvailable = true;
      spittingFlames.cooldown = spittingFlames.currentCooldown = 17;
      spittingFlames = this.randomizeCooldown(spittingFlames);
      spittingFlames.dealsDirectDamage = true;
      spittingFlames.effectiveness = 1.2;
      spittingFlames.elementalType = ElementalTypeEnum.Fire;
      spittingFlames.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .2, spittingFlames.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Fire));
      enemy.abilityList.push(spittingFlames);
    }
    if (type === BestiaryEnum.RogueNymph) {
      enemy.name = "Rogue Nymph";
      enemy.battleStats = new CharacterStats(1745, 172, 263, 135, 135, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 207;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 1, .15));

      var spiritOfTheForest = new Ability();
      spiritOfTheForest.name = "Spirit of the Forest";
      spiritOfTheForest.isAvailable = true;
      spiritOfTheForest.cooldown = spiritOfTheForest.currentCooldown = 28;
      spiritOfTheForest = this.randomizeCooldown(spiritOfTheForest);
      spiritOfTheForest.dealsDirectDamage = false;
      spiritOfTheForest.heals = true;
      spiritOfTheForest.effectiveness = .8;
      spiritOfTheForest.targetsAllies = true;
      spiritOfTheForest.targetType = TargetEnum.Self;
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.25, false, true, false));
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(spiritOfTheForest);
    }
    if (type === BestiaryEnum.StymphalianVulture) {
      enemy.name = "Stymphalian Vulture";
      enemy.battleStats = new CharacterStats(2212, 182, 301, 80, 60, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 215;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .125));

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 1.75;
      peck.cooldown = peck.currentCooldown = 19;
      peck = this.randomizeCooldown(peck);
      peck.dealsDirectDamage = true;
      enemy.abilityList.push(peck);
    }
    if (type === BestiaryEnum.ForestWisp) {
      enemy.name = "Forest Wisp";
      enemy.battleStats = new CharacterStats(2271, 203, 267, 150, 150, 250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 218;
      enemy.loot.push(new LootItem(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, 1, .1));

      var phase = new Ability();
      phase.name = "Ethereal";
      phase.isAvailable = true;
      phase.cooldown = phase.currentCooldown = 30;
      phase = this.randomizeCooldown(phase);
      phase.dealsDirectDamage = false;
      phase.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 6, 0, false, true));
      enemy.abilityList.push(phase);
    }
    if (type === BestiaryEnum.BrownBear) {
      enemy.name = "Brown Bear";
      enemy.battleStats = new CharacterStats(2343, 246, 312, 220, 220, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 221;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .025));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);
    }
    if (type === BestiaryEnum.CentaurScout) {
      enemy.name = "Centaur Scout";
      enemy.battleStats = new CharacterStats(2504, 121, 302, 140, 150, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 228;
      enemy.loot.push(new LootItem(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var soundTheAlarm = new Ability();
      soundTheAlarm.name = "Sound the Alarm";
      soundTheAlarm.isAvailable = true;
      soundTheAlarm.cooldown = soundTheAlarm.currentCooldown = 16;
      soundTheAlarm = this.randomizeCooldown(soundTheAlarm);
      soundTheAlarm.dealsDirectDamage = false;
      soundTheAlarm.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.25, false, true, true));
      soundTheAlarm.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, true));
      enemy.abilityList.push(soundTheAlarm);

      var lance = new Ability();
      lance.name = "Lance";
      lance.isAvailable = true;
      lance.effectiveness = 1.75;
      lance.cooldown = lance.currentCooldown = 14;
      lance = this.randomizeCooldown(lance);
      lance.dealsDirectDamage = true;
      lance.elementalType = ElementalTypeEnum.Earth;
      enemy.abilityList.push(lance);
    }
    if (type === BestiaryEnum.CentaurArcher) {
      enemy.name = "Centaur Archer";
      enemy.battleStats = new CharacterStats(2610, 201, 322, 140, 180, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 237;
      enemy.loot.push(new LootItem(ItemsEnum.SpiritBow, ItemTypeEnum.Equipment, 1, .02));

      var poisonTippedArrows = new Ability();
      poisonTippedArrows.name = "Poison Tipped Arrows";
      poisonTippedArrows.isAvailable = true;
      poisonTippedArrows.effectiveness = 1.2;
      poisonTippedArrows.cooldown = poisonTippedArrows.currentCooldown = 24;
      poisonTippedArrows = this.randomizeCooldown(poisonTippedArrows);
      poisonTippedArrows.dealsDirectDamage = true;
      poisonTippedArrows.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 4, 20, poisonTippedArrows.name, dotTypeEnum.TrueDamage));
      enemy.abilityList.push(poisonTippedArrows);
    }
    if (type === BestiaryEnum.CentaurWarrior) {
      enemy.name = "Centaur Warrior";
      enemy.battleStats = new CharacterStats(2943, 266, 352, 135, 150, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 243;
      enemy.loot.push(new LootItem(ItemsEnum.FendingMace, ItemTypeEnum.Equipment, 1, .02));

      var fend = new Ability();
      fend.name = "Fend";
      fend.isAvailable = true;
      fend.effectiveness = 1.8;
      fend.cooldown = fend.currentCooldown = 28;
      fend = this.randomizeCooldown(fend);
      fend.dealsDirectDamage = true;
      fend.elementalType = ElementalTypeEnum.Earth;
      enemy.abilityList.push(fend);

      var expose = new Ability();
      expose.name = "Expose";
      expose.isAvailable = true;
      expose.effectiveness = 1.6;
      expose.dealsDirectDamage = true;
      expose.cooldown = expose.currentCooldown = 22;
      expose = this.randomizeCooldown(expose);
      expose.elementalType = ElementalTypeEnum.Earth;
      expose.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .8, false, false));
      enemy.abilityList.push(expose);
    }
    if (type === BestiaryEnum.CentaurMystic) {
      enemy.name = "Centaur Mystic";
      enemy.battleStats = new CharacterStats(2713, 203, 315, 150, 170, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 242;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 1, .075));
      enemy.loot.push(new LootItem(ItemsEnum.GemmedNecklace, ItemTypeEnum.Equipment, 1, .02));

      var communeWithTheSpirits = new Ability();
      communeWithTheSpirits.name = "Commune with the Spirits";
      communeWithTheSpirits.isAvailable = true;
      communeWithTheSpirits.cooldown = communeWithTheSpirits.currentCooldown = 32;
      communeWithTheSpirits = this.randomizeCooldown(communeWithTheSpirits);
      communeWithTheSpirits.dealsDirectDamage = false;
      communeWithTheSpirits.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageUp, 15, 1.5, false, true, true));
      enemy.abilityList.push(communeWithTheSpirits);

      var stoneBlast = new Ability();
      stoneBlast.name = "Stone Blast";
      stoneBlast.isAvailable = true;
      stoneBlast.effectiveness = 1.9;
      stoneBlast.cooldown = stoneBlast.currentCooldown = 22;
      stoneBlast = this.randomizeCooldown(stoneBlast);
      stoneBlast.dealsDirectDamage = true;
      stoneBlast.elementalType = ElementalTypeEnum.Earth;
      stoneBlast.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 10, .85, false, false));
      enemy.abilityList.push(stoneBlast);
    }
    if (type === BestiaryEnum.StoneElemental) {
      enemy.name = "Stone Elemental";
      enemy.battleStats = new CharacterStats(3214, 248, 412, 100, 200, 350);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Earth;
      enemy.battleStats.elementIncrease.earth += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 242;
      enemy.loot.push(new LootItem(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.RoughOpalFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
      enemy.loot.push(new LootItem(ItemsEnum.RoughAmethystFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var shatter = new Ability();
      shatter.name = "Shatter";
      shatter.isAvailable = true;
      shatter.cooldown = shatter.currentCooldown = 28;
      shatter = this.randomizeCooldown(shatter);
      shatter.dealsDirectDamage = true;
      shatter.isAoe = true;
      shatter.effectiveness = 2;
      shatter.elementalType = ElementalTypeEnum.Earth;
      enemy.abilityList.push(shatter);
    }
    if (type === BestiaryEnum.ShadyTraveler) {
      enemy.name = "Shady Traveler";
      enemy.battleStats = new CharacterStats(2795, 143, 347, 160, 183, 325);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 238;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfLakeLerna, ItemTypeEnum.CraftingMaterial, 1, .15));

      var sneak = new Ability();
      sneak.name = "Sneak";
      sneak.isAvailable = true;
      sneak.cooldown = sneak.currentCooldown = 18;
      sneak = this.randomizeCooldown(sneak);
      sneak.dealsDirectDamage = false;
      sneak.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 8, 1.5, false, true, true));
      enemy.abilityList.push(sneak);

      var stab = new Ability();
      stab.name = "Stab";
      stab.isAvailable = true;
      stab.effectiveness = 1.9;
      stab.cooldown = stab.currentCooldown = 16;
      stab = this.randomizeCooldown(stab);
      stab.dealsDirectDamage = true;
      enemy.abilityList.push(stab);
    }
    if (type === BestiaryEnum.PushyMerchant) {
      enemy.name = "Pushy Merchant";
      enemy.battleStats = new CharacterStats(2896, 226, 354, 152, 195, 325);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 235;
      enemy.loot.push(new LootItem(ItemsEnum.RoughTopazFragment, ItemTypeEnum.CraftingMaterial, 1, .05));

      var hardBargain = new Ability();
      hardBargain.name = "Hard Bargain";
      hardBargain.isAvailable = true;
      hardBargain.cooldown = hardBargain.currentCooldown = 15;
      hardBargain = this.randomizeCooldown(hardBargain);
      hardBargain.dealsDirectDamage = false;
      hardBargain.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatUp, 15, 1.25, true, true, true));
      hardBargain.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDown, 15, .75, true, true, true));
      enemy.abilityList.push(hardBargain);
    }
    if (type === BestiaryEnum.FeistyBadger) {
      enemy.name = "Feisty Badger";
      enemy.battleStats = new CharacterStats(2577, 146, 328, 140, 180, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 243;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .0333));

      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 1.75;
      bite.cooldown = bite.currentCooldown = 19;
      bite = this.randomizeCooldown(bite);
      bite.dealsDirectDamage = true;
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.GoldenJackal) {
      enemy.name = "Golden Jackal";
      enemy.battleStats = new CharacterStats(2760, 220, 357, 192, 204, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 244;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .05));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(claw);
    }
    if (type === BestiaryEnum.FrenziedWisp) {
      enemy.name = "Frenzied Wisp";
      enemy.battleStats = new CharacterStats(2960, 245, 292, 150, 150, 300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 242;
      enemy.loot.push(new LootItem(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, 1, .12));

      var phase = new Ability();
      phase.name = "Ethereal";
      phase.isAvailable = true;
      phase.cooldown = phase.currentCooldown = 30;
      phase = this.randomizeCooldown(phase);
      phase.dealsDirectDamage = false;
      phase.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 6, 0, false, true));
      enemy.abilityList.push(phase);
    }
    if (type === BestiaryEnum.PatrinosBandit) {
      enemy.name = "Patrinos Bandit";
      enemy.battleStats = new CharacterStats(3112, 245, 369, 150, 225, 350);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 250;
      enemy.loot.push(new LootItem(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, 2, .15));

      var healingHerb = new Ability();
      healingHerb.name = "Healing Herb";
      healingHerb.targetType = TargetEnum.LowestHpPercent;
      healingHerb.isAvailable = false;
      healingHerb.effectiveness = .75;
      healingHerb.heals = true;
      healingHerb.targetsAllies = true;
      healingHerb.dealsDirectDamage = false;
      healingHerb.cooldown = healingHerb.currentCooldown = 13;
      healingHerb = this.randomizeCooldown(healingHerb);
      enemy.abilityList.push(healingHerb);
    }
    if (type === BestiaryEnum.PatrinosRogue) {
      enemy.name = "Patrinos Rogue";
      enemy.battleStats = new CharacterStats(3256, 232, 383, 175, 193, 350);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 6;
      enemy.xpGainFromDefeat = 252;
      enemy.loot.push(new LootItem(ItemsEnum.RoughRubyFragment, ItemTypeEnum.CraftingMaterial, 1, .03));

      var throwSand = new Ability();
      throwSand.name = "Throw Sand";
      throwSand.isAvailable = true;
      throwSand.effectiveness = 1.6;
      throwSand.cooldown = throwSand.currentCooldown = 24;
      throwSand = this.randomizeCooldown(throwSand);
      throwSand.dealsDirectDamage = true;
      throwSand.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 4, .25, false, false, true));
      enemy.abilityList.push(throwSand);
    }
    if (type === BestiaryEnum.PatrinosRuffian) {
      enemy.name = "Patrinos Ruffian";
      enemy.battleStats = new CharacterStats(3275, 286, 384, 155, 180, 350);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 254;
      enemy.loot.push(new LootItem(ItemsEnum.HeftyStone, ItemTypeEnum.BattleItem, 1, .125));

      var stoneToss = new Ability();
      stoneToss.name = "Stone Toss";
      stoneToss.isAvailable = true;
      stoneToss.cooldown = stoneToss.currentCooldown = 9;
      stoneToss = this.randomizeCooldown(stoneToss);
      stoneToss.dealsDirectDamage = false;
      stoneToss.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantTrueDamage, 0, 55, true, false, false));
      enemy.abilityList.push(stoneToss);
    }
    if (type === BestiaryEnum.PatrinosGangLeader) {
      enemy.name = "Patrinos Gang Leader";
      enemy.battleStats = new CharacterStats(6138, 286, 498, 185, 250, 400);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 7;
      enemy.xpGainFromDefeat = 450;
      enemy.loot.push(new LootItem(ItemsEnum.RoughEmeraldFragment, ItemTypeEnum.CraftingMaterial, 1, .05));

      var dustUp = new Ability();
      dustUp.name = "Dust Up";
      dustUp.isAvailable = true;
      dustUp.effectiveness = 1.6;
      dustUp.cooldown = dustUp.currentCooldown = 21;
      dustUp = this.randomizeCooldown(dustUp);
      dustUp.dealsDirectDamage = true;
      dustUp.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 12, .25, false, false, true));
      enemy.abilityList.push(dustUp);

      var stab = new Ability();
      stab.name = "Stab";
      stab.isAvailable = true;
      stab.effectiveness = 1.2;
      stab.cooldown = stab.currentCooldown = 14;
      stab = this.randomizeCooldown(stab);
      stab.dealsDirectDamage = true;
      enemy.abilityList.push(stab);

      var encourage = new Ability();
      encourage.name = "Encourage";
      encourage.isAvailable = true;
      encourage.cooldown = encourage.currentCooldown = 17;
      encourage = this.randomizeCooldown(encourage);
      encourage.dealsDirectDamage = false;
      encourage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.3, false, true, true));
      encourage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.3, false, true, true));
      enemy.abilityList.push(encourage);
    }

    if (type === BestiaryEnum.WoodlandNymph) {
      enemy.name = "Woodland Nymph";
      enemy.battleStats = new CharacterStats(4354, 380, 550, 250, 350, 450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 255;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 2, .04));

      var entangle = new Ability();
      entangle.name = "Entangle";
      entangle.isAvailable = true;
      entangle.effectiveness = 1.5;
      entangle.cooldown = entangle.currentCooldown = 18;
      entangle = this.randomizeCooldown(entangle);
      entangle.dealsDirectDamage = true;
      entangle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 12, .85, false, false, false));
      entangle.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .25, entangle.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(entangle);

      var spiritOfTheForest = new Ability();
      spiritOfTheForest.name = "Spirit of the Forest";
      spiritOfTheForest.isAvailable = true;
      spiritOfTheForest.cooldown = spiritOfTheForest.currentCooldown = 28;
      spiritOfTheForest = this.randomizeCooldown(spiritOfTheForest);
      spiritOfTheForest.dealsDirectDamage = false;
      spiritOfTheForest.heals = true;
      spiritOfTheForest.effectiveness = .8;
      spiritOfTheForest.targetsAllies = true;
      spiritOfTheForest.targetType = TargetEnum.Self;
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.25, false, true, false));
      spiritOfTheForest.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(spiritOfTheForest);
    }
    if (type === BestiaryEnum.HornedViper) {
      enemy.name = "Horned Viper";
      enemy.battleStats = new CharacterStats(4931, 277, 532, 325, 333, 450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 252;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 1, .03));

      var venomousBite = new Ability();
      venomousBite.name = "Venomous Bite";
      venomousBite.isAvailable = true;
      venomousBite.effectiveness = 1.3;
      venomousBite.cooldown = venomousBite.currentCooldown = 17;
      venomousBite = this.randomizeCooldown(venomousBite);
      venomousBite.dealsDirectDamage = true;
      venomousBite.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 2, .25, venomousBite.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(venomousBite);

      var coil = new Ability();
      coil.name = "Coil";
      coil.isAvailable = true;
      coil.cooldown = coil.currentCooldown = 24;
      coil = this.randomizeCooldown(coil);
      coil.dealsDirectDamage = false;
      coil.heals = true;
      coil.effectiveness = .6;
      coil.targetsAllies = true;
      coil.targetType = TargetEnum.Self;
      coil.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 12, 1.35, false, true, false));
      enemy.abilityList.push(coil);
    }
    if (type === BestiaryEnum.PoisonSpewingFungi) {
      enemy.name = "Poison Spewing Fungi";
      enemy.battleStats = new CharacterStats(4262, 423, 526, 223, 375, 450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 258;
      enemy.loot.push(new LootItem(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 1, .02));

      var emitToxin = new Ability();
      emitToxin.name = "Emit Toxin";
      emitToxin.isAvailable = true;
      emitToxin.cooldown = emitToxin.currentCooldown = 19;
      emitToxin = this.randomizeCooldown(emitToxin);
      emitToxin.dealsDirectDamage = false;
      emitToxin.isAoe = true;
      emitToxin.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .5, emitToxin.name, dotTypeEnum.BasedOnAttack, undefined, true));
      enemy.abilityList.push(emitToxin);

      var emitSpores = new Ability();
      emitSpores.name = "Emit Spores";
      emitSpores.isAvailable = true;
      emitSpores.cooldown = emitSpores.currentCooldown = 26;
      emitSpores = this.randomizeCooldown(emitSpores);
      emitSpores.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 12, .8, false, false, true));
      emitSpores.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 12, .8, false, false, true));
      emitSpores.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 12, .8, false, false, true));
      enemy.abilityList.push(emitSpores);
    }
    if (type === BestiaryEnum.ForestDryad) {
      enemy.name = "Forest Dryad";
      enemy.battleStats = new CharacterStats(4962, 363, 566, 273, 400, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 254;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 1, .05));

      var spines = new Ability();
      spines.name = "Spines";
      spines.isAvailable = true;
      spines.effectiveness = 1.9;
      spines.cooldown = spines.currentCooldown = 13;
      spines = this.randomizeCooldown(spines);
      spines.elementalType = ElementalTypeEnum.Earth;
      spines.dealsDirectDamage = true;
      enemy.abilityList.push(spines);

      var heartOfOak = new Ability();
      heartOfOak.name = "Heart of Oak";
      heartOfOak.isAvailable = true;
      heartOfOak.cooldown = heartOfOak.currentCooldown = 24;
      heartOfOak = this.randomizeCooldown(heartOfOak);
      heartOfOak.dealsDirectDamage = false;
      heartOfOak.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.EarthDamageUp, 12, 1.5, false, true, false));
      enemy.abilityList.push(heartOfOak);
    }
    if (type === BestiaryEnum.GreyWolf) {
      enemy.name = "Grey Wolf";
      enemy.battleStats = new CharacterStats(5237, 317, 581, 321, 450, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 256;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .05));

      var crunch = new Ability();
      crunch.name = "Crunch";
      crunch.isAvailable = true;
      crunch.effectiveness = 1.8;
      crunch.cooldown = crunch.currentCooldown = 13;
      crunch = this.randomizeCooldown(crunch);
      crunch.dealsDirectDamage = true;
      crunch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 4, .6, false, false, false));
      enemy.abilityList.push(crunch);

      var howl = new Ability();
      howl.name = "Howl";
      howl.isAvailable = true;
      howl.cooldown = howl.currentCooldown = 16;
      howl = this.randomizeCooldown(howl);
      howl.dealsDirectDamage = false;
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.25, false, true, false));
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(howl);
    }
    if (type === BestiaryEnum.AggravatedHunter) {
      enemy.name = "Aggravated Hunter";
      enemy.battleStats = new CharacterStats(5843, 368, 546, 215, 350, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 254;
      enemy.loot.push(new LootItem(ItemsEnum.HeftyStone, ItemTypeEnum.BattleItem, 1, .05));

      var sloppyShot = new Ability();
      sloppyShot.name = "Sloppy Shot";
      sloppyShot.isAvailable = true;
      sloppyShot.effectiveness = 1.6;
      sloppyShot.cooldown = sloppyShot.currentCooldown = 17;
      sloppyShot = this.randomizeCooldown(sloppyShot);
      sloppyShot.dealsDirectDamage = true;
      sloppyShot.damageModifierRange = .5;
      enemy.abilityList.push(sloppyShot);

      var fullBurst = new Ability();
      fullBurst.name = "Full Burst";
      fullBurst.isAvailable = true;
      fullBurst.effectiveness = 1.8;
      fullBurst.cooldown = fullBurst.currentCooldown = 23;
      fullBurst = this.randomizeCooldown(fullBurst);
      fullBurst.dealsDirectDamage = true;
      fullBurst.isAoe = true;
      fullBurst.damageModifierRange = .75;
      enemy.abilityList.push(fullBurst);
    }
    if (type === BestiaryEnum.Trapper) {
      enemy.name = "Trapper";
      enemy.battleStats = new CharacterStats(5197, 475, 576, 240, 300, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 254;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .025));
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, -1, 25, false, true, false));

      var bearTrap = new Ability();
      bearTrap.name = "Immobilize";
      bearTrap.isAvailable = true;
      bearTrap.effectiveness = 1.4;
      bearTrap.cooldown = bearTrap.currentCooldown = 9;
      bearTrap = this.randomizeCooldown(bearTrap);
      bearTrap.dealsDirectDamage = true;
      bearTrap.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false, false));
      enemy.abilityList.push(bearTrap);
    }
    if (type === BestiaryEnum.FeralBoar) {
      enemy.name = "Feral Boar";
      enemy.battleStats = new CharacterStats(5014, 401, 546, 280, 450, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 258;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .08));
      enemy.loot.push(new LootItem(ItemsEnum.BoarHide, ItemTypeEnum.CraftingMaterial, 1, .01));
      //always active by default
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceDirectDamage, -1, 25, false, true, false));

      var gore = new Ability();
      gore.name = "Gore";
      gore.isAvailable = true;
      gore.effectiveness = 1.8;
      gore.cooldown = gore.currentCooldown = 16;
      gore = this.randomizeCooldown(gore);
      gore.dealsDirectDamage = true;
      gore.targetEffect.push(this.globalService.createDamageOverTimeEffect(4, 4, 1, gore.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(gore);
    }
    if (type === BestiaryEnum.CarnivorousFlora) {
      enemy.name = "Carnivorous Flora";
      enemy.battleStats = new CharacterStats(5643, 497, 596, 225, 385, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 275;
      enemy.loot.push(new LootItem(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 1, .1));
      enemy.loot.push(new LootItem(ItemsEnum.FocusPotionRecipe, ItemTypeEnum.Resource, 1, .01));

      var devour = new Ability();
      devour.name = "Devour";
      devour.isAvailable = true;
      devour.effectiveness = 2.4;
      devour.cooldown = devour.currentCooldown = 23;
      devour = this.randomizeCooldown(devour);
      devour.dealsDirectDamage = true;
      enemy.abilityList.push(devour);

      var immobilize = new Ability();
      immobilize.name = "Immobilize";
      immobilize.isAvailable = true;
      immobilize.effectiveness = 1.5;
      immobilize.cooldown = immobilize.currentCooldown = 18;
      immobilize = this.randomizeCooldown(immobilize);
      immobilize.dealsDirectDamage = true;
      immobilize.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 4, 0, false, false, false));
      enemy.abilityList.push(immobilize);
    }
    if (type === BestiaryEnum.RedSpeckledToad) {
      enemy.name = "Red-Speckled Toad";
      enemy.battleStats = new CharacterStats(5468, 403, 543, 340, 383, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 262;
      enemy.loot.push(new LootItem(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 1, .05));

      var mimicry = new Ability();
      mimicry.name = "Mimicry";
      mimicry.isAvailable = true;
      mimicry.cooldown = mimicry.currentCooldown = 15;
      mimicry = this.randomizeCooldown(mimicry);
      mimicry.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .7, false, false, true));
      mimicry.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 8, .7, false, false, true));
      enemy.abilityList.push(mimicry);

      var redPoison = new Ability();
      redPoison.name = "Red Poison";
      redPoison.isAvailable = true;
      redPoison.cooldown = redPoison.currentCooldown = 18;
      redPoison = this.randomizeCooldown(redPoison);
      redPoison.dealsDirectDamage = false;
      redPoison.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 2, 40, redPoison.name, dotTypeEnum.TrueDamage, undefined, true));
      enemy.abilityList.push(redPoison);
    }
    if (type === BestiaryEnum.YellowSpeckledToad) {
      enemy.name = "Yellow-Speckled Toad";
      enemy.battleStats = new CharacterStats(5468, 452, 593, 275, 550, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 262;
      enemy.loot.push(new LootItem(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 1, .05));

      var mimicry = new Ability();
      mimicry.name = "Mimicry";
      mimicry.isAvailable = true;
      mimicry.cooldown = mimicry.currentCooldown = 15;
      mimicry = this.randomizeCooldown(mimicry);
      mimicry.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .7, false, false, true));
      mimicry.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 8, .7, false, false, true));
      enemy.abilityList.push(mimicry);

      var yellowPoison = new Ability();
      yellowPoison.name = "Yellow Poison";
      yellowPoison.isAvailable = true;
      yellowPoison.cooldown = yellowPoison.currentCooldown = 18;
      yellowPoison = this.randomizeCooldown(yellowPoison);
      yellowPoison.dealsDirectDamage = false;
      yellowPoison.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 6, 120, yellowPoison.name, dotTypeEnum.TrueDamage, undefined, true));
      enemy.abilityList.push(yellowPoison);
    }
    if (type === BestiaryEnum.WanderingIbex) {
      enemy.name = "Wandering Ibex";
      enemy.battleStats = new CharacterStats(5799, 424, 634, 325, 375, 525);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 265;
      enemy.loot.push(new LootItem(ItemsEnum.Leather, ItemTypeEnum.CraftingMaterial, 1, .2));
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .075));

      var trample = new Ability();
      trample.name = "Trample";
      trample.isAvailable = true;
      trample.cooldown = trample.currentCooldown = 14;
      trample = this.randomizeCooldown(trample);
      trample.dealsDirectDamage = true;
      trample.effectiveness = 2;
      trample.isAoe = true;
      enemy.abilityList.push(trample);

      var sprint = new Ability();
      sprint.name = "Sprint";
      sprint.isAvailable = true;
      sprint.cooldown = sprint.currentCooldown = 24;
      scavenge = this.randomizeCooldown(sprint);
      sprint.dealsDirectDamage = false;
      sprint.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 13, 1.5, false, true, false));
      enemy.abilityList.push(sprint);
    }
    if (type === BestiaryEnum.SavageBear) {
      enemy.name = "Savage Bear";
      enemy.battleStats = new CharacterStats(6052, 460, 684, 402, 300, 550);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 275;
      enemy.loot.push(new LootItem(ItemsEnum.BearHide, ItemTypeEnum.CraftingMaterial, 1, .01));
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .08));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

      var savagery = new Ability();
      savagery.name = "Savagery";
      savagery.isAvailable = true;
      savagery.cooldown = savagery.currentCooldown = 13;
      savagery = this.randomizeCooldown(savagery);
      savagery.dealsDirectDamage = false;
      savagery.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.15, false, true, false, undefined, undefined, true));
      savagery.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.15, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(savagery);
    }
    if (type === BestiaryEnum.GriffonVulture) {
      enemy.name = "Griffon Vulture";
      enemy.battleStats = new CharacterStats(5873, 542, 637, 275, 450, 525);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 273;
      enemy.loot.push(new LootItem(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, 1, .15));

      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 1.75;
      peck.cooldown = peck.currentCooldown = 19;
      peck = this.randomizeCooldown(peck);
      peck.dealsDirectDamage = true;
      enemy.abilityList.push(peck);

      var scavenge = new Ability();
      scavenge.name = "Scavenge";
      scavenge.isAvailable = true;
      scavenge.cooldown = scavenge.currentCooldown = 28;
      scavenge = this.randomizeCooldown(scavenge);
      scavenge.dealsDirectDamage = false;
      scavenge.heals = true;
      scavenge.effectiveness = .8;
      scavenge.targetsAllies = true;
      scavenge.targetType = TargetEnum.Self;
      scavenge.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(scavenge);
    }
    if (type === BestiaryEnum.Bobcat) {
      enemy.name = "Bobcat";
      enemy.battleStats = new CharacterStats(5735, 427, 648, 320, 400, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 277;
      enemy.loot.push(new LootItem(ItemsEnum.RestorativeHerb, ItemTypeEnum.HealingItem, 1, .06));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.8;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .25, claw.name));
      enemy.abilityList.push(claw);

      var scramble = new Ability();
      scramble.name = "Scramble";
      scramble.isAvailable = true;
      scramble.cooldown = scramble.currentCooldown = 12;
      scramble = this.randomizeCooldown(scramble);
      scramble.dealsDirectDamage = false;
      scramble.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 2, 0, false, true));
      enemy.abilityList.push(scramble);
    }
    if (type === BestiaryEnum.Leopard) {
      enemy.name = "Leopard";
      enemy.battleStats = new CharacterStats(6531, 441, 642, 360, 375, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 278;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 1, .1));

      var scratch = new Ability();
      scratch.name = "Scratch";
      scratch.isAvailable = true;
      scratch.effectiveness = 1.9;
      scratch.cooldown = scratch.currentCooldown = 9;
      scratch = this.randomizeCooldown(scratch);
      scratch.dealsDirectDamage = true;
      enemy.abilityList.push(scratch);

      var hamstring = new Ability();
      hamstring.name = "Hamstring";
      hamstring.isAvailable = true;
      hamstring.effectiveness = 1.8;
      hamstring.cooldown = hamstring.currentCooldown = 19;
      hamstring = this.randomizeCooldown(hamstring);
      hamstring.dealsDirectDamage = true;
      hamstring.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 6, .5, false, false, false));
      enemy.abilityList.push(hamstring);
    }
    if (type === BestiaryEnum.PitViper) {
      enemy.name = "Pit Viper";
      enemy.battleStats = new CharacterStats(6826, 418, 623, 260, 550, 500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 281;
      enemy.loot.push(new LootItem(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 1, .075));

      var venomousBite = new Ability();
      venomousBite.name = "Venomous Bite";
      venomousBite.isAvailable = true;
      venomousBite.effectiveness = 1.6;
      venomousBite.cooldown = venomousBite.currentCooldown = 15;
      venomousBite = this.randomizeCooldown(venomousBite);
      venomousBite.dealsDirectDamage = true;
      venomousBite.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 2, .25, venomousBite.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(venomousBite);

      var coil = new Ability();
      coil.name = "Coil";
      coil.isAvailable = true;
      coil.cooldown = coil.currentCooldown = 22;
      coil = this.randomizeCooldown(coil);
      coil.dealsDirectDamage = false;
      coil.heals = true;
      coil.effectiveness = .6;
      coil.targetsAllies = true;
      coil.targetType = TargetEnum.Self;
      coil.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 12, 1.35, false, true, false));
      enemy.abilityList.push(coil);
    }
    if (type === BestiaryEnum.AlphaGreyWolf) {
      enemy.name = "Alpha Grey Wolf";
      enemy.battleStats = new CharacterStats(7278, 437, 702, 335, 450, 550);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 288;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));

      var crunch = new Ability();
      crunch.name = "Crunch";
      crunch.isAvailable = true;
      crunch.effectiveness = 1.9;
      crunch.cooldown = crunch.currentCooldown = 13;
      crunch = this.randomizeCooldown(crunch);
      crunch.dealsDirectDamage = true;
      crunch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 4, .6, false, false, false));
      enemy.abilityList.push(crunch);

      var howl = new Ability();
      howl.name = "Howl";
      howl.isAvailable = true;
      howl.cooldown = howl.currentCooldown = 16;
      howl = this.randomizeCooldown(howl);
      howl.dealsDirectDamage = false;
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.5, false, true, false));
      howl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 10, 1.5, false, true, false));
      enemy.abilityList.push(howl);
    }
    if (type === BestiaryEnum.DenMother) {
      enemy.name = "Den Mother";
      enemy.battleStats = new CharacterStats(12840, 572, 1182, 581, 425, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 775;
      enemy.loot.push(new LootItem(ItemsEnum.BearHide, ItemTypeEnum.CraftingMaterial, 1, .25));
      enemy.loot.push(new LootItem(ItemsEnum.RestorativeHerb, ItemTypeEnum.HealingItem, 1, .1));
      enemy.loot.push(new LootItem(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 2, .33));

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 1.5;
      claw.cooldown = claw.currentCooldown = 22;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name));
      enemy.abilityList.push(claw);

      var swipe = new Ability();
      swipe.name = "Savage Swipe";
      swipe.isAvailable = true;
      swipe.effectiveness = 2.3;
      swipe.cooldown = swipe.currentCooldown = 26;
      swipe.isAoe = true;
      swipe = this.randomizeCooldown(swipe);
      swipe.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceHealing, 18, .5, false, false, false));
      swipe.dealsDirectDamage = true;
      enemy.abilityList.push(swipe);

      var savagery = new Ability();
      savagery.name = "Savagery";
      savagery.isAvailable = true;
      savagery.cooldown = savagery.currentCooldown = 15;
      savagery = this.randomizeCooldown(savagery);
      savagery.dealsDirectDamage = false;
      savagery.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.15, false, true, false, undefined, undefined, true));
      savagery.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.15, false, true, false, undefined, undefined, true));
      enemy.abilityList.push(savagery);
    }
    if (type === BestiaryEnum.CalydonianBoar) {
      enemy.name = "Calydonian Boar";
      enemy.battleStats = new CharacterStats(19634, 608, 1293, 440, 550, 950);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 2;
      enemy.xpGainFromDefeat = 1000;
      enemy.loot.push(new LootItem(ItemsEnum.BoarHide, ItemTypeEnum.CraftingMaterial, 1, .25));
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .15));
      enemy.loot.push(new LootItem(ItemsEnum.Violet, ItemTypeEnum.CraftingMaterial, 1, .3));
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceDirectDamage, -1, 200, false, true, false));

      var bodySlam = new Ability();
      bodySlam.name = "Body Slam";
      bodySlam.isAvailable = true;
      bodySlam.effectiveness = 2.3;
      bodySlam.cooldown = bodySlam.currentCooldown = 28;
      bodySlam = this.randomizeCooldown(bodySlam);
      bodySlam.dealsDirectDamage = true;
      enemy.abilityList.push(bodySlam);

      var gore = new Ability();
      gore.name = "Gore";
      gore.isAvailable = true;
      gore.effectiveness = 1.8;
      gore.cooldown = gore.currentCooldown = 21;
      gore = this.randomizeCooldown(gore);
      gore.dealsDirectDamage = true;
      gore.targetEffect.push(this.globalService.createDamageOverTimeEffect(8, 4, 1, gore.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(gore);

      var thickSkin = new Ability();
      thickSkin.name = "Thick Skin";
      thickSkin.isAvailable = true;
      thickSkin.cooldown = thickSkin.currentCooldown = 18;
      thickSkin = this.randomizeCooldown(thickSkin);
      thickSkin.dealsDirectDamage = false;
      thickSkin.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 14, 1.35, false, true, false));
      thickSkin.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 14, 1.35, false, true, false));
      enemy.abilityList.push(thickSkin);
    }
    if (type === BestiaryEnum.ForgetfulShade) {
      enemy.name = "Forgetful Shade";
      enemy.battleStats = new CharacterStats(9630, 427, 791, 295, 525, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 298; 
      enemy.loot.push(new LootItem(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, 1, .1));        
      
      var slam = new Ability();
      slam.name = "Slam";
      slam.isAvailable = true;
      slam.cooldown = slam.currentCooldown = 18;
      slam = this.randomizeCooldown(slam);
      slam.dealsDirectDamage = true;
      slam.effectiveness = 1;
      enemy.abilityList.push(slam);

      var ethereal = new Ability();
      ethereal.name = "Ethereal";
      ethereal.isAvailable = true;
      ethereal.cooldown = ethereal.currentCooldown = 20;
      ethereal = this.randomizeCooldown(ethereal);
      ethereal.dealsDirectDamage = false;
      ethereal.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 0, false, true));
      enemy.abilityList.push(ethereal);
    }
    if (type === BestiaryEnum.SpottedSalamander) {
      enemy.name = "Spotted Salamander";
      enemy.battleStats = new CharacterStats(9152, 418, 842, 320, 497, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 296;

      var tailSwing = new Ability();
      tailSwing.name = "Tail Swing";
      tailSwing.isAvailable = true;
      tailSwing.cooldown = tailSwing.currentCooldown = 18;
      tailSwing = this.randomizeCooldown(tailSwing);
      tailSwing.dealsDirectDamage = true;
      tailSwing.effectiveness = 1.8;
      enemy.abilityList.push(tailSwing);

      var regeneration = new Ability();
      regeneration.name = "Regeneration";
      regeneration.isAvailable = true;
      regeneration.cooldown = regeneration.currentCooldown = 35;
      regeneration = this.randomizeCooldown(regeneration);
      regeneration.dealsDirectDamage = false;
      regeneration.heals = true;
      regeneration.targetType = TargetEnum.Self;
      regeneration.effectiveness = .6;
      regeneration.targetsAllies = true;
      enemy.abilityList.push(regeneration);
    }
    if (type === BestiaryEnum.ArmoredRevenant) {
      enemy.name = "Armored Revenant";
      enemy.battleStats = new CharacterStats(10627, 533, 980, 445, 600, 900);
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 302;
      enemy.loot.push(new LootItem(ItemsEnum.MetalScraps, ItemTypeEnum.CraftingMaterial, 1, .04));   

      var soulRip = new Ability();
      soulRip.name = "Soul Rip";
      soulRip.isAvailable = true;
      soulRip.cooldown = soulRip.currentCooldown = 13;
      soulRip = this.randomizeCooldown(soulRip);
      soulRip.dealsDirectDamage = true;
      soulRip.effectiveness = 1;
      soulRip.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.InstantHeal, 0, .25, true, true));
      enemy.abilityList.push(soulRip);
      
      var impenetrableArmor = new Ability();
      impenetrableArmor.name = "Impenetrable Armor";
      impenetrableArmor.isAvailable = true;
      impenetrableArmor.cooldown = impenetrableArmor.currentCooldown = 22;
      impenetrableArmor = this.randomizeCooldown(impenetrableArmor);
      impenetrableArmor.dealsDirectDamage = false;
      impenetrableArmor.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 13, 1.25, false, true));
      impenetrableArmor.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 13, 1.25, false, true));
      enemy.abilityList.push(impenetrableArmor);
    }
    if (type === BestiaryEnum.DrownedAbomination) {
      enemy.name = "Drowned Abomination";
      enemy.battleStats = new CharacterStats(11903, 548, 944, 440, 600, 900);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 308;    
      enemy.loot.push(new LootItem(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.CraftingMaterial, 1, .05));    
      
      var hook = new Ability();
      hook.name = "Hook";
      hook.isAvailable = true;
      hook.elementalType = ElementalTypeEnum.Water;
      hook.cooldown = hook.currentCooldown = 17;
      hook = this.randomizeCooldown(hook);
      hook.dealsDirectDamage = true;
      hook.effectiveness = 1.6;
      hook.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Taunt, 12, 1, false, false, undefined, enemy.name));
      enemy.abilityList.push(hook);

      var spray = new Ability();
      spray.name = "Spray";
      spray.isAvailable = true;
      spray.cooldown = spray.currentCooldown = 24;
      spray = this.randomizeCooldown(spray);
      spray.dealsDirectDamage = true;
      spray.effectiveness = 1.3;
      spray.isAoe = true;
      spray.elementalType = ElementalTypeEnum.Water;
      spray.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 6, .2, false, false, true));
      enemy.abilityList.push(spray);
    }
    if (type === BestiaryEnum.RiverKarp) {
      enemy.name = "River Karp";
      enemy.battleStats = new CharacterStats(10130, 381, 896, 595, 525, 850);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.battleStats.elementResistance.lightning = this.utilityService.enemyMinorElementalWeakness;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 300;  
      enemy.loot.push(new LootItem(ItemsEnum.FishScales, ItemTypeEnum.CraftingMaterial, 2, .04));    
      
      var splash = new Ability();
      splash.name = "Splash";
      splash.isAvailable = true;
      splash.cooldown = splash.currentCooldown = 8;
      splash = this.randomizeCooldown(splash);
      splash.dealsDirectDamage = false;
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .7, false, false));
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 8, .7, false, false));
      enemy.abilityList.push(splash);

      var toughScales = new Ability();
      toughScales.name = "Tough Scales";
      toughScales.isAvailable = true;
      toughScales.cooldown = toughScales.currentCooldown = 20;
      toughScales = this.randomizeCooldown(toughScales);
      toughScales.dealsDirectDamage = false;
      toughScales.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 12, 40, false, true));
      enemy.abilityList.push(toughScales);
    }
    if (type === BestiaryEnum.FloatingSpirit) {
      enemy.name = "Floating Spirit";
      enemy.battleStats = new CharacterStats(9740, 404, 921, 495, 535, 900);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 306;   
      enemy.loot.push(new LootItem(ItemsEnum.SpiritEssence, ItemTypeEnum.CraftingMaterial, 1, .1));         
      
      var soulflame = new Ability();
      soulflame.name = "Soulflame";
      soulflame.isAvailable = true;
      soulflame.cooldown = soulflame.currentCooldown = 16;
      soulflame = this.randomizeCooldown(soulflame);
      soulflame.dealsDirectDamage = false;
      soulflame.targetEffect.push(this.globalService.createDamageOverTimeEffect(10, 5, .5, soulflame.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(soulflame);

      var sap = new Ability();
      sap.name = "Sap";
      sap.isAvailable = true;
      sap.cooldown = sap.currentCooldown = 15;
      sap = this.randomizeCooldown(sap);
      sap.dealsDirectDamage = false;
      sap.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Sap, -1, .2, true, false));
      enemy.abilityList.push(sap);
    }
    if (type === BestiaryEnum.WheelOfFlames) {
      enemy.name = "Wheel of Flames";
      enemy.battleStats = new CharacterStats(11087, 422, 983, 465, 580, 950);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMediumElementalWeakness;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 308;
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 1, .33));
      enemy.loot.push(new LootItem(ItemsEnum.RoughRubyFragment, ItemTypeEnum.CraftingMaterial, 1, .05));

      var rollThrough = new Ability();
      rollThrough.name = "Roll";
      rollThrough.isAvailable = true;
      rollThrough.cooldown = rollThrough.currentCooldown = 16;
      rollThrough = this.randomizeCooldown(rollThrough);
      rollThrough.dealsDirectDamage = true;
      rollThrough.isAoe = true;
      rollThrough.effectiveness = 1.4;
      rollThrough.elementalType = ElementalTypeEnum.Fire;
      enemy.abilityList.push(rollThrough);
    }
    if (type === BestiaryEnum.NightmareMonstrosity) {
      enemy.name = "Nightmare Monstrosity";
      enemy.battleStats = new CharacterStats(11630, 361, 1062, 605, 565, 950);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMediumElementalWeakness;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 314; 
      enemy.loot.push(new LootItem(ItemsEnum.LesserCrackedOpal, ItemTypeEnum.Resource, 1, .03));            
      
      var shadowBlast = new Ability();
      shadowBlast.name = "Shadow Blast";
      shadowBlast.isAvailable = true;
      shadowBlast.cooldown = shadowBlast.currentCooldown = 16;
      shadowBlast = this.randomizeCooldown(shadowBlast);
      shadowBlast.dealsDirectDamage = true;
      shadowBlast.effectiveness = 1.7;
      enemy.abilityList.push(shadowBlast);

      var nightmare = new Ability();
      nightmare.name = "Nightmare";
      nightmare.isAvailable = true;
      nightmare.cooldown = nightmare.currentCooldown = 15;
      nightmare = this.randomizeCooldown(nightmare);
      nightmare.dealsDirectDamage = false;      
      nightmare.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDown, 10, .8, true, false, false));
      enemy.abilityList.push(nightmare);
    }
    if (type === BestiaryEnum.ShadeOfHypnos) {
      enemy.name = "Shade of Hypnos";
      enemy.battleStats = new CharacterStats(47322, 562, 2195, 680, 750, 1380);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleStats.elementResistance.holy = this.utilityService.enemyMediumElementalWeakness;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 1075;            
      enemy.loot.push(new LootItem(ItemsEnum.RingOfNightmares, ItemTypeEnum.Equipment, 1, .02));   

      var shadowBlast = new Ability();
      shadowBlast.name = "Shadow Blast";
      shadowBlast.isAvailable = true;
      shadowBlast.cooldown = shadowBlast.currentCooldown = 17;
      shadowBlast = this.randomizeCooldown(shadowBlast);
      shadowBlast.dealsDirectDamage = true;
      shadowBlast.effectiveness = 1.8;
      enemy.abilityList.push(shadowBlast);

      var shadowSnare = new Ability();
      shadowSnare.name = "Shadow Snare";
      shadowSnare.isAvailable = true;
      shadowSnare.cooldown = shadowSnare.currentCooldown = 24;
      shadowSnare = this.randomizeCooldown(shadowSnare);
      shadowSnare.dealsDirectDamage = false;
      shadowSnare.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 15, .5, false, false));
      shadowSnare.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 5, .4, shadowSnare.name, dotTypeEnum.BasedOnAttack));
      enemy.abilityList.push(shadowSnare);
      
      var nightmare = new Ability();
      nightmare.name = "Nightmare";
      nightmare.isAvailable = true;
      nightmare.cooldown = nightmare.currentCooldown = 10;
      nightmare = this.randomizeCooldown(nightmare);
      nightmare.dealsDirectDamage = false;      
      nightmare.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RandomPrimaryStatDown, 20, .8, true, false, true));
      enemy.abilityList.push(nightmare);

      var dreameater = new Ability();
      dreameater.name = "Dreameater";
      dreameater.isAvailable = true;
      dreameater.cooldown = dreameater.currentCooldown = 35;
      dreameater = this.randomizeCooldown(dreameater);
      dreameater.dealsDirectDamage = true;      
      dreameater.effectiveness = 2.2;
      dreameater.isAoe = true;
      enemy.abilityList.push(dreameater);
    }
    if (type === BestiaryEnum.Acheron2) {
      enemy.name = "Acheron";
      enemy.battleStats = new CharacterStats(34232, 560, 1475, 470, 450, 1400);
      enemy.battleStats.elementIncrease.water += .2;
      enemy.battleStats.elementResistance.fire += .2;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 900;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      
      var rush = new Ability();
      rush.name = "Rush";
      rush.isAvailable = true;
      rush.cooldown = rush.currentCooldown = 16;
      rush = this.randomizeCooldown(rush);
      rush.dealsDirectDamage = true;
      rush.effectiveness = 1.8;
      rush.elementalType = ElementalTypeEnum.Water;      
      enemy.abilityList.push(rush);

      var acheronFlow = new Ability();
      acheronFlow.name = "Acheron Flow";
      acheronFlow.isAvailable = true;
      acheronFlow.cooldown = acheronFlow.currentCooldown = 20;
      acheronFlow.dealsDirectDamage = false;
      acheronFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.25, false, true));
      enemy.abilityList.push(acheronFlow);
      
      var spray = new Ability();
      spray.name = "Spray";
      spray.isAvailable = true;
      spray.cooldown = spray.currentCooldown = 24;
      spray = this.randomizeCooldown(spray);
      spray.dealsDirectDamage = true;
      spray.effectiveness = 1.4;
      spray.isAoe = true;
      spray.elementalType = ElementalTypeEnum.Water;
      spray.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 10, .5, false, false, true));
      enemy.abilityList.push(spray);

      var defend = new Ability();
      defend.name = "Defend";
      defend.isAvailable = true;
      defend.cooldown = defend.currentCooldown = 24;
      defend = this.randomizeCooldown(defend);
      defend.dealsDirectDamage = false;
      defend.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 7, .5, false, true, false));
      enemy.abilityList.push(defend);
    }
    if (type === BestiaryEnum.Cocytus) {
      enemy.name = "Cocytus";
      enemy.battleStats = new CharacterStats(36941, 463, 1605, 585, 450, 1650);
      enemy.battleStats.elementIncrease.water += .2;
      enemy.battleStats.elementResistance.fire += .2;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 850;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;

      var acheronFlow = new Ability();
      acheronFlow.name = "Cocytus Flow";
      acheronFlow.isAvailable = true;
      acheronFlow.cooldown = acheronFlow.currentCooldown = 20;
      acheronFlow.dealsDirectDamage = false;
      acheronFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.25, false, true));
      acheronFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.25, false, true));
      enemy.abilityList.push(acheronFlow);
      
      var weave = new Ability();
      weave.name = "Weave";
      weave.isAvailable = true;
      weave.cooldown = weave.currentCooldown = 13;
      weave = this.randomizeCooldown(weave);
      weave.dealsDirectDamage = true;
      weave.effectiveness = 2.5;
      weave.elementalType = ElementalTypeEnum.Water;
      weave.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 6, .75, false, false));
      enemy.abilityList.push(weave);
            
      var wail = new Ability();
      wail.name = "Wail";
      wail.isAvailable = true;
      wail.cooldown = wail.currentCooldown = 16;
      wail = this.randomizeCooldown(wail);
      wail.dealsDirectDamage = false;
      wail.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 6, .7, false, false, true));
      wail.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 6, .7, false, false, true));
      enemy.abilityList.push(wail);
    }
    if (type === BestiaryEnum.Lethe) {
      enemy.name = "Lethe";
      enemy.battleStats = new CharacterStats(44687, 695, 2045, 425, 575, 1700);      
      enemy.battleStats.elementResistance.fire += .2;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 950;

      var letheFlow = new Ability();
      letheFlow.name = "Lethe Flow";
      letheFlow.isAvailable = true;
      letheFlow.cooldown = letheFlow.currentCooldown = 20;
      letheFlow.dealsDirectDamage = false;
      letheFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.25, false, true));
      letheFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.25, false, true));
      letheFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, -1, 1.25, false, true));
      enemy.abilityList.push(letheFlow);
      
      var oblivion = new Ability();
      oblivion.name = "Oblivion";
      oblivion.isAvailable = true;
      oblivion.cooldown = oblivion.currentCooldown = 30;
      oblivion = this.randomizeCooldown(oblivion);
      oblivion.dealsDirectDamage = true;
      oblivion.effectiveness = 4;
      oblivion.isAoe = true;            
      enemy.abilityList.push(oblivion);

      var rest = new Ability();
      rest.name = "Rest";
      rest.isAvailable = true;
      rest.cooldown = rest.currentCooldown = 18;
      rest = this.randomizeCooldown(rest);
      rest.dealsDirectDamage = false;
      rest.heals = true;
      rest.effectiveness = 5;
      rest.targetsAllies = true;
      rest.targetType = TargetEnum.Self;
      enemy.abilityList.push(rest);
    }
    if (type === BestiaryEnum.Phlegethon) {
      enemy.name = "Phlegethon";
      enemy.battleStats = new CharacterStats(46678, 593, 1955, 500, 600, 1750);      
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleStats.elementResistance.fire += .5;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 950;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;

      var phlegethonFlow = new Ability();
      phlegethonFlow.name = "Phlegethon Flow";
      phlegethonFlow.isAvailable = true;
      phlegethonFlow.cooldown = phlegethonFlow.currentCooldown = 20;
      phlegethonFlow.dealsDirectDamage = false;
      phlegethonFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.25, false, true));
      phlegethonFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.25, false, true));
      phlegethonFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, -1, 1.25, false, true));
      phlegethonFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, -1, 1.25, false, true));
      enemy.abilityList.push(phlegethonFlow);
      
      var streamOfFire = new Ability();
      streamOfFire.name = "Stream of Fire";
      streamOfFire.isAvailable = true;
      streamOfFire.cooldown = streamOfFire.currentCooldown = 17;
      streamOfFire = this.randomizeCooldown(streamOfFire);
      streamOfFire.dealsDirectDamage = true;
      streamOfFire.effectiveness = 2.3;
      streamOfFire.elementalType = ElementalTypeEnum.Fire;
      streamOfFire.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 3, .2, streamOfFire.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(streamOfFire);

      var charredSkin = new Ability();
      charredSkin.name = "Charred Skin";
      charredSkin.isAvailable = true;
      charredSkin.cooldown = charredSkin.currentCooldown = 12;
      charredSkin = this.randomizeCooldown(charredSkin);
      charredSkin.dealsDirectDamage = false;
      charredSkin.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 8, 100, false, true));
      enemy.abilityList.push(charredSkin);
    }
    if (type === BestiaryEnum.Styx) {
      enemy.name = "Styx";
      enemy.battleStats = new CharacterStats(52932, 614, 2398, 600, 750, 1900);
      enemy.battleStats.elementIncrease.water += .2;
      enemy.battleStats.elementResistance.fire += .2;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 1050;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;

      var styxFlow = new Ability();
      styxFlow.name = "Styx Flow";
      styxFlow.isAvailable = true;
      styxFlow.cooldown = styxFlow.currentCooldown = 20;
      styxFlow.dealsDirectDamage = false;
      styxFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.25, false, true));
      styxFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, -1, 1.25, false, true));
      styxFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, -1, 1.25, false, true));
      styxFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, -1, 1.25, false, true));
      styxFlow.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.25, false, true));
      enemy.abilityList.push(styxFlow);
      
      //goddess of oaths, she can use one of each of the previous ones
      var weave = new Ability();
      weave.name = "Oath: Weave";
      weave.isAvailable = true;
      weave.cooldown = weave.currentCooldown = 15;
      weave = this.randomizeCooldown(weave);
      weave.dealsDirectDamage = true;
      weave.effectiveness = 3;
      weave.elementalType = ElementalTypeEnum.Water;
      weave.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 6, .75, false, false));
      enemy.abilityList.push(weave);

      var defend = new Ability();
      defend.name = "Oath: Defend";
      defend.isAvailable = true;
      defend.cooldown = defend.currentCooldown = 20;
      defend = this.randomizeCooldown(defend);
      defend.dealsDirectDamage = false;
      defend.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 7, .25, false, true, false));
      enemy.abilityList.push(defend);

      var oblivion = new Ability();
      oblivion.name = "Oath: Oblivion";
      oblivion.isAvailable = true;
      oblivion.cooldown = oblivion.currentCooldown = 40;
      oblivion = this.randomizeCooldown(oblivion);
      oblivion.dealsDirectDamage = true;
      oblivion.effectiveness = 5;
      oblivion.isAoe = true;            
      enemy.abilityList.push(oblivion);

      var streamOfFire = new Ability();
      streamOfFire.name = "Oath: Stream of Fire";
      streamOfFire.isAvailable = true;
      streamOfFire.cooldown = streamOfFire.currentCooldown = 16;
      streamOfFire = this.randomizeCooldown(streamOfFire);
      streamOfFire.dealsDirectDamage = true;
      streamOfFire.effectiveness = 2;
      streamOfFire.elementalType = ElementalTypeEnum.Fire;
      streamOfFire.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 3, .2, streamOfFire.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(streamOfFire);
    }
    if (type === BestiaryEnum.Charon) {
      enemy.name = "Charon";
      enemy.battleStats = new CharacterStats(58178, 598, 2855, 730, 1200, 2450);      
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleStats.elementResistance.fire += .5;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 1200;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;

      var oarThump = new Ability();
      oarThump.name = "Oar Thump";
      oarThump.isAvailable = true;
      oarThump.cooldown = oarThump.currentCooldown = 13;
      oarThump = this.randomizeCooldown(oarThump);
      oarThump.dealsDirectDamage = true;
      oarThump.effectiveness = 3.9;      
      enemy.abilityList.push(oarThump);

      var clubbingBlows = new Ability();
      clubbingBlows.name = "Clubbing Blows";
      clubbingBlows.isAvailable = true;
      clubbingBlows.cooldown = clubbingBlows.currentCooldown = 20;
      clubbingBlows = this.randomizeCooldown(clubbingBlows);
      clubbingBlows.dealsDirectDamage = true;
      oarThump.effectiveness = 3.2;      
      clubbingBlows.isAoe = true;
      clubbingBlows.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 5, 1, false, false, true));
      enemy.abilityList.push(clubbingBlows);

      var loyalFerryman = new Ability();
      loyalFerryman.name = "Loyal Ferryman";
      loyalFerryman.isAvailable = true;
      loyalFerryman.cooldown = loyalFerryman.currentCooldown = 45;      
      loyalFerryman.dealsDirectDamage = false;
      loyalFerryman.isAoe = true;
      loyalFerryman.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 300, .75, false, false, true));
      enemy.abilityList.push(loyalFerryman);
    }
    if (type === BestiaryEnum.Megaera) {
      enemy.name = "Megaera";
      enemy.battleStats = new CharacterStats(44234, 526, 3225, 810, 1250, 3150);       
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 900;

      var whipSmack = new Ability();
      whipSmack.name = "Whip Smack";
      whipSmack.isAvailable = true;
      whipSmack.cooldown = whipSmack.currentCooldown = 16;
      whipSmack = this.randomizeCooldown(whipSmack);
      whipSmack.dealsDirectDamage = true;
      whipSmack.effectiveness = 4.4;
      whipSmack.targetEffect.push(this.globalService.createDamageOverTimeEffect(9, 3, .3, whipSmack.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(whipSmack);
      
      var fateForetold = new Ability();
      fateForetold.name = "Fate Foretold";
      fateForetold.isAvailable = true;
      fateForetold.cooldown = 25;   
      fateForetold.currentCooldown = 0;   
      fateForetold.dealsDirectDamage = false;
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 10, 250, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.5, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.5, false, true));
      enemy.abilityList.push(fateForetold);

      var loyalArbiter = new Ability();
      loyalArbiter.name = "Loyal Arbiter";
      loyalArbiter.isAvailable = true;
      loyalArbiter.cooldown = loyalArbiter.currentCooldown = 45;      
      loyalArbiter.dealsDirectDamage = false;
      loyalArbiter.isAoe = true;
      loyalArbiter.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 300, .75, false, false, true));
      enemy.abilityList.push(loyalArbiter);
    }
    if (type === BestiaryEnum.Alecto) {
      enemy.name = "Alecto";
      enemy.battleStats = new CharacterStats(45540, 467, 2925, 930, 1450, 2520);            
      enemy.battleStats.elementIncrease.lightning += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 900;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Lightning;

      var arc = new Ability();
      arc.name = "Arc";
      arc.isAvailable = true;
      arc.cooldown = arc.currentCooldown = 19;
      arc = this.randomizeCooldown(arc);
      arc.dealsDirectDamage = true;
      arc.effectiveness = 4.1;
      arc.isAoe = true;
      arc.elementalType = ElementalTypeEnum.Lightning;
      arc.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Paralyze, 14, 0, false, false, true));
      enemy.abilityList.push(arc);

      var fateForetold = new Ability();
      fateForetold.name = "Fate Foretold";
      fateForetold.isAvailable = true;
      fateForetold.cooldown = 25; 
      fateForetold.currentCooldown = 5;     
      fateForetold.dealsDirectDamage = false;
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 10, 250, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.5, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.5, false, true));
      enemy.abilityList.push(fateForetold);
      
      var loyalArbiter = new Ability();
      loyalArbiter.name = "Loyal Arbiter";
      loyalArbiter.isAvailable = true;
      loyalArbiter.cooldown = loyalArbiter.currentCooldown = 45;      
      loyalArbiter.dealsDirectDamage = false;
      loyalArbiter.isAoe = true;
      loyalArbiter.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 300, .75, false, false, true));
      enemy.abilityList.push(loyalArbiter);
    }
    if (type === BestiaryEnum.Tisiphone) {
      enemy.name = "Tisiphone";
      enemy.battleStats = new CharacterStats(42502, 584, 2950, 775, 1050, 3850);        
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleStats.elementResistance.fire += .5;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 900;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;

      var hardBlade = new Ability();
      hardBlade.name = "Hard Blade";
      hardBlade.isAvailable = true;
      hardBlade.cooldown = hardBlade.currentCooldown = 15;
      hardBlade = this.randomizeCooldown(hardBlade);
      hardBlade.dealsDirectDamage = true;
      hardBlade.effectiveness = 3.4;
      enemy.abilityList.push(hardBlade);
      
      var morePunishment = new Ability();
      morePunishment.name = "More Punishment";
      morePunishment.isAvailable = true;
      morePunishment.cooldown = morePunishment.currentCooldown = 24;
      morePunishment = this.randomizeCooldown(morePunishment);
      morePunishment.dealsDirectDamage = true;
      morePunishment.effectiveness = 3.1;
      morePunishment.isAoe = true;
      enemy.abilityList.push(morePunishment);

      var fateForetold = new Ability();
      fateForetold.name = "Fate Foretold";
      fateForetold.isAvailable = true;
      fateForetold.cooldown = 25;      
      fateForetold.currentCooldown = 15;
      fateForetold.dealsDirectDamage = false;
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 10, 250, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.5, false, true));
      fateForetold.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.5, false, true));
      enemy.abilityList.push(fateForetold);
      
      var loyalArbiter = new Ability();
      loyalArbiter.name = "Loyal Arbiter";
      loyalArbiter.isAvailable = true;
      loyalArbiter.cooldown = loyalArbiter.currentCooldown = 45;      
      loyalArbiter.dealsDirectDamage = false;
      loyalArbiter.isAoe = true;
      loyalArbiter.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 300, .75, false, false, true));
      enemy.abilityList.push(loyalArbiter);
    }
    if (type === BestiaryEnum.Thanatos) {
      enemy.name = "Thanatos";
      enemy.battleStats = new CharacterStats(88029, 625, 3930, 750, 1550, 3450);             
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 1350;

      var reapersMark = new Ability();
      reapersMark.name = "Reaper's Mark";
      reapersMark.isAvailable = true;
      reapersMark.cooldown = 20;
      reapersMark.currentCooldown = 0;
      reapersMark.dealsDirectDamage = false;
      reapersMark.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.MaxHpDown, 20, .65, false, false));
      reapersMark.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 20, .65, false, false));
      reapersMark.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Focus, 20, 1, false, false, false, "Thanatos"));
      enemy.abilityList.push(reapersMark);

      var scytheCombo = new Ability();
      scytheCombo.name = "Scythe Combo";
      scytheCombo.isAvailable = true;
      scytheCombo.cooldown = scytheCombo.currentCooldown = 15;
      scytheCombo = this.randomizeCooldown(scytheCombo);
      scytheCombo.dealsDirectDamage = true;
      scytheCombo.effectiveness = 2.9;
      scytheCombo.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      enemy.abilityList.push(scytheCombo);      

      var deathWaitsForNoOne = new Ability();
      deathWaitsForNoOne.name = "Death Waits For No One";
      deathWaitsForNoOne.isAvailable = true;
      deathWaitsForNoOne.cooldown = deathWaitsForNoOne.currentCooldown = 24;
      deathWaitsForNoOne = this.randomizeCooldown(deathWaitsForNoOne);
      deathWaitsForNoOne.dealsDirectDamage = false;
      deathWaitsForNoOne.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 15, 1.5, false, true));
      deathWaitsForNoOne.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 15, 1.5, false, true));
      enemy.abilityList.push(deathWaitsForNoOne);
          
      var loyalServant = new Ability();
      loyalServant.name = "Loyal Servant";
      loyalServant.isAvailable = true;
      loyalServant.cooldown = loyalServant.currentCooldown = 45;      
      loyalServant.dealsDirectDamage = false;
      loyalServant.isAoe = true;
      loyalServant.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AllElementalResistanceDown, 300, -.25, false, false, true));
      enemy.abilityList.push(loyalServant);
    }
    if (type === BestiaryEnum.Cerberus) {
      enemy.name = "Cerberus";
      enemy.battleStats = new CharacterStats(98503, 557, 4630, 1250, 1600, 3800);    
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 1350;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;

      var tailSwipe = new Ability();
      tailSwipe.name = "Tail Swipe";
      tailSwipe.isAvailable = true;
      tailSwipe.cooldown = tailSwipe.currentCooldown = 21;
      tailSwipe = this.randomizeCooldown(tailSwipe);
      tailSwipe.dealsDirectDamage = true;
      tailSwipe.effectiveness = 4.2;
      tailSwipe.isAoe = true;
      tailSwipe.elementalType = ElementalTypeEnum.Fire;      
      enemy.abilityList.push(tailSwipe);

      var bite = new Ability();
      bite.name = "Tri-Bite";
      bite.isAvailable = true;
      bite.cooldown = bite.currentCooldown = 21;
      bite = this.randomizeCooldown(bite);
      bite.dealsDirectDamage = true;
      bite.effectiveness = 2.9;
      bite.elementalType = ElementalTypeEnum.Fire;      
      bite.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      bite.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      enemy.abilityList.push(bite);

      var roar = new Ability();
      roar.name = "Tri-Roar";
      roar.isAvailable = true;
      roar.cooldown = roar.currentCooldown = 30;      
      roar.dealsDirectDamage = false;
      roar.isAoe = true;
      roar.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 1, false, false, true));
      roar.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 15, .2, false, false, true));
      roar.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 15, .2, false, false, true));
      enemy.abilityList.push(roar);

      var loyalGuardian = new Ability();
      loyalGuardian.name = "Loyal Guardian";
      loyalGuardian.isAvailable = true;
      loyalGuardian.cooldown = loyalGuardian.currentCooldown = 45;      
      loyalGuardian.dealsDirectDamage = false;
      loyalGuardian.isAoe = true;
      loyalGuardian.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 300, .25, false, false, true));
      enemy.abilityList.push(loyalGuardian);
    }
    if (type === BestiaryEnum.Hades) {
      enemy.name = "Hades";
      enemy.battleStats = new CharacterStats(132606, 594, 5432, 850, 2000, 5500);     
      enemy.battleStats.elementIncrease.fire += .25;
      enemy.battleStats.elementIncrease.earth += .25;
      enemy.battleStats.elementResistance.fire += .5;
      enemy.battleStats.elementResistance.lightning += .5;
      enemy.battleStats.elementResistance.air += .5;
      enemy.battleStats.elementResistance.water += .5;
      enemy.battleStats.elementResistance.earth += .5;
      enemy.battleStats.elementResistance.holy += .5;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 1500;

      var lordOfTheUnderworld = new Ability();
      lordOfTheUnderworld.name = "Lord of the Underworld";
      lordOfTheUnderworld.isAvailable = true;
      lordOfTheUnderworld.cooldown = lordOfTheUnderworld.currentCooldown = 18;
      lordOfTheUnderworld = this.randomizeCooldown(lordOfTheUnderworld);
      lordOfTheUnderworld.dealsDirectDamage = false;
      lordOfTheUnderworld.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LordOfTheUnderworld, 30, 1.2, false, true, false, undefined, undefined, true));      
      enemy.abilityList.push(lordOfTheUnderworld);
      
      var hellfire = new Ability();
      hellfire.name = "Hellfire";
      hellfire.isAvailable = true;
      hellfire.cooldown = hellfire.currentCooldown = 16;
      hellfire = this.randomizeCooldown(hellfire);
      hellfire.dealsDirectDamage = true;
      hellfire.effectiveness = 3.5;
      hellfire.isAoe = true;
      hellfire.elementalType = ElementalTypeEnum.Fire;      
      enemy.abilityList.push(hellfire);
      
      var earthquake = new Ability();      
      earthquake.name = "Earthquake";
      earthquake.isAvailable = true;
      earthquake.cooldown = earthquake.currentCooldown = 24;
      earthquake = this.randomizeCooldown(earthquake);
      earthquake.dealsDirectDamage = true;
      earthquake.effectiveness = 4;
      earthquake.isAoe = true;
      earthquake.elementalType = ElementalTypeEnum.Earth;      
      enemy.abilityList.push(earthquake);

      var disaster = new Ability();      
      disaster.name = "Natural Disaster";
      disaster.isAvailable = true;
      disaster.cooldown = disaster.currentCooldown = 32;
      disaster = this.randomizeCooldown(disaster);
      disaster.dealsDirectDamage = true;
      disaster.effectiveness = 3.4;
      disaster.isAoe = true;      
      enemy.abilityList.push(disaster);
    }
    if (type === BestiaryEnum.SeaSerpent) {
      enemy.name = "Sea Serpent";      
      enemy.battleStats = new CharacterStats(28630, 450, 1400, 550, 600, 1100);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 358;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;      
      enemy.loot.push(new LootItem(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.CraftingMaterial, 1, .035));

      var fang = new Ability();
      fang.name = "Fang";
      fang.isAvailable = true;
      fang.effectiveness = 3.25;
      fang.cooldown = fang.currentCooldown = 18;
      fang = this.randomizeCooldown(fang);
      fang.dealsDirectDamage = true;
      fang.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 6, .8, false, false));
      enemy.abilityList.push(fang);

      var plunge = new Ability();
      plunge.name = "Plunge";
      plunge.isAvailable = true;
      plunge.cooldown = plunge.currentCooldown = 26;
      plunge = this.randomizeCooldown(plunge);
      plunge.dealsDirectDamage = false;
      plunge.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Untargetable, 6, 1, false, true));      
      enemy.abilityList.push(plunge);
    }
    if (type === BestiaryEnum.ShortfinMako) {
      enemy.name = "Shortfin Mako";
      enemy.battleStats = new CharacterStats(27213, 375, 1350, 700, 720, 1100);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 359;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.LesserCrackedAquamarine, ItemTypeEnum.Resource, 1, .02));            

      var zigzag = new Ability();
      zigzag.name = "Zigzag";
      zigzag.isAvailable = true;
      zigzag.cooldown = zigzag.currentCooldown = 13;
      zigzag = this.randomizeCooldown(zigzag);
      zigzag.dealsDirectDamage = true;
      zigzag.effectiveness = 2.8;
      zigzag.elementalType = ElementalTypeEnum.Water;
      zigzag.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 20, 1.2, false, true, undefined, undefined, undefined, true));
      enemy.abilityList.push(zigzag);

      var plunge = new Ability();
      plunge.name = "Plunge";
      plunge.isAvailable = true;
      plunge.cooldown = plunge.currentCooldown = 22;
      plunge = this.randomizeCooldown(plunge);
      plunge.dealsDirectDamage = false;
      plunge.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Untargetable, 6, 1, false, true));      
      enemy.abilityList.push(plunge);
    }
    if (type === BestiaryEnum.Blackfin) {
      enemy.name = "Blackfin";
      enemy.battleStats = new CharacterStats(37630, 530, 1670, 500, 750, 1350);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 368;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.RoughAquamarineFragment, ItemTypeEnum.CraftingMaterial, 1, .05));

      var apexPredator = new Ability();
      apexPredator.name = "Apex Predator";
      apexPredator.isAvailable = true;
      apexPredator.cooldown = apexPredator.currentCooldown = 25;
      apexPredator = this.randomizeCooldown(apexPredator);
      apexPredator.dealsDirectDamage = false;
      apexPredator.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 15, 1.4, false, true));
      apexPredator.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 15, 1.4, false, true));
      enemy.abilityList.push(apexPredator);

      var bloodInTheWater = new Ability();
      bloodInTheWater.name = "Blood in the Water";
      bloodInTheWater.isAvailable = true;
      bloodInTheWater.cooldown = bloodInTheWater.currentCooldown = 27;
      bloodInTheWater = this.randomizeCooldown(bloodInTheWater);
      bloodInTheWater.dealsDirectDamage = true;
      bloodInTheWater.effectiveness = 4;
      bloodInTheWater.isAoe = true;
      bloodInTheWater.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 4, .3, bloodInTheWater.name, dotTypeEnum.BasedOnAttack, undefined, true));
      enemy.abilityList.push(bloodInTheWater);
    }
    if (type === BestiaryEnum.DivingCormorant) {
      enemy.name = "Diving Cormorant";
      enemy.battleStats = new CharacterStats(30143, 461, 1430, 460, 575, 1150);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 359;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.Goldroot, ItemTypeEnum.CraftingMaterial, 1, .05));

      var dive = new Ability();
      dive.name = "Dive";
      dive.isAvailable = true;
      dive.effectiveness = 3.3;
      dive.cooldown = dive.currentCooldown = 18;
      dive = this.randomizeCooldown(dive);
      dive.dealsDirectDamage = true;
      dive.elementalType = ElementalTypeEnum.Air;
      dive.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 1, false, true));      
      enemy.abilityList.push(dive);
    }
    if (type === BestiaryEnum.RedFox) {
      enemy.name = "Red Fox";
      enemy.battleStats = new CharacterStats(29542, 392, 1421, 645, 915, 1200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 360;
      enemy.loot.push(new LootItem(ItemsEnum.LesserCrackedRuby, ItemTypeEnum.Resource, 1, .02));            
         
      var trickster = new Ability();
      trickster.name = "Trickster";
      trickster.isAvailable = true;
      trickster.cooldown = trickster.currentCooldown = 15;
      trickster = this.randomizeCooldown(trickster);
      trickster.dealsDirectDamage = false;
      trickster.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 9, .7, false, false, false));
      trickster.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckDown, 9, .7, false, false, false));
      trickster.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 9, .7, false, false, false));
      enemy.abilityList.push(trickster);

      var crunch = new Ability();
      crunch.name = "Crunch";
      crunch.isAvailable = true;
      crunch.effectiveness = 2.8;
      crunch.cooldown = crunch.currentCooldown = 13;
      crunch = this.randomizeCooldown(crunch);
      crunch.dealsDirectDamage = true;
      crunch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 5, .7, false, false, false));
      enemy.abilityList.push(crunch);
    }
    if (type === BestiaryEnum.EnragedVillager) {
      enemy.name = "Enraged Villager";
      enemy.battleStats = new CharacterStats(34563, 475, 1515, 500, 850, 1250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 364;
      enemy.loot.push(new LootItem(ItemsEnum.Lousewort, ItemTypeEnum.CraftingMaterial, 2, .08));
                  
      var throwTorch = new Ability();
      throwTorch.name = "Throw Torch";
      throwTorch.isAvailable = true;
      throwTorch.cooldown = throwTorch.currentCooldown = 16;
      throwTorch = this.randomizeCooldown(throwTorch);
      throwTorch.effectiveness = 2.8;
      throwTorch.dealsDirectDamage = true;
      throwTorch.elementalType = ElementalTypeEnum.Fire;
      throwTorch.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .33, throwTorch.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(throwTorch);

      var shout = new Ability();
      shout.name = "Shout";
      shout.isAvailable = true;
      shout.cooldown = shout.currentCooldown = 20;
      shout = this.randomizeCooldown(shout);      
      shout.dealsDirectDamage = false;      
      shout.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 12, .8, false, false, true));
      shout.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 12, 1.2, false, true, true));
      enemy.abilityList.push(shout);
    }
    if (type === BestiaryEnum.BlindedVillager) {
      enemy.name = "Blinded Villager";
      enemy.battleStats = new CharacterStats(33898, 475, 1460, 525, 1050, 1200);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 364;
      enemy.battleInfo.statusEffects.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, -1, .2, false, false));
            
      var wildSwing = new Ability();
      wildSwing.name = "Wild Swing";
      wildSwing.isAvailable = true;
      wildSwing.effectiveness = 3.3;
      wildSwing.cooldown = wildSwing.currentCooldown = 18;
      wildSwing = this.randomizeCooldown(wildSwing);
      wildSwing.dealsDirectDamage = true;
      wildSwing.damageModifierRange = .5;
      enemy.abilityList.push(wildSwing);

      var wildCombo = new Ability();
      wildCombo.name = "Wild Combo";
      wildCombo.isAvailable = true;
      wildCombo.effectiveness = 2.9;
      wildCombo.cooldown = wildCombo.currentCooldown = 23;
      wildCombo = this.randomizeCooldown(wildCombo);
      wildCombo.dealsDirectDamage = true;
      wildCombo.isAoe = true;
      wildCombo.damageModifierRange = .5;
      enemy.abilityList.push(wildCombo);
    }
    if (type === BestiaryEnum.Falcon) {
      enemy.name = "Falcon";
      enemy.battleStats = new CharacterStats(28542, 404, 1365, 680, 850, 1250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 366;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.Sorrel, ItemTypeEnum.CraftingMaterial, 1, .02));
            
      var dive = new Ability();
      dive.name = "Dive";
      dive.isAvailable = true;
      dive.effectiveness = 3;
      dive.cooldown = dive.currentCooldown = 15;
      dive = this.randomizeCooldown(dive);
      dive.dealsDirectDamage = true;
      dive.elementalType = ElementalTypeEnum.Air;
      dive.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 1, false, true));      
      enemy.abilityList.push(dive);

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 3.4;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 16;
      slash = this.randomizeCooldown(slash);
      slash.elementalType = ElementalTypeEnum.Air;
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .7, false, false));
      enemy.abilityList.push(slash);

      var roost = new Ability();
      roost.name = "Roost";
      roost.isAvailable = true;
      roost.cooldown = roost.currentCooldown = 23;
      roost = this.randomizeCooldown(roost);
      roost.dealsDirectDamage = false;
      roost.heals = true;
      roost.effectiveness = 1.8;
      roost.targetsAllies = true;
      roost.targetType = TargetEnum.Self;
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.25, false, true, false));
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(roost);
    }
    if (type === BestiaryEnum.RamblingHusk) {
      enemy.name = "Rambling Husk";
      enemy.battleStats = new CharacterStats(36215, 500, 1580, 630, 1200, 1500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 372;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.6;
      tackle.cooldown = tackle.currentCooldown = 17;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);
    }
    if (type === BestiaryEnum.SoullessHusk) {
      enemy.name = "Soulless Husk";
      enemy.battleStats = new CharacterStats(37013, 585, 1545, 575, 1450, 1500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 372;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;              
                
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.6;
      tackle.cooldown = tackle.currentCooldown = 17;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var halfHeartedAttack = new Ability();
      halfHeartedAttack.name = "Half Hearted Attack";
      halfHeartedAttack.isAvailable = true;
      halfHeartedAttack.effectiveness = 3.6;
      halfHeartedAttack.cooldown = halfHeartedAttack.currentCooldown = 21;
      halfHeartedAttack = this.randomizeCooldown(halfHeartedAttack);
      halfHeartedAttack.dealsDirectDamage = true;
      halfHeartedAttack.damageModifierRange = .5;
      enemy.abilityList.push(halfHeartedAttack);
    }
    if (type === BestiaryEnum.BaskingShark) {
      enemy.name = "Basking Shark";
      enemy.battleStats = new CharacterStats(45234, 593, 1885, 525, 1375, 1750);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 375;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.SharkTeeth, ItemTypeEnum.CraftingMaterial, 2, .05));

      var apexPredator = new Ability();
      apexPredator.name = "Apex Predator";
      apexPredator.isAvailable = true;
      apexPredator.cooldown = apexPredator.currentCooldown = 25;
      apexPredator = this.randomizeCooldown(apexPredator);
      apexPredator.dealsDirectDamage = false;
      apexPredator.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 15, 1.4, false, true));
      apexPredator.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 15, 1.4, false, true));
      enemy.abilityList.push(apexPredator);

      var bloodInTheWater = new Ability();
      bloodInTheWater.name = "Blood in the Water";
      bloodInTheWater.isAvailable = true;
      bloodInTheWater.cooldown = bloodInTheWater.currentCooldown = 24;
      bloodInTheWater = this.randomizeCooldown(bloodInTheWater);
      bloodInTheWater.effectiveness = 4.2;
      bloodInTheWater.isAoe = true;
      bloodInTheWater.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 4, .25, bloodInTheWater.name, dotTypeEnum.BasedOnAttack, undefined, true));
      enemy.abilityList.push(bloodInTheWater);
      
      var feedingFrenzy = new Ability();
      feedingFrenzy.name = "Feeding Frenzy";
      feedingFrenzy.isAvailable = true;
      feedingFrenzy.cooldown = feedingFrenzy.currentCooldown = 29;
      feedingFrenzy = this.randomizeCooldown(feedingFrenzy);
      feedingFrenzy.dealsDirectDamage = true;
      feedingFrenzy.effectiveness = 3.2;
      feedingFrenzy.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      feedingFrenzy.elementalType = ElementalTypeEnum.Water;
      enemy.abilityList.push(feedingFrenzy);     
    }
    if (type === BestiaryEnum.LongfinMako) {
      enemy.name = "Longfin Mako";
      enemy.battleStats = new CharacterStats(36872, 430, 1700, 820, 850, 1650);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 371;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.LesserCrackedAquamarine, ItemTypeEnum.Resource, 1, .03));       
      enemy.loot.push(new LootItem(ItemsEnum.SharkTeeth, ItemTypeEnum.Resource, 1, .01)); 

      var zigzag = new Ability();
      zigzag.name = "Zigzag";
      zigzag.isAvailable = true;
      zigzag.effectiveness = 3.7;
      zigzag.cooldown = zigzag.currentCooldown = 14;
      zigzag = this.randomizeCooldown(zigzag);
      zigzag.dealsDirectDamage = true;
      zigzag.effectiveness = 1.7;
      zigzag.elementalType = ElementalTypeEnum.Water;
      zigzag.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 20, 1.5, false, true, undefined, undefined, undefined, true));
      enemy.abilityList.push(zigzag);

      var plunge = new Ability();
      plunge.name = "Plunge";
      plunge.isAvailable = true;
      plunge.cooldown = plunge.currentCooldown = 26;
      plunge = this.randomizeCooldown(plunge);
      plunge.dealsDirectDamage = false;
      plunge.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Untargetable, 6, 1, false, true));      
      enemy.abilityList.push(plunge);
    }
    if (type === BestiaryEnum.ClickingCrabs) {
      enemy.name = "Clicking Crab";
      enemy.battleStats = new CharacterStats(39785, 493, 1780, 695, 1050, 1650);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 373;
      enemy.loot.push(new LootItem(ItemsEnum.Seashell, ItemTypeEnum.Resource, 1, .03)); 

      var clickClick = new Ability();
      clickClick.name = "Click Click";
      clickClick.isAvailable = true;
      clickClick.cooldown = clickClick.currentCooldown = 10;
      clickClick = this.randomizeCooldown(clickClick);
      clickClick.dealsDirectDamage = false;
      clickClick.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, -1, 1.1, false, true, undefined, undefined, undefined, true));
      clickClick.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, -1, 1.1, false, true, undefined, undefined, undefined, true));
      enemy.abilityList.push(clickClick);

      var snipSnip = new Ability();
      snipSnip.name = "Snip Snip";
      snipSnip.isAvailable = true;
      snipSnip.cooldown = snipSnip.currentCooldown = 17;
      snipSnip = this.randomizeCooldown(snipSnip);
      snipSnip.dealsDirectDamage = true;
      snipSnip.effectiveness = 3.9;
      snipSnip.targetEffect.push(this.globalService.createDamageOverTimeEffect(9, 3, .2, snipSnip.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(snipSnip);
    }
    if (type === BestiaryEnum.RedSnapper) {
      enemy.name = "Red Snapper";
      enemy.battleStats = new CharacterStats(37268, 462, 1775, 850, 1150, 1650);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 368;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.FishScales, ItemTypeEnum.CraftingMaterial, 1, .06));

      var splash = new Ability();
      splash.name = "Splash";
      splash.isAvailable = true;
      splash.cooldown = splash.currentCooldown = 8;
      splash = this.randomizeCooldown(splash);
      splash.dealsDirectDamage = false;
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 8, .7, false, false));
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 8, .7, false, false));
      enemy.abilityList.push(splash);

      var toughScales = new Ability();
      toughScales.name = "Tough Scales";
      toughScales.isAvailable = true;
      toughScales.cooldown = toughScales.currentCooldown = 20;
      toughScales = this.randomizeCooldown(toughScales);
      toughScales.dealsDirectDamage = false;
      toughScales.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 12, 40, false, true));
      enemy.abilityList.push(toughScales);
    }
    if (type === BestiaryEnum.FeralHarpy) {
      enemy.name = "Feral Harpy";
      enemy.battleStats = new CharacterStats(39758, 525, 2000, 785, 1450, 2000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 371;
      enemy.loot.push(new LootItem(ItemsEnum.LesserCrackedAmethyst, ItemTypeEnum.Resource, 1, .03));            
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 4.7;
      ravage.cooldown = ravage.currentCooldown = 15;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 3.5;
      claw.cooldown = claw.currentCooldown = 18;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.elementalType = ElementalTypeEnum.Air;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Air));
      enemy.abilityList.push(claw);      
    }
    if (type === BestiaryEnum.FerventHarpy) {
      enemy.name = "Fervent Harpy";
      enemy.battleStats = new CharacterStats(40687, 440, 1960, 1000, 1525, 2000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.loot.push(new LootItem(ItemsEnum.RoughAmethystFragment, ItemTypeEnum.Resource, 1, .04));            
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 368;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 4.7;
      ravage.cooldown = ravage.currentCooldown = 13;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);

      var pressingAttack = new Ability();
      pressingAttack.name = "Pressing Attack";
      pressingAttack.isAvailable = true;
      pressingAttack.effectiveness = 4.5;
      pressingAttack.cooldown = pressingAttack.currentCooldown = 17;
      pressingAttack = this.randomizeCooldown(pressingAttack);
      pressingAttack.dealsDirectDamage = true;
      pressingAttack.elementalType = ElementalTypeEnum.Air;
      pressingAttack.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 8, .33, false, false));
      pressingAttack.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 8, .33, false, false));
      enemy.abilityList.push(pressingAttack);      
    }
    if (type === BestiaryEnum.TerritorialHarpy) {
      enemy.name = "Territorial Harpy";
      enemy.battleStats = new CharacterStats(41585, 658, 2050, 765, 1500, 2150);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;      
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 375;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 4.4;
      ravage.cooldown = ravage.currentCooldown = 19;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);

      var harry = new Ability();
      harry.name = "Harry";
      harry.isAvailable = true;
      harry.effectiveness = 4.7;
      harry.cooldown = harry.currentCooldown = 28;
      harry = this.randomizeCooldown(harry);
      harry.dealsDirectDamage = true;
      harry.elementalType = ElementalTypeEnum.Air;
      harry.targetEffect.push(this.globalService.createDamageOverTimeEffect(16, 2, 65, harry.name, dotTypeEnum.TrueDamage, ElementalTypeEnum.Air));
      enemy.abilityList.push(harry);      
    }
    if (type === BestiaryEnum.HarpyQueen) {
      enemy.name = "Harpy Queen";      
      enemy.battleStats = new CharacterStats(78934, 820, 2825, 950, 1750, 2250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyVeryLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 800;
      enemy.loot.push(new LootItem(ItemsEnum.RoughAmethystFragment, ItemTypeEnum.CraftingMaterial, 2, .04));
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 4.2;
      ravage.cooldown = ravage.currentCooldown = 18;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);

      var windstorm = new Ability();
      windstorm.name = "Windstorm";
      windstorm.isAvailable = true;
      windstorm.effectiveness = 3.1;
      windstorm.cooldown = windstorm.currentCooldown = 26;
      windstorm = this.randomizeCooldown(windstorm);
      windstorm.dealsDirectDamage = true;
      windstorm.elementalType = ElementalTypeEnum.Air;
      windstorm.targetEffect.push(this.globalService.createDamageOverTimeEffect(15, 3, .4, windstorm.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Air));
      enemy.abilityList.push(windstorm);      

      var takeToTheSkies = new Ability();
      takeToTheSkies.name = "Take to the Skies";
      takeToTheSkies.isAvailable = true;
      takeToTheSkies.cooldown = takeToTheSkies.currentCooldown = 38;
      takeToTheSkies = this.randomizeCooldown(takeToTheSkies);
      takeToTheSkies.dealsDirectDamage = false;
      takeToTheSkies.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AirDamageUp, 20, 1.25, false, true, true));
      takeToTheSkies.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 20, 1.25, false, true, true));
      takeToTheSkies.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 20, 1.25, false, true, true));
      enemy.abilityList.push(takeToTheSkies);    
    }
    if (type === BestiaryEnum.AngryHarpy) {
      enemy.name = "Angry Harpy";
      enemy.battleStats = new CharacterStats(48125, 550, 2265, 775, 1650, 2250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 382;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;

      var ravage = new Ability();
      ravage.name = "Ravage";
      ravage.isAvailable = true;
      ravage.effectiveness = 1.7;
      ravage.cooldown = ravage.currentCooldown = 14;
      ravage = this.randomizeCooldown(ravage);
      ravage.dealsDirectDamage = true;
      ravage.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(ravage);

      var claw = new Ability();
      claw.name = "Claw";
      claw.isAvailable = true;
      claw.effectiveness = 3.8;
      claw.cooldown = claw.currentCooldown = 18;
      claw = this.randomizeCooldown(claw);
      claw.dealsDirectDamage = true;
      claw.elementalType = ElementalTypeEnum.Air;
      claw.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .2, claw.name, dotTypeEnum.BasedOnDamage, ElementalTypeEnum.Air));
      enemy.abilityList.push(claw);  
      
      var enrage = new Ability();
      enrage.name = "Enrage";
      enrage.isAvailable = true;
      enrage.cooldown = enrage.currentCooldown = (enemy.battleInfo.timeToAutoAttack - 1);
      enrage.dealsDirectDamage = false;
      enrage.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 8, 1.45, false, true));
      enemy.abilityList.push(enrage);
    }
    if (type === BestiaryEnum.Snapjaw) {
      enemy.name = "Snapjaw";
      enemy.battleStats = new CharacterStats(53674, 695, 2575, 815, 1600, 2300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 390;
      enemy.loot.push(new LootItem(ItemsEnum.Seashell, ItemTypeEnum.CraftingMaterial, 1, .06));

      var shellCover = new Ability();
      shellCover.name = "Shell Cover";
      shellCover.isAvailable = true;      
      shellCover.cooldown = shellCover.currentCooldown = 18;
      shellCover = this.randomizeCooldown(shellCover);
      shellCover.dealsDirectDamage = false;           
      shellCover.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 8, 1.5, false, true)); 
      shellCover.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 8, .5, false, true));      
      enemy.abilityList.push(shellCover);
      
      var bite = new Ability();
      bite.name = "Bite";
      bite.isAvailable = true;
      bite.effectiveness = 4.1;
      bite.dealsDirectDamage = true;
      bite.cooldown = bite.currentCooldown = 22;
      bite = this.randomizeCooldown(bite);
      bite.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 4, .1, bite.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(bite);
    }
    if (type === BestiaryEnum.HungryCormorant) {
      enemy.name = "Hungry Cormorant";
      enemy.battleStats = new CharacterStats(47693, 562, 2225, 875, 1750, 2250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 383;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.Sorrel, ItemTypeEnum.CraftingMaterial, 1, .03));

      var dive = new Ability();
      dive.name = "Dive";
      dive.isAvailable = true;
      dive.effectiveness = 3.9;
      dive.cooldown = dive.currentCooldown = 18;
      dive = this.randomizeCooldown(dive);
      dive.dealsDirectDamage = true;
      dive.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 1, false, true));      
      enemy.abilityList.push(dive);

      var foundDinner = new Ability();
      foundDinner.name = "Found Dinner";
      foundDinner.isAvailable = true;
      foundDinner.cooldown = foundDinner.currentCooldown = 28;
      foundDinner = this.randomizeCooldown(foundDinner);
      foundDinner.dealsDirectDamage = false;
      foundDinner.heals = true;
      foundDinner.effectiveness = 3.5;
      foundDinner.targetsAllies = true;
      foundDinner.targetType = TargetEnum.Self;
      foundDinner.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityUp, 22, 1.35, false, true, false));
      enemy.abilityList.push(foundDinner);
    }
    if (type === BestiaryEnum.AggressiveHusk) {
      enemy.name = "Aggressive Husk";
      enemy.battleStats = new CharacterStats(49234, 493, 2350, 900, 1680, 2250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 388;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
      
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.6;
      tackle.cooldown = tackle.currentCooldown = 15;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var armSwing = new Ability();
      armSwing.name = "Arm Swing";
      armSwing.isAvailable = true;
      armSwing.effectiveness = 4.1;
      armSwing.cooldown = armSwing.currentCooldown = 17;
      armSwing = this.randomizeCooldown(armSwing);
      armSwing.dealsDirectDamage = true;
      armSwing.damageModifierRange = .75;
      enemy.abilityList.push(armSwing);

      var aggressiveSwipe = new Ability();
      aggressiveSwipe.name = "Aggressive Swipe";
      aggressiveSwipe.isAvailable = true;
      aggressiveSwipe.effectiveness = 3.1;
      aggressiveSwipe.cooldown = aggressiveSwipe.currentCooldown = 16;
      aggressiveSwipe = this.randomizeCooldown(aggressiveSwipe);
      aggressiveSwipe.dealsDirectDamage = true;
      aggressiveSwipe.damageModifierRange = .25;
      aggressiveSwipe.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 7, 1.3, false, true)); 
      enemy.abilityList.push(aggressiveSwipe);
    }
    if (type === BestiaryEnum.MindlessHusk) {
      enemy.name = "Mindless Husk";
      enemy.battleStats = new CharacterStats(49712, 566, 2425, 850, 1600, 2300);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 388;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;              
                
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 4;
      tackle.cooldown = tackle.currentCooldown = 18;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var armSwing = new Ability();
      armSwing.name = "Arm Swing";
      armSwing.isAvailable = true;
      armSwing.effectiveness = 4.3;
      armSwing.cooldown = armSwing.currentCooldown = 23;
      armSwing = this.randomizeCooldown(armSwing);
      armSwing.dealsDirectDamage = true;
      armSwing.damageModifierRange = .75;
      enemy.abilityList.push(armSwing);

      var mindlessAttacks = new Ability();
      mindlessAttacks.name = "Mindless Attacks";
      mindlessAttacks.isAvailable = true;
      mindlessAttacks.effectiveness = 3.6;
      mindlessAttacks.cooldown = mindlessAttacks.currentCooldown = 20;
      mindlessAttacks = this.randomizeCooldown(mindlessAttacks);
      mindlessAttacks.dealsDirectDamage = true;
      mindlessAttacks.damageModifierRange = .75;
      mindlessAttacks.isAoe = true;
      enemy.abilityList.push(mindlessAttacks);
    }
    if (type === BestiaryEnum.WingedSerpent) {
      enemy.name = "Winged Serpent";
      enemy.battleStats = new CharacterStats(48512, 572, 2393, 850, 1650, 2450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 391;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheBlackSea, ItemTypeEnum.CraftingMaterial, 1, .03));

      var fang = new Ability();
      fang.name = "Fang";
      fang.isAvailable = true;
      fang.effectiveness = 4.2;
      fang.cooldown = fang.currentCooldown = 18;
      fang = this.randomizeCooldown(fang);
      fang.dealsDirectDamage = true;
      fang.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackDown, 6, .8, false, false));
      enemy.abilityList.push(fang);

      var fromAbove = new Ability();
      fromAbove.name = "From Above";
      fromAbove.isAvailable = true;
      fromAbove.effectiveness = 3.9;
      fromAbove.cooldown = fromAbove.currentCooldown = 21;
      fromAbove = this.randomizeCooldown(fromAbove);
      fromAbove.dealsDirectDamage = true;
      fromAbove.elementalType = ElementalTypeEnum.Air;      
      enemy.abilityList.push(fromAbove);

      var plunge = new Ability();
      plunge.name = "Plunge";
      plunge.isAvailable = true;
      plunge.cooldown = plunge.currentCooldown = 26;
      plunge = this.randomizeCooldown(plunge);
      plunge.dealsDirectDamage = false;
      plunge.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Untargetable, 6, 1, false, true));      
      enemy.abilityList.push(plunge);
    }
    if (type === BestiaryEnum.Stingray) {
      enemy.name = "Stingray";
      enemy.battleStats = new CharacterStats(49312, 570, 2630, 875, 1750, 2450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 390;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.VialOfTheBlackSea, ItemTypeEnum.CraftingMaterial, 1, .03));

      var stinger = new Ability();
      stinger.name = "Stinger";
      stinger.isAvailable = true;
      stinger.effectiveness = 4.4;
      stinger.cooldown = stinger.currentCooldown = 22;
      stinger = this.randomizeCooldown(stinger);
      stinger.dealsDirectDamage = true;
      stinger.targetEffect.push(this.globalService.createDamageOverTimeEffect(6, 2, .25, stinger.name, dotTypeEnum.BasedOnDamage));
      enemy.abilityList.push(stinger);

      var venom = new Ability();
      venom.name = "Slowing Venom";
      venom.isAvailable = true;
      venom.cooldown = venom.currentCooldown = 16;
      venom = this.randomizeCooldown(venom);
      venom.dealsDirectDamage = true;
      venom.effectiveness = 3.4;      
      venom.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Unsteady, 12, .5, false, false));
      enemy.abilityList.push(venom);      
    }
    if (type === BestiaryEnum.LesserKestrel) {
      enemy.name = "Lesser Kestrel";
      enemy.battleStats = new CharacterStats(51225, 503, 2760, 1000, 1650, 2450);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 393;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));
            
      var dive = new Ability();
      dive.name = "Dive";
      dive.isAvailable = true;
      dive.effectiveness = 3.9;
      dive.cooldown = dive.currentCooldown = 15;
      dive = this.randomizeCooldown(dive);
      dive.dealsDirectDamage = true;
      dive.elementalType = ElementalTypeEnum.Air;
      dive.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 1, false, true));      
      enemy.abilityList.push(dive);

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 3.8;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 19;
      slash = this.randomizeCooldown(slash);
      slash.elementalType = ElementalTypeEnum.Air;
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .7, false, false));
      enemy.abilityList.push(slash);
    }
    if (type === BestiaryEnum.YellowfootedFalcon) {
      enemy.name = "Yellow-Footed Falcon";
      enemy.battleStats = new CharacterStats(52034, 579, 2680, 940, 1625, 2500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 395;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .03));
            
      var dive = new Ability();
      dive.name = "Dive";
      dive.isAvailable = true;
      dive.effectiveness = 4.1;
      dive.cooldown = dive.currentCooldown = 18;
      dive = this.randomizeCooldown(dive);
      dive.dealsDirectDamage = true;
      dive.elementalType = ElementalTypeEnum.Air;
      dive.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 4, 1, false, true));      
      enemy.abilityList.push(dive);

      var slash = new Ability();
      slash.name = "Slash";
      slash.isAvailable = true;
      slash.effectiveness = 4;
      slash.dealsDirectDamage = true;
      slash.cooldown = slash.currentCooldown = 23;
      slash = this.randomizeCooldown(slash);
      slash.elementalType = ElementalTypeEnum.Air;
      slash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 10, .7, false, false));
      enemy.abilityList.push(slash);

      var roost = new Ability();
      roost.name = "Roost";
      roost.isAvailable = true;
      roost.cooldown = roost.currentCooldown = 28;
      roost = this.randomizeCooldown(roost);
      roost.dealsDirectDamage = false;
      roost.heals = true;
      roost.effectiveness = 3.5;
      roost.targetsAllies = true;
      roost.targetType = TargetEnum.Self;
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.25, false, true, false));
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.25, false, true, false));
      enemy.abilityList.push(roost);
    }
    if (type === BestiaryEnum.GreatShrike) {
      enemy.name = "Great Shrike";
      enemy.battleStats = new CharacterStats(53075, 615, 2875, 890, 1725, 2500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 398;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .03));
            
      var bombardment = new Ability();
      bombardment.name = "Bombardment";
      bombardment.isAvailable = true;
      bombardment.effectiveness = 4.9;
      bombardment.cooldown = bombardment.currentCooldown = 23;
      bombardment = this.randomizeCooldown(bombardment);
      bombardment.dealsDirectDamage = true;
      bombardment.isAoe = true;
      bombardment.elementalType = ElementalTypeEnum.Air;      
      enemy.abilityList.push(bombardment);

      var gouge = new Ability();
      gouge.name = "Gouge";
      gouge.isAvailable = true;
      gouge.cooldown = gouge.currentCooldown = 22;
      gouge = this.randomizeCooldown(gouge);
      gouge.dealsDirectDamage = true;      
      gouge.effectiveness = 4.5;      
      gouge.elementalType = ElementalTypeEnum.Air;
      gouge.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 8, .5, false, false));
      enemy.abilityList.push(gouge);
    }
    if (type === BestiaryEnum.CrimsonKestrel) {
      enemy.name = "Crimson Kestrel";
      enemy.battleStats = new CharacterStats(60000, 663, 3250, 950, 1750, 3250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 425;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.RoughOpalFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
            
      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 4.2;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 20;
      peck.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(peck);

      var skyHigh = new Ability();
      skyHigh.name = "Sky High";
      skyHigh.isAvailable = true;
      skyHigh.effectiveness = 3.5;
      skyHigh.dealsDirectDamage = true;
      skyHigh.cooldown = skyHigh.currentCooldown = 23;
      skyHigh = this.randomizeCooldown(skyHigh);
      skyHigh.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Untargetable, 6, 1, false, true));      
      skyHigh.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ClearDebuffs, -1, 1, true, true));      
      enemy.abilityList.push(skyHigh);

      var roost = new Ability();
      roost.name = "Roost";
      roost.isAvailable = true;
      roost.cooldown = roost.currentCooldown = 28;
      roost = this.randomizeCooldown(roost);
      roost.dealsDirectDamage = false;
      roost.heals = true;
      roost.effectiveness = 4.8;
      roost.targetsAllies = true;
      roost.targetType = TargetEnum.Self;
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 10, 1.3, false, true, false));
      roost.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 10, 1.3, false, true, false));
      enemy.abilityList.push(roost);
    }
    if (type === BestiaryEnum.TanKestrel) {
      enemy.name = "Tan Kestrel";
      enemy.battleStats = new CharacterStats(60000, 572, 3250, 1000, 1750, 3250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 425;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.RoughOpalFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
          
      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 4;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 16;
      peck.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(peck);

      var rake = new Ability();
      rake.name = "Rake";
      rake.isAvailable = true;
      rake.effectiveness = 3.9;
      rake.cooldown = rake.currentCooldown = 22;
      rake = this.randomizeCooldown(rake);
      rake.dealsDirectDamage = true;
      rake.isAoe = true;
      rake.elementalType = ElementalTypeEnum.Air;
      rake.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseDown, 13, .75, false, false, true));      
      rake.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 13, .75, false, false, true));      
      enemy.abilityList.push(rake);
                  
      var bombardment = new Ability();
      bombardment.name = "Bombardment";
      bombardment.isAvailable = true;
      bombardment.effectiveness = 4.9;
      bombardment.cooldown = bombardment.currentCooldown = 25;
      bombardment = this.randomizeCooldown(bombardment);
      bombardment.dealsDirectDamage = true;
      bombardment.isAoe = true;
      bombardment.elementalType = ElementalTypeEnum.Air;      
      enemy.abilityList.push(bombardment);
    }
    if (type === BestiaryEnum.GrayKestrel) {
      enemy.name = "Gray Kestrel";
      enemy.battleStats = new CharacterStats(60000, 482, 3250, 1125, 1600, 3250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 425;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.RoughOpalFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
            
      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 3.5;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 13;
      peck.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(peck);

      var talonCombo = new Ability();
      talonCombo.name = "Talon Combo";
      talonCombo.isAvailable = true;
      talonCombo.cooldown = talonCombo.currentCooldown = 19;
      talonCombo = this.randomizeCooldown(talonCombo);
      talonCombo.dealsDirectDamage = true;
      talonCombo.effectiveness = 3;
      talonCombo.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      talonCombo.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(talonCombo);      

      var sharpenTalons = new Ability();
      sharpenTalons.name = "Sharpen Talons";
      sharpenTalons.isAvailable = true;
      sharpenTalons.dealsDirectDamage = false;
      sharpenTalons.cooldown = sharpenTalons.currentCooldown = 23;
      sharpenTalons = this.randomizeCooldown(sharpenTalons);
      sharpenTalons.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AttackUp, 10, 1.35, false, true));
      sharpenTalons.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.LuckUp, 10, 1.35, false, true));
      enemy.abilityList.push(sharpenTalons);
    }
    if (type === BestiaryEnum.WhiteKestrel) {
      enemy.name = "White Kestrel";
      enemy.battleStats = new CharacterStats(60000, 568, 3250, 1025, 1850, 3250);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 425;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Air;
      enemy.loot.push(new LootItem(ItemsEnum.EagleFeather, ItemTypeEnum.CraftingMaterial, 1, .02));
      enemy.loot.push(new LootItem(ItemsEnum.RoughOpalFragment, ItemTypeEnum.CraftingMaterial, 1, .03));
      
      var peck = new Ability();
      peck.name = "Peck";
      peck.isAvailable = true;
      peck.effectiveness = 4.2;
      peck.dealsDirectDamage = true;
      peck.cooldown = peck.currentCooldown = 17;
      peck.elementalType = ElementalTypeEnum.Air;
      enemy.abilityList.push(peck);

      var gouge = new Ability();
      gouge.name = "Gouge";
      gouge.isAvailable = true;
      gouge.cooldown = gouge.currentCooldown = 22;
      gouge = this.randomizeCooldown(gouge);
      gouge.dealsDirectDamage = true;      
      gouge.effectiveness = 3.8;      
      gouge.elementalType = ElementalTypeEnum.Air;
      gouge.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Blind, 10, .5, false, false));
      enemy.abilityList.push(gouge);
      
      var windTunnel = new Ability();
      windTunnel.name = "Wind Tunnel";
      windTunnel.isAvailable = true;
      windTunnel.cooldown = windTunnel.currentCooldown = 21;
      windTunnel = this.randomizeCooldown(windTunnel);
      windTunnel.dealsDirectDamage = true;      
      windTunnel.effectiveness = 4.1;      
      windTunnel.elementalType = ElementalTypeEnum.Air;
      windTunnel.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stagger, 14, .75, false, false));
      enemy.abilityList.push(windTunnel);
    }
    if (type === BestiaryEnum.ManicHusk) {
      enemy.name = "Manic Husk";
      enemy.battleStats = new CharacterStats(54284, 501, 3000, 1250, 1550, 3000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 4.1;
      tackle.cooldown = tackle.currentCooldown = 16;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);
      
      var rushdown = new Ability();
      rushdown.name = "Rushdown";
      rushdown.isAvailable = true;
      rushdown.effectiveness = 2.7;
      rushdown.cooldown = rushdown.currentCooldown = 19;
      rushdown = this.randomizeCooldown(rushdown);
      rushdown.dealsDirectDamage = true;
      rushdown.damageModifierRange = .75;
      rushdown.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      rushdown.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      enemy.abilityList.push(rushdown);
    }
    if (type === BestiaryEnum.LumberingHusk) {
      enemy.name = "Lumbering Husk";
      enemy.battleStats = new CharacterStats(58302, 660, 3207, 1075, 1850, 3000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.7;
      tackle.cooldown = tackle.currentCooldown = 17;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var lumberingSwipe = new Ability();
      lumberingSwipe.name = "Lumbering Swipe";
      lumberingSwipe.isAvailable = true;
      lumberingSwipe.effectiveness = 3.6;
      lumberingSwipe.cooldown = lumberingSwipe.currentCooldown = 22;
      lumberingSwipe = this.randomizeCooldown(lumberingSwipe);
      lumberingSwipe.dealsDirectDamage = true;
      lumberingSwipe.isAoe = true;
      lumberingSwipe.damageModifierRange = .75;
      enemy.abilityList.push(lumberingSwipe);
    }
    if (type === BestiaryEnum.LargeHusk) {
      enemy.name = "Large Husk";
      enemy.battleStats = new CharacterStats(57256, 660, 3322, 1025, 1925, 2900);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyLongAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 4;
      tackle.cooldown = tackle.currentCooldown = 19;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var hunkerDown = new Ability();
      hunkerDown.name = "Hunker Down";
      hunkerDown.isAvailable = true;      
      hunkerDown.cooldown = hunkerDown.currentCooldown = 23;
      hunkerDown = this.randomizeCooldown(hunkerDown);
      hunkerDown.dealsDirectDamage = false;      
      hunkerDown.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 14, 1.3, false, true));      
      hunkerDown.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DamageTakenDown, 14, .7, false, true));            
      enemy.abilityList.push(hunkerDown);
    }
    if (type === BestiaryEnum.ShufflingHusk) {
      enemy.name = "Shuffling Husk";
      enemy.battleStats = new CharacterStats(54201, 501, 3070, 1200, 1500, 2900);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.5;
      tackle.cooldown = tackle.currentCooldown = 18;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var shuffle = new Ability();
      shuffle.name = "Shuffle";
      shuffle.isAvailable = true;      
      shuffle.cooldown = shuffle.currentCooldown = 20;
      shuffle = this.randomizeCooldown(shuffle);
      shuffle.dealsDirectDamage = false;      
      shuffle.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Dodge, 7, 1, false, true));            
      enemy.abilityList.push(shuffle);
    }
    if (type === BestiaryEnum.EarthenHusk) {
      enemy.name = "Earthen Husk";
      enemy.battleStats = new CharacterStats(57032, 569, 3200, 1100, 1675, 3000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementIncrease.earth += .25;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Earth;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 4.1;
      tackle.cooldown = tackle.currentCooldown = 21;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false)); 
      tackle.elementalType = ElementalTypeEnum.Earth;  
      enemy.abilityList.push(tackle);
              
      var rockPunch = new Ability();
      rockPunch.name = "Rock Punch";
      rockPunch.isAvailable = true;
      rockPunch.effectiveness = 4.4;
      rockPunch.cooldown = tackle.currentCooldown = 23;
      rockPunch = this.randomizeCooldown(rockPunch);
      rockPunch.dealsDirectDamage = true;  
      rockPunch.elementalType = ElementalTypeEnum.Earth;       
      rockPunch.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ReduceHealing, 12, .6, false, false, false));
      enemy.abilityList.push(rockPunch);
    }
    if (type === BestiaryEnum.EmptyHusk) {
      enemy.name = "Empty Husk";
      enemy.battleStats = new CharacterStats(56418, 564, 3185, 1100, 1675, 3000);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 4;
      enemy.xpGainFromDefeat = 400;
      enemy.battleStats.elementResistance.fire += .25;
      enemy.battleStats.elementResistance.lightning += .25;
      enemy.battleStats.elementResistance.air += .25;
      enemy.battleStats.elementResistance.water += .25;
      enemy.battleStats.elementResistance.earth += .25;
      enemy.battleStats.elementResistance.holy += .25;
            
      var tackle = new Ability();
      tackle.name = "Tackle";
      tackle.isAvailable = true;
      tackle.effectiveness = 3.9;
      tackle.cooldown = tackle.currentCooldown = 19;
      tackle = this.randomizeCooldown(tackle);
      tackle.dealsDirectDamage = true;   
      tackle.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Stun, 3, 0, false, false));   
      enemy.abilityList.push(tackle);

      var despair = new Ability();
      despair.name = "Despair";
      despair.isAvailable = true;
      despair.cooldown = tackle.currentCooldown = 21;
      despair = this.randomizeCooldown(despair);
      despair.dealsDirectDamage = false;   
      despair.targetEffect.push(this.globalService.createDamageOverTimeEffect(12, 3, .6, despair.name, dotTypeEnum.BasedOnAttack, undefined, true));
      enemy.abilityList.push(despair);
    }
    if (type === BestiaryEnum.Khalkotauroi) {
      enemy.name = "Khalkotauroi";
      enemy.battleStats = new CharacterStats(98759, 625, 6075, 1250, 2850, 6250);
      enemy.battleStats.elementResistance.water = this.utilityService.enemyMinorElementalWeakness;
      enemy.battleStats.elementResistance.fire += .5;
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.battleStats.elementIncrease.fire += .5;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Fire;
      enemy.coinGainFromDefeat = 5;
      enemy.xpGainFromDefeat = 1250;
      enemy.loot.push(new LootItem(ItemsEnum.MetalScraps, ItemTypeEnum.CraftingMaterial, 1, .05));
      enemy.loot.push(new LootItem(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, 2, .15));      
  
      var flameBreath = new Ability();
      flameBreath.name = "Flame Breath";
      flameBreath.isAvailable = true;
      flameBreath.cooldown = flameBreath.currentCooldown = 23;
      flameBreath = this.randomizeCooldown(flameBreath);
      flameBreath.dealsDirectDamage = true;
      flameBreath.effectiveness = 4.1;
      flameBreath.elementalType = ElementalTypeEnum.Fire;
      flameBreath.isAoe = true;
      flameBreath.targetEffect.push(this.globalService.createDamageOverTimeEffect(9, 3, .5, flameBreath.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire, true));
      enemy.abilityList.push(flameBreath);

      var flamingStomp = new Ability();
      flamingStomp.name = "Flaming Stomp";
      flamingStomp.isAvailable = true;
      flamingStomp.cooldown = flamingStomp.currentCooldown = 17;
      flamingStomp = this.randomizeCooldown(flamingStomp);
      flamingStomp.dealsDirectDamage = true;
      flamingStomp.effectiveness = 5.2;
      flamingStomp.elementalType = ElementalTypeEnum.Fire;
      flamingStomp.isAoe = true;      
      enemy.abilityList.push(flamingStomp);
  
      var snarl = new Ability();
      snarl.name = "Snarl";
      snarl.isAvailable = true;
      snarl.cooldown = snarl.currentCooldown = 15;      
      snarl.dealsDirectDamage = false;   
      snarl.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AoeDamageUp, -1, 1.1, false, true, false, enemy.name, undefined, true));   
      enemy.abilityList.push(snarl);

      var khalkotauroiFury = new Ability();
      khalkotauroiFury.name = "Khalkotauroi Fury";
      khalkotauroiFury.isAvailable = true;
      khalkotauroiFury.cooldown = khalkotauroiFury.currentCooldown = 9999;   
      khalkotauroiFury.dealsDirectDamage = false;   
      khalkotauroiFury.targetEffect.push(this.globalService.createDamageOverTimeEffect(20, 20, 8, khalkotauroiFury.name, dotTypeEnum.BasedOnAttack, ElementalTypeEnum.Fire));
      enemy.abilityList.push(khalkotauroiFury);

      var protection = new Ability();
      protection.name = "Aeëtes' Protection";
      protection.isAvailable = true;      
      protection.cooldown = protection.currentCooldown = 24;
      protection = this.randomizeCooldown(protection);
      protection.dealsDirectDamage = false;            
      protection.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceUp, 14, 1.75, false, true));      
      protection.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.DefenseUp, 14, 1.75, false, true));      
      enemy.abilityList.push(protection);
    }
    if (type === BestiaryEnum.MorayEel) {
      enemy.name = "Moray Eel";
      enemy.battleStats = new CharacterStats(58850, 591, 2750, 1133, 1700, 2500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyQuickAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 398;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));

      var electricShock = new Ability();
      electricShock.name = "Electric Shock";
      electricShock.isAvailable = true;
      electricShock.effectiveness = 4.6;
      electricShock.cooldown = electricShock.currentCooldown = 22;
      electricShock = this.randomizeCooldown(electricShock);
      electricShock.dealsDirectDamage = true;   
      electricShock.elementalType = ElementalTypeEnum.Lightning;
      electricShock.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Paralyze, 10, 0, false, false));   
      enemy.abilityList.push(electricShock);

      var nip = new Ability();
      nip.name = "Nip";
      nip.isAvailable = true;
      nip.effectiveness = 4.5;
      nip.dealsDirectDamage = true;
      nip.cooldown = nip.currentCooldown = 18;
      enemy.abilityList.push(nip);
    }
    if (type === BestiaryEnum.SnapperSwarm) {
      enemy.name = "Snapper Swarm";
      enemy.battleStats = new CharacterStats(59570, 574, 2732, 1350, 1800, 2500);
      enemy.battleInfo.timeToAutoAttack = this.utilityService.enemyAverageAutoAttackSpeed;
      enemy.coinGainFromDefeat = 3;
      enemy.xpGainFromDefeat = 400;
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.loot.push(new LootItem(ItemsEnum.ThickLeather, ItemTypeEnum.CraftingMaterial, 2, .125));
      
      var swarmAttack = new Ability();
      swarmAttack.name = "Swarm Attack";
      swarmAttack.isAvailable = true;
      swarmAttack.cooldown = swarmAttack.currentCooldown = 15;
      swarmAttack = this.randomizeCooldown(swarmAttack);
      swarmAttack.dealsDirectDamage = true;
      swarmAttack.effectiveness = 2.8;
      swarmAttack.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      swarmAttack.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.RepeatAbility, -1, 1, true, true));
      enemy.battleInfo.elementalType = ElementalTypeEnum.Water;
      enemy.abilityList.push(swarmAttack);      

      var splash = new Ability();
      splash.name = "Splash";
      splash.isAvailable = true;
      splash.cooldown = splash.currentCooldown = 12;
      splash = this.randomizeCooldown(splash);
      splash.dealsDirectDamage = false;
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.AgilityDown, 12, .7, false, false));
      splash.targetEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.ResistanceDown, 12, .7, false, false));
      enemy.abilityList.push(splash);

      var toughScales = new Ability();
      toughScales.name = "Tough Scales";
      toughScales.isAvailable = true;
      toughScales.cooldown = toughScales.currentCooldown = 20;
      toughScales = this.randomizeCooldown(toughScales);
      toughScales.dealsDirectDamage = false;
      toughScales.userEffect.push(this.globalService.createStatusEffect(StatusEffectEnum.Thorns, 12, 120, false, true));
      enemy.abilityList.push(toughScales);
    }

    //probably a better way to do this... these reductions are multiplicative but enemies don't get stats calc'd so otherwise
    //it gets multiplied by 0
    enemy.battleStats.abilityCooldownReduction = 1;
    enemy.battleStats.abilityCooldownReductionStart = 1;
    enemy.battleStats.abilityCooldownReductionWithBuffs = 1;
    enemy.battleStats.autoAttackCooldownReduction = 1;
    enemy.battleInfo.autoAttackModifier = this.utilityService.strongAutoAttack;
    enemy.battleInfo.autoAttackTimer = this.utilityService.getRandomInteger(0, enemy.battleInfo.timeToAutoAttack / 2);
    return enemy;
  }  

  randomizeCooldown(ability: Ability) {
    ability.currentCooldown = this.utilityService.getRandomInteger(Math.round(ability.cooldown / 2), ability.cooldown);
    return ability;
  }
}
