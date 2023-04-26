import { OverlayRef } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EnemyTeam } from 'src/app/models/character/enemy-team.model';
import { Enemy } from 'src/app/models/character/enemy.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { DirectionEnum } from 'src/app/models/enums/direction-enum.model';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { LootItem } from 'src/app/models/resources/loot-item.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-bestiary-view',
  templateUrl: './bestiary-view.component.html',
  styleUrls: ['./bestiary-view.component.css']
})

export class BestiaryViewComponent {
  availableBallads: BalladEnum[] = [];
  availableZones: ZoneEnum[] = [];
  availableSubzones: SubZoneEnum[] = [];
  selectedBallad: Ballad;
  selectedZone: Zone | undefined;
  selectedSubzone: SubZone | undefined;
  isMobile: boolean = false;
  enemyList: Enemy[] = [];
  enemyEncounters: EnemyTeam[] = [];
  availableItems: LootItem[] = [];
  availableTreasure: ResourceValue[] = [];
  tooltipDirection = DirectionEnum.DownRight;
  overlayRef: OverlayRef;
  nameHiddenText = "????";

  constructor(private globalService: GlobalService, public balladService: BalladService, private deviceDetectorService: DeviceDetectorService,
    private subzoneGeneratorService: SubZoneGeneratorService, private utilityService: UtilityService, public lookupService: LookupService,
    private dictionaryService: DictionaryService) {

  }

  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.globalService.globalVar.ballads.filter(item => item.isAvailable).forEach(item => {
      this.availableBallads.push(item.type);
    });
  }

  selectBallad(type: BalladEnum) {
    var ballad = this.balladService.findBallad(type);
    if (ballad !== undefined) {
      this.selectedBallad = ballad;
      this.selectedZone = undefined;
      this.selectedSubzone = undefined;
      this.availableZones = [];
      this.availableSubzones = [];

      this.selectedBallad.zones.forEach(zone => {
        this.availableZones.push(zone.type);
      });
    }
  }

  selectZone(type: ZoneEnum) {
    var zone = this.balladService.findZone(type);
    if (zone !== undefined) {
      this.selectedZone = zone;
      this.selectedSubzone = undefined;
      this.availableSubzones = [];

      this.selectedZone.subzones.forEach(subzone => {
        this.availableSubzones.push(subzone.type);
      });
    }
  }

  selectSubzone(type: SubZoneEnum) {
    var subzone = this.balladService.findSubzone(type);
    if (subzone !== undefined) {
      this.selectedSubzone = subzone;

      this.enemyList = [];
      this.availableItems = [];
      this.availableTreasure = [];
      this.enemyEncounters = this.subzoneGeneratorService.generateBattleOptions(type, false);

      if (type !== SubZoneEnum.AigosthenaUpperCoast && type !== SubZoneEnum.AigosthenaLowerCoast && type !== SubZoneEnum.AigosthenaBay &&
        type !== SubZoneEnum.DodonaMountainOpening) {
        var rewards = this.subzoneGeneratorService.getTreasureChestRewards(type);
        if (rewards !== undefined && rewards.length > 0) {
          rewards.forEach(reward => {
            this.availableTreasure.push(reward);
          });
        }
      }

      if (this.enemyEncounters.length > 0) {
        this.enemyEncounters.forEach(encounter => {
          encounter.enemyList.forEach(enemy => {
            if (!this.enemyList.some(item => item.bestiaryType === enemy.bestiaryType)) {
              this.enemyList.push(enemy);

              enemy.loot.forEach(loot => {
                if (!this.availableItems.some(item => item.item === loot.item))
                  this.availableItems.push(loot);
              });
            }
          })
        });
      }
    }
  }

  isBalladSelected(type: BalladEnum) {
    if (this.selectedBallad === undefined)
      return false;

    return this.selectedBallad.type === type;
  }

  getBalladClass(ballad: BalladEnum) {
    if (this.selectedBallad === undefined)
      return {};

    return {
      'selectedBallad': ballad === this.selectedBallad.type
    };
  }

  isZoneSelected(type: ZoneEnum) {
    if (this.selectedZone === undefined)
      return false;

    return this.selectedZone?.type === type;
  }

  getZoneClass(zone: ZoneEnum) {
    if (this.selectedZone === undefined)
      return {};

    return {
      'selectedBallad': zone === this.selectedZone.type
    };
  }

  isSubzoneSelected(type: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return false;

    return this.selectedSubzone?.type === type;
  }

  getSubzoneClass(subzone: SubZoneEnum) {
    if (this.selectedSubzone === undefined)
      return {};

    return {
      'selectedBallad': subzone === this.selectedSubzone.type
    };
  }

  getZoneName(type: ZoneEnum) {
    return this.balladService.findZone(type)?.zoneName;
  }

  getSubzoneName(type: SubZoneEnum) {
    return this.balladService.getSubZoneName(type);
  }

  getEnemyName(enemy: Enemy) {
    var defeatCount = 0;
    var name = this.nameHiddenText;
    var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
    if (defeatCountStat !== undefined)
      defeatCount = defeatCountStat.count;

    if (defeatCount > 0)
      name = enemy.name;

    return name;
  }

  balladEnemyCount() {
    var totalEnemiesDefeated = 0;
    if (this.enemyList.length > 0) {
      this.enemyList.forEach(enemy => {
        var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
        if (defeatCountStat !== undefined && defeatCountStat.count > 0)
          totalEnemiesDefeated += 1;
      });
    }

    return totalEnemiesDefeated;
  }

  getEnemiesDefeated() {
    var totalEnemiesDefeated = 0;
    if (this.enemyList.length > 0) {
      this.enemyList.forEach(enemy => {
        var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
        if (defeatCountStat !== undefined && defeatCountStat.count > 0)
          totalEnemiesDefeated += 1;
      });
    }

    return totalEnemiesDefeated;
  }

  getSubzoneEncounterChance() {
    return this.utilityService.genericRound((1 / this.enemyEncounters.length) * 100);
  }

  getEnemyEncounter(encounter: EnemyTeam) {
    var encounterText = "";
    var enemyNotDefeated = false;
    var enemiesChecked: Enemy[] = [];
    var highestEnemyAmount = this.getLongestEnemyEncounter();

    encounter.enemyList.forEach(enemy => {
      var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
      if (defeatCountStat === undefined || defeatCountStat.count === 0)
        enemyNotDefeated = true;

      if (!enemiesChecked.some(item => item.bestiaryType === enemy.bestiaryType)) {
        var enemyCount = encounter.enemyList.filter(item => item.bestiaryType === enemy.bestiaryType).length;
        encounterText += enemy.name + (enemyCount > 1 ? (" x" + enemyCount) : "") + "<br/>";
        enemiesChecked.push(enemy);
      }
    });

    for (var i = enemiesChecked.length; i < highestEnemyAmount; i++) {
      encounterText += "<br/>";
    }

    if (enemyNotDefeated) {
      encounterText = this.nameHiddenText;
    }


    return encounterText;
  }

  getLongestEnemyEncounter() {
    var highestEnemyCount = 0;

    if (this.enemyEncounters !== undefined && this.enemyEncounters.length > 0) {
      this.enemyEncounters.forEach(encounter => {        
        var enemiesChecked: Enemy[] = [];

        encounter.enemyList.forEach(enemy => {
          if (!enemiesChecked.some(item => item.bestiaryType === enemy.bestiaryType)) {            
            enemiesChecked.push(enemy);
          }
        });

        if (enemiesChecked.length > highestEnemyCount)
          highestEnemyCount = enemiesChecked.length;
      })
    }

    return highestEnemyCount;
  }

  itemIsResource(item: ItemsEnum) {
    return this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.Resource;
  }

  itemIsEquipment(item: ItemsEnum) {
    return this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.Equipment;
  }

  totalItemsAvailable() {
    return this.availableItems.length + this.availableTreasure.length;
  }

  getItemName(item: ItemsEnum) {
    var itemFound = false;

    if (this.availableTreasure.some(treasure => treasure.item === item))
      itemFound = true;
    else
    {
    this.enemyList.forEach(enemy => {
      var defeatCountStat = this.globalService.globalVar.enemyDefeatCount.find(item => item.bestiaryEnum === enemy.bestiaryType);
      if (defeatCountStat !== undefined && defeatCountStat.count > 0)
      {
        enemy.loot.forEach(loot => {
          if (loot.item === item)
            itemFound = true;
        })
      }
    });
    }

    if (itemFound)
      return this.dictionaryService.getItemName(item);
    else
      return this.nameHiddenText;
  }

  getItemClass(item: ItemsEnum) {
    if (this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.Equipment) {

      var equipment = this.lookupService.getEquipmentPieceByItemType(item);
      if (equipment !== undefined) {
        var qualityClass = "bold " + this.lookupService.getEquipmentQualityClass(this.lookupService.getEquipmentPieceByItemType(equipment.itemType)?.quality);

        return qualityClass;
      }
    }
    else if (this.lookupService.getItemTypeFromItemEnum(item) === ItemTypeEnum.SlotItem) {
      return this.lookupService.getEquipmentQualityClass(this.lookupService.getSlotItemQuality(item));
    }

    return "";
  }

  getTreasureChestChance() {
    if (this.selectedSubzone === undefined)
      return "";

    return this.utilityService.genericRound(this.subzoneGeneratorService.generateTreasureChestChance(this.selectedSubzone.type) * 100) + "%";
  }

  overlayEmitter(overlayRef: OverlayRef) {
    if (this.overlayRef !== undefined) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    this.overlayRef = overlayRef;
  }

  ngOnDestroy() {
    if (this.overlayRef !== undefined) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }
}
