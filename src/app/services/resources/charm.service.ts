import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character/character.model';
import { GodEnum } from 'src/app/models/enums/god-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';

@Injectable({
  providedIn: 'root'
})
export class CharmService {

  constructor() { }

  getTotalHpRegenAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfRejuvenationValue();
    var largeCharmValue = this.getLargeCharmOfRejuvenationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfRejuvenation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfRejuvenation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfRejuvenationValue() {
    return 1;
  }

  getLargeCharmOfRejuvenationValue() {
    return 3;
  }

  getTotalCriticalMultiplierAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfVulnerabilityValue();
    var largeCharmValue = this.getLargeCharmOfVulnerabilityValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfVulnerability);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfVulnerability);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfVulnerabilityValue() {
    return .05;
  }

  getLargeCharmOfVulnerabilityValue() {
    return .15;
  }

  getTotalOverdriveGainAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfDeterminationValue();
    var largeCharmValue = this.getLargeCharmOfDeterminationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfDetermination);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfDetermination);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfDeterminationValue() {
    return .02;
  }

  getLargeCharmOfDeterminationValue() {
    return .06;
  }

  getTotalArmorPenetrationAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfIngenuityValue();
    var largeCharmValue = this.getLargeCharmOfIngenuityValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfIngenuity);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfIngenuity);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfIngenuityValue() {
    return .01;
  }

  getLargeCharmOfIngenuityValue() {
    return .03;
  }

  getTotalAbilityCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfPreparationValue();
    var largeCharmValue = this.getLargeCharmOfPreparationValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfPreparation);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfPreparation);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfPreparationValue() {
    return .005;
  }

  getLargeCharmOfPreparationValue() {
    return .015;
  }

  getTotalAutoAttackCooldownReductionAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHasteValue();
    var largeCharmValue = this.getLargeCharmOfHasteValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHaste);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHaste);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHasteValue() {
    return .005;
  }

  getLargeCharmOfHasteValue() {
    return .015;
  }

  getSmallCharmOfElementalDestructionValue() {
    return .05;
  }

  getLargeCharmOfElementalDestructionValue() {
    return .15;
  }

  getSmallCharmOfElementalResistanceValue() {
    return .01;
  }

  getLargeCharmOfElementalResistanceValue() {
    return .03;
  }

  getTotalHolyDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHolyDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHolyDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalFireDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfFireDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfFireDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalLightningDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfLightningDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfLightningDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAirDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAirDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAirDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalWaterDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfWaterDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfWaterDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalEarthDamageIncreaseAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalDestructionValue();
    var largeCharmValue = this.getLargeCharmOfElementalDestructionValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfEarthDestruction);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfEarthDestruction);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalHolyDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHolyProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHolyProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalFireDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfFireProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfFireProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalLightningDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfLightningProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfLightningProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalAirDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAirProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAirProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalWaterDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfWaterProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfWaterProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalEarthDamageResistanceAdditionFromCharms(resources: ResourceValue[]) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfElementalResistanceValue();
    var largeCharmValue = this.getLargeCharmOfElementalResistanceValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfEarthProtection);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfEarthProtection);

    if (smallCharm !== undefined && smallCharm.amount > 0)
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0)
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getTotalHealingReceivedAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfAthenaValue();
    var largeCharmValue = this.getLargeCharmOfAthenaValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfAthena);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfAthena);

    if (smallCharm !== undefined && smallCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Athena || character.assignedGod2 === GodEnum.Athena))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Athena || character.assignedGod2 === GodEnum.Athena))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfAthenaValue() {
    return .025;
  }

  getLargeCharmOfAthenaValue() {
    return .075;
  }

  getTotalDebuffDurationAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfArtemisValue();
    var largeCharmValue = this.getLargeCharmOfArtemisValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfArtemis);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfArtemis);

    if (smallCharm !== undefined && smallCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Artemis || character.assignedGod2 === GodEnum.Artemis))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Artemis || character.assignedGod2 === GodEnum.Artemis))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfArtemisValue() {
    return .015;
  }

  getLargeCharmOfArtemisValue() {
    return .045;
  }

  getTotalOverdriveGainFromAutoAttacksAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfHermesValue();
    var largeCharmValue = this.getLargeCharmOfHermesValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfHermes);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfHermes);

    if (smallCharm !== undefined && smallCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Hermes || character.assignedGod2 === GodEnum.Hermes))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Hermes || character.assignedGod2 === GodEnum.Hermes))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfHermesValue() {
    return .05;
  }

  getLargeCharmOfHermesValue() {
    return .15;
  }

  getTotalHealingDoneAdditionFromCharms(resources: ResourceValue[], character: Character) {
    var amount = 0;
    var smallCharmValue = this.getSmallCharmOfApolloValue();
    var largeCharmValue = this.getLargeCharmOfApolloValue();

    var smallCharm = resources.find(item => item.item === ItemsEnum.SmallCharmOfApollo);
    var largeCharm = resources.find(item => item.item === ItemsEnum.LargeCharmOfApollo);

    if (smallCharm !== undefined && smallCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Apollo || character.assignedGod2 === GodEnum.Apollo))
      amount += smallCharmValue * smallCharm.amount;
    if (largeCharm !== undefined && largeCharm.amount > 0 && 
      (character.assignedGod1 === GodEnum.Apollo || character.assignedGod2 === GodEnum.Apollo))
      amount += largeCharmValue * largeCharm.amount;

    return amount;
  }

  getSmallCharmOfApolloValue() {
    return .025;
  }

  getLargeCharmOfApolloValue() {
    return .075;
  }
}
