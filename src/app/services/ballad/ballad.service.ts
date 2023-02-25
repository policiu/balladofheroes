import { Injectable } from '@angular/core';
import { Battle } from 'src/app/models/battle/battle.model';
import { ColiseumTournament } from 'src/app/models/battle/coliseum-tournament.model';
import { BalladEnum } from 'src/app/models/enums/ballad-enum.model';
import { GameLogEntryEnum } from 'src/app/models/enums/game-log-entry-enum.model';
import { SceneTypeEnum } from 'src/app/models/enums/scene-type-enum.model';
import { SubZoneEnum } from 'src/app/models/enums/sub-zone-enum.model';
import { ZoneEnum } from 'src/app/models/enums/zone-enum.model';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { DpsCalculatorService } from '../battle/dps-calculator.service';
import { GameLogService } from '../battle/game-log.service';
import { GlobalService } from '../global/global.service';
import { SubZoneGeneratorService } from '../sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class BalladService {

  constructor(private globalService: GlobalService, private gameLogService: GameLogService, private dpsCalculatorService: DpsCalculatorService,
    private utilityService: UtilityService, private subzoneGeneratorService: SubZoneGeneratorService) { }

  getBalladName(type?: BalladEnum) {
    var name = "";

    if (type === BalladEnum.Champion)
      name = "Ballad of a Champion";
    if (type === BalladEnum.Gorgon)
      name = "Ballad of the Gorgon";
    if (type === BalladEnum.Labors)
      name = "Ballad of the Labors";
    if (type === BalladEnum.Underworld)
      name = "Ballad of the Underworld";      
    if (type === BalladEnum.Boar)
      name = "Ballad of the Boar";

    return name;
  }

  getActiveBallad() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    return activeBallad;
  }

  getActiveZone() {
    var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
    var zone = activeBallad?.zones.find(item => item.isSelected);
    return zone;
  }

  getActiveSubZone(search: boolean = false) {
    var subzone = new SubZone();

    if (this.globalService.globalVar.playerNavigation.currentSubzone === undefined || search) {
      var activeBallad = this.globalService.globalVar.ballads.find(item => item.isSelected);
      if (activeBallad !== undefined) {
        var zone = activeBallad.zones.find(item => item.isSelected);
        if (zone !== undefined) {
          if (zone.subzones.some(item => item.isSelected))
            subzone = zone.subzones.find(item => item.isSelected)!;
        }
      }
    }
    else {
      subzone = this.globalService.globalVar.playerNavigation.currentSubzone;
    }

    return subzone;
  }

  setActiveSubZone(type: SubZoneEnum) {
    var relatedZone: Zone | undefined = this.getActiveZone();
    var relatedBallad: Ballad | undefined = this.getActiveBallad();
    var relatedSubzone: SubZone = this.getActiveSubZone();;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
      ballad.zones.forEach(zone => {
        zone.isSelected = false;
        zone.subzones.forEach(subzone => {
          subzone.isSelected = false;

          if (subzone.type === type) {
            relatedZone = zone;
            relatedBallad = ballad;
            relatedSubzone = subzone;
          }
        })
      })
    });

    relatedSubzone.isSelected = true;
    relatedSubzone.showNewNotification = false;
    if (relatedZone !== undefined) {
      relatedZone.isSelected = true;
      relatedZone.showNewNotification = false;
    }
    if (relatedBallad !== undefined) {
      relatedBallad.isSelected = true;
      relatedBallad.showNewNotification = false;
    }
    this.globalService.globalVar.playerNavigation.currentSubzone = relatedSubzone;
    this.globalService.resetCooldowns(); 

    var gameLogEntry = "You move to <strong>" + relatedZone?.zoneName + " - " + relatedSubzone.name + "</strong>.";
    this.gameLogService.updateGameLog(GameLogEntryEnum.ChangeLocation, gameLogEntry);

    this.dpsCalculatorService.rollingAverageTimer = 0;
    this.dpsCalculatorService.partyDamagingActions = [];
    this.dpsCalculatorService.enemyDamagingActions = [];
    this.globalService.globalVar.activeBattle.battleDuration = 0;
    this.globalService.globalVar.activeBattle.activeTournament = new ColiseumTournament();

    if (!relatedSubzone.isTown) {
      var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(relatedSubzone.type);
      if (enemyOptions.length > 0) {
        var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
        this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
      }
    }
  }

  findBallad(type: BalladEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.type === type)
        returnBallad = ballad;
    });

    return returnBallad;
  }

  findZone(type: ZoneEnum) {
    var returnZone: Zone | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type === type)
          returnZone = zone;
      })
    });

    return returnZone;
  }

  findBalladOfSubzone(type: SubZoneEnum) {
    var returnBallad: Ballad | undefined;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        zone.subzones.forEach(subzone => {
          if (subzone.type === type)
            returnBallad = ballad;
        })
      })
    });

    return returnBallad;
  }

  findSubzone(type: SubZoneEnum) {
    var returnSubzone: SubZone | undefined;
    var subzoneFound = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (!subzoneFound) {
        ballad.zones.forEach(zone => {
          if (!subzoneFound) {
            zone.subzones.forEach(subzone => {
              if (subzone.type === type) {
                returnSubzone = subzone;
                subzoneFound = true;
              }
            });
          }
        });
      }
    });

    return returnSubzone;
  }

  isSubzoneInBallad(type: SubZoneEnum, balladType: BalladEnum) {
    var inBallad = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (balladType.toString() === ballad.type.toString()) {
        ballad.zones.forEach(zone => {
          zone.subzones.forEach(subzone => {
            if (subzone.type === type)
              inBallad = true;
          });
        });
      }
    });

    return inBallad;
  }

  isZoneInBallad(type: ZoneEnum, balladType: BalladEnum) {
    var inBallad = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      if (balladType.toString() === ballad.type.toString()) {
        ballad.zones.forEach(zone => {
          if (zone.type === type)
            inBallad = true;
        });
      }
    });

    return inBallad;
  }

  isSubzoneInZone(type: SubZoneEnum, zoneType: ZoneEnum) {
    var inZone = false;

    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.zones.forEach(zone => {
        if (zone.type.toString() === zoneType.toString()) {
          zone.subzones.forEach(subzone => {
            if (subzone.type === type)
              inZone = true;
          });
        }
      });
    });

    return inZone;
  }
}
