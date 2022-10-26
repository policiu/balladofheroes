import { Component, Input, OnInit } from '@angular/core';
import { Ballad } from 'src/app/models/zone/ballad.model';
import { SubZone } from 'src/app/models/zone/sub-zone.model';
import { Zone } from 'src/app/models/zone/zone.model';
import { BalladService } from 'src/app/services/ballad/ballad.service';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { SubZoneGeneratorService } from 'src/app/services/sub-zone-generator/sub-zone-generator.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-zone-navigation',
  templateUrl: './zone-navigation.component.html',
  styleUrls: ['./zone-navigation.component.css']
})
export class ZoneNavigationComponent implements OnInit {
  availableBallads: Ballad[];
  availableZones: Zone[];
  availableSubZones: SubZone[];
  subscription: any;

  constructor(private globalService: GlobalService, public balladService: BalladService, private subzoneGeneratorService: SubZoneGeneratorService,
    private utilityService: UtilityService, private gameLoopService: GameLoopService) { }

  ngOnInit(): void {
    this.availableBallads = this.globalService.globalVar.ballads;
    var selectedBallad = this.balladService.getActiveBallad();
    if (selectedBallad !== undefined)
      this.availableZones = selectedBallad.zones;
    var selectedZone = this.balladService.getActiveZone();
    if (selectedZone !== undefined)
      this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      var selectedBallad = this.balladService.getActiveBallad();
      if (selectedBallad !== undefined)
        this.availableZones = selectedBallad.zones;
      var selectedZone = this.balladService.getActiveZone();
      if (selectedZone !== undefined)
        this.availableSubZones = selectedZone.subzones.filter(item => item.isAvailable);
    });
  }

  selectBallad(ballad: Ballad) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      ballad.isSelected = false;
    });

    ballad.isSelected = true;
    this.availableZones = ballad.zones;
  }

  selectZone(zone: Zone) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          zone.isSelected = false;
        });
    });

    zone.isSelected = true;
    this.availableSubZones = zone.subzones;
  }

  selectSubZone(subzone: SubZone) {
    this.globalService.globalVar.ballads.forEach(ballad => {
      if (ballad.zones !== undefined && ballad.zones.length > 0)
        ballad.zones.forEach(zone => {
          if (zone.subzones !== undefined && zone.subzones.length > 0)
            zone.subzones.forEach(subzone => {
              subzone.isSelected = false;
            });
        });
    });

    subzone.isSelected = true;

    var enemyOptions = this.subzoneGeneratorService.generateBattleOptions(subzone.type);
    if (enemyOptions.length > 0) {
      var randomEnemyTeam = enemyOptions[this.utilityService.getRandomInteger(0, enemyOptions.length - 1)];
      this.globalService.globalVar.activeBattle.currentEnemies = randomEnemyTeam;
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
