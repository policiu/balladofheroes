import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { LookupService } from '../lookup.service';
import { environment } from 'src/environments/environment';
import { RedeemableCode } from 'src/app/models/utility/redeemable-code.model';
import { ResourceGeneratorService } from '../resources/resource-generator.service';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';

@Injectable({
  providedIn: 'root'
})
export class CodeCreationService {
  redeemableCode: RedeemableCode;

  constructor(private lookupService: LookupService, private resourceGeneratorService: ResourceGeneratorService) { }
  
  setupRewards() {
    this.redeemableCode = new RedeemableCode();
    this.redeemableCode.expirationDate = new Date('2023-06-01');            
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.Coin, 10000));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAquamarineFragment, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughRubyFragment, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughTopazFragment, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughAmethystFragment, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughEmeraldFragment, 50));
    this.redeemableCode.rewards.push(this.resourceGeneratorService.getResourceFromItemType(ItemsEnum.RoughOpalFragment, 50));
    
  }

  createCode() {
    this.setupRewards();
    var key = environment.CODEREDEMPTIONSECRET;
    var rewardString = JSON.stringify(this.redeemableCode);
    var encrypted = CryptoJS.AES.encrypt(rewardString, key);
    return encrypted.toString();
  }
}
