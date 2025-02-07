import { Injectable } from '@angular/core';
import { ProfessionActionsEnum } from 'src/app/models/enums/profession-actions-enum.model';
import { EquipmentQualityEnum } from 'src/app/models/enums/equipment-quality-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ProfessionEnum } from 'src/app/models/enums/professions-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ProfessionUpgrades } from 'src/app/models/professions/profession-upgrades.model';
import { Recipe } from 'src/app/models/professions/recipe.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { LookupService } from '../lookup.service';
import { UtilityService } from '../utility/utility.service';
import { DictionaryService } from '../utility/dictionary.service';
import { TutorialService } from '../global/tutorial.service';
import { TutorialTypeEnum } from 'src/app/models/enums/tutorial-type-enum.model';

@Injectable({
  providedIn: 'root'
})
export class AlchemyService {

  constructor(private globalService: GlobalService, private lookupService: LookupService, private gameLogService: GameLogService,
    private utilityService: UtilityService, private dictionaryService: DictionaryService, private tutorialService: TutorialService) { }

  

  handleShopOpen(subzone: SubZoneEnum) {
    if (subzone === SubZoneEnum.AsphodelPalaceOfHades) {
      var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);      
      if (alchemy !== undefined && !alchemy.isUnlocked) {
        alchemy.isUnlocked = true;
        alchemy.level = 1;
        alchemy.maxLevel += this.utilityService.firstAlchemyLevelCap;
        this.gameLogService.updateGameLog(GameLogEntryEnum.Tutorial, this.tutorialService.getTutorialText(TutorialTypeEnum.Alchemy));
      }
    }
  }

  getActionLength(action: ProfessionActionsEnum) {
    var duration = 0;

    if (action === ProfessionActionsEnum.PrepareWaterSmallPot)
      duration = 1 * 20;
    if (action === ProfessionActionsEnum.CombineIngredientsPot)
      duration = 1 * 10;
    if (action === ProfessionActionsEnum.CombineIngredientsPotion)
      duration = 1 * 15;
    if (action === ProfessionActionsEnum.HeatMixture)
      duration = 1 * 30;
    if (action === ProfessionActionsEnum.CrushIngredients)
      duration = 1 * 75;
    if (action === ProfessionActionsEnum.CombineIngredients)
      duration = 1 * 15;
    if (action === ProfessionActionsEnum.MixOil)
      duration = 1 * 10;
    if (action === ProfessionActionsEnum.MeltWax)
      duration = 1 * 20;
    if (action === ProfessionActionsEnum.StrainMixture)
      duration = 1 * 10;
    if (action === ProfessionActionsEnum.ExtractEssence)
      duration = 1 * 45;
    if (action === ProfessionActionsEnum.Infuse)
      duration = 1 * 60;
      if (action === ProfessionActionsEnum.StoreIngredients)
      duration = 1 * 5;

    return duration;
  }  

  checkForNewRecipes() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return;
    var newRecipeLearned = false;

    if (alchemy.level >= 1) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingPoultice)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingPoultice));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HealingPoultice);
      }
    }
    if (alchemy.level >= 2) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.ExplodingPotion)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.ExplodingPotion));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ExplodingPotion);
      }
    }
    if (alchemy.level >= 4) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.DebilitatingToxin)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.DebilitatingToxin));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.DebilitatingToxin);
      }
    }
    if (alchemy.level >= 7) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.HealingSalve)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.HealingSalve));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.HealingSalve);
      }
    }
    if (alchemy.level >= 10) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.FirePotion)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.FirePotion));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.FirePotion);
      }
    }
    if (alchemy.level >= 15) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.PoisonousToxin)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.PoisonousToxin));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.PoisonousToxin);
      }
    }
    if (alchemy.level >= 20) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.StranglingGasPotion)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.StranglingGasPotion));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.StranglingGasPotion);
      }
    }
    
    if (alchemy.level >= 22) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.SoulEssence)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.SoulEssence));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SoulEssence);
      }
    }
    if (alchemy.level >= 25) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.SatchelOfHerbs)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.SatchelOfHerbs));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.SatchelOfHerbs);
      }
    }
    if (alchemy.level >= 26) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.UnstablePotion)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.UnstablePotion));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.UnstablePotion);
      }
    }
    if (alchemy.level >= 27) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.ElixirOfFortitude)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.ElixirOfFortitude));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.ElixirOfFortitude);
      }
    }
    if (alchemy.level >= 29) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.WitheringToxin)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.WitheringToxin));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.WitheringToxin);
      }
    }
    if (alchemy.level >= 32) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.RestorativePoultice)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.RestorativePoultice));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RestorativePoultice);
      }
    }
    if (alchemy.level >= 35) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.BoomingPotion)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.BoomingPotion));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BoomingPotion);
      }
    }
    if (alchemy.level >= 40) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.VenomousToxin)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.VenomousToxin));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.VenomousToxin);
      }
    }
    if (alchemy.level >= 45) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.RestorativeSalve)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.RestorativeSalve));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.RestorativeSalve);
      }
    }
    if (alchemy.level >= 50) {
      if (!alchemy.availableRecipes.some(item => item.createdItem === ItemsEnum.BushelOfHerbs)) {
        alchemy.availableRecipes.push(this.getRecipe(ItemsEnum.BushelOfHerbs));
        newRecipeLearned = true;
        this.updateGameLogWithNewRecipe(ItemsEnum.BushelOfHerbs);
      }
    }

    return newRecipeLearned;
  }

  getLevelUpReward() {
    var alchemy = this.globalService.globalVar.professions.find(item => item.type === ProfessionEnum.Alchemy);
    if (alchemy === undefined)
      return;

    var upgrades: ProfessionUpgrades | undefined = undefined;
    var additionalChanceTo2x = .05;
    var additionalChanceTo5x = .025;
    var additionalChanceToRetainMaterials = .05;
    var additionalDurationReduction = .04;

    if (alchemy.level <= 25)
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Basic);
    else if (alchemy.level <= 50)
      upgrades = alchemy.upgrades.find(item => item.quality === EquipmentQualityEnum.Uncommon);


    if (upgrades === undefined)
      return;

    if (alchemy.level % 25 === 3 || alchemy.level % 25 === 6 ||
      alchemy.level % 25 === 11 || alchemy.level % 25 === 14 ||
      alchemy.level % 25 === 16 || alchemy.level % 25 === 23) {
      upgrades.chanceTo2xItem += additionalChanceTo2x;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo2x * 100) + "%</strong> chance to make 2x as many items when making a Basic quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
    }

    if (alchemy.level % 25 === 5 || alchemy.level % 25 === 8 ||
      alchemy.level % 25 === 13 || alchemy.level % 25 === 19 ||
      alchemy.level % 25 === 21) {
      upgrades.durationReduction += additionalDurationReduction;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "The time it takes to create a Basic quality Alchemy Recipe is reduced by <strong>" + (additionalDurationReduction * 100) + "%</strong>.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
    }

    if (alchemy.level % 25 === 9 || alchemy.level % 25 === 12 ||
      alchemy.level % 25 === 17 || alchemy.level % 25 === 22 ||
      alchemy.level % 25 === 24) {
      upgrades.chanceToRetainMaterials += additionalChanceToRetainMaterials;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceToRetainMaterials * 100) + "%</strong> chance to retain your ingredients when making a Basic quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
    }

    if (alchemy.level % 25 === 18 || alchemy.level % 25 === 0) {
      upgrades.chanceTo5xItem += additionalChanceTo5x;

      if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
        var gameLogEntry = "You gain an additional <strong>" + (additionalChanceTo5x * 100) + "%</strong> chance to make 5x as many items when making a Basic quality Alchemy recipe.";
        this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
      }
    }

  }

  updateGameLogWithNewRecipe(type: ItemsEnum) {
    if (this.globalService.globalVar.gameLogSettings.get("alchemyLevelUp")) {
      var gameLogEntry = "You learn how to make the Alchemy recipe: <strong>" + this.dictionaryService.getItemName(type) + "</strong>.";
      this.gameLogService.updateGameLog(GameLogEntryEnum.Alchemy, gameLogEntry);
    }
  }

  getRecipe(item: ItemsEnum) {
    var recipe = new Recipe();
    recipe.createdItem = item;
    recipe.createdItemType = this.lookupService.getItemTypeFromItemEnum(item);
    recipe.createdAmount = 1;

    if (item === ItemsEnum.HealingPoultice) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel , 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 5;
    }
    if (item === ItemsEnum.ExplodingPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark , 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 8;
    }

    if (item === ItemsEnum.DebilitatingToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus , 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.HealingSalve) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Olive , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.HealingHerb, 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Wax , 2));

      recipe.numberOfSteps = 4;
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 12;
    }

    if (item === ItemsEnum.FirePotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.EssenceOfFire , 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 14;
    }
    if (item === ItemsEnum.PoisonousToxin) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus , 3));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 15;
    }
    if (item === ItemsEnum.StranglingGasPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark , 3));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 15;
    }
    if (item === ItemsEnum.SatchelOfHerbs) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Fennel , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Asphodelus , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Violet , 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredients);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.SoulEssence) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulSpark , 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SpiritEssence , 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.PoisonExtractPotion) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.PoisonFang , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence , 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.ExtractEssence);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.HeroicElixir) {
      recipe.quality = EquipmentQualityEnum.Basic;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheLethe , 2));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs , 2));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }
    if (item === ItemsEnum.RejuvenatingElixir) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Violet , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot , 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);      
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }
    //lvl 26
    if (item === ItemsEnum.UnstablePotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 1));      
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot , 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 20;
    }
    //lvl 27
    if (item === ItemsEnum.ElixirOfFortitude) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot , 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);      
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 20;
    }
    //lvl 29
    if (item === ItemsEnum.WitheringToxin) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot , 2));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 23;
    }
    //lvl 32
    if (item === ItemsEnum.RestorativePoultice) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs , 2));      

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.PrepareWaterSmallPot);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 25;
    }
    //lvl 35
    if (item === ItemsEnum.BoomingPotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort , 2));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.HeatMixture);

      recipe.expGain = 25;
    }
    //lvl 40
    if (item === ItemsEnum.VenomousToxin) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SoulEssence , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort , 3));

      recipe.numberOfSteps = 1;
      recipe.steps.push(ProfessionActionsEnum.CrushIngredients);

      recipe.expGain = 25;
    }
    //lvl 45
    if (item === ItemsEnum.RestorativeSalve) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfTheBlackSea , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.SatchelOfHerbs , 1));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Sorrel , 1));

      recipe.numberOfSteps = 4;
      recipe.steps.push(ProfessionActionsEnum.MixOil);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);
      recipe.steps.push(ProfessionActionsEnum.MeltWax);
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPot);

      recipe.expGain = 28;
    }
    if (item === ItemsEnum.BushelOfHerbs) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Goldroot , 3));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Lousewort , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.Sorrel , 1));

      recipe.numberOfSteps = 2;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredients);
      recipe.steps.push(ProfessionActionsEnum.StoreIngredients);

      recipe.expGain = 8;
    }
    if (item === ItemsEnum.FocusPotion) {
      recipe.quality = EquipmentQualityEnum.Uncommon;
      recipe.ingredients.push(new ResourceValue(ItemsEnum.VialOfLakeLerna , 2));
      recipe.ingredients.push(new ResourceValue(ItemsEnum.BushelOfHerbs , 1));

      recipe.numberOfSteps = 3;
      recipe.steps.push(ProfessionActionsEnum.CombineIngredientsPotion);
      recipe.steps.push(ProfessionActionsEnum.Infuse);
      recipe.steps.push(ProfessionActionsEnum.StrainMixture);

      recipe.expGain = 18;
    }

    return recipe;
  }  
}
