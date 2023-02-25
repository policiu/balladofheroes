import { Type } from "class-transformer";
import { Battle } from "../battle/battle.model";
import { Character } from "../character/character.model";
import { God } from "../character/god.model";
import { CharacterEnum } from "../enums/character-enum.model";
import { ItemsEnum } from "../enums/items-enum.model";
import { Alchemy } from "../professions/alchemy.model";
import { FreeTreasureChests } from "../resources/free-treasure-chests.model";
import { ResourceValue } from "../resources/resource-value.model";
import { ChthonicPowers } from "../utility/chthonic-powers.model";
import { LogData } from "../utility/log-data.model";
import { Settings } from "../utility/settings.model";
import { Ballad } from "../zone/ballad.model";
import { PlayerNavigation } from "../zone/player-navigation.model";
import { Zone } from "../zone/zone.model";
import { Achievement } from "./achievement.model";
import { Timers } from "./timers.model";
import { Guid } from 'guid-typescript';
import { EnemyDefeatCount } from "../battle/enemy-defeat-count.model";
import { AltarInfo } from "../altar/altar-info.model";
import { AltarEffect } from "../altar/altar-effect.model";
import { OptionalSceneEnum } from "../enums/optional-scene-enum.model";
import { ColiseumDefeatCount } from "../battle/coliseum-defeat-count.model";
import { Altars } from "../altar/altars.model";

export class GlobalVariables {
    lastTimeStamp: number;
    currentVersion: number;
    startingVersion: number;
    startDate: Date;    
    isGamePaused: boolean;
    isBattlePaused: boolean;
    @Type(() => Character)
    characters: Character[];
    @Type(() => God)
    gods: God[];
    @Type(() => Ballad)
    ballads: Ballad[];
    @Type(() => Timers)
    timers: Timers;
    @Type(() => ResourceValue)
    resources: ResourceValue[];
    activePartyMember1: CharacterEnum;
    activePartyMember2: CharacterEnum;
    @Type(() => Battle)
    activeBattle: Battle;
    @Type(() => Achievement)
    achievements: Achievement[];
    @Type(() => Settings)
    settings: Settings;
    @Type(() => PlayerNavigation)
    playerNavigation: PlayerNavigation;
    itemBeltSize: number;
    itemBelt: ItemsEnum[];
    currentStoryId: number;
    @Type(() => FreeTreasureChests)
    freeTreasureChests: FreeTreasureChests;
    extraSpeedTimeRemaining: number;
    isCatchingUp: boolean = false;
    @Type(() => ChthonicPowers)
    chthonicPowers: ChthonicPowers;
    @Type(() => Alchemy)
    alchemy: Alchemy;
    betaSave: boolean = false;
    @Type(() => Settings)
    gameLogSettings: Settings;
    @Type(() => Settings)
    keybinds: Settings;
    performanceMode = false;
    @Type(() => LogData)
    logData: LogData[];
    trackedResources: ItemsEnum[];    
    guid: string;
    @Type(() => EnemyDefeatCount)
    enemyDefeatCount: EnemyDefeatCount[];
    @Type(() => ColiseumDefeatCount)
    coliseumDefeatCount: ColiseumDefeatCount[];
    //@Type(() => AltarInfo)
    //altarInfo: AltarInfo[];
    @Type(() => Altars)
    altars: Altars;
    optionalScenesViewed: OptionalSceneEnum[];
    areBattleItemsUnlocked = false;
    isDpsUnlocked = false;
    altarOfAsclepus: Character; //better place to put this? sidequest data maybe?

    constructor() {
        this.lastTimeStamp = 0;
        this.characters = [];
        this.gods = [];
        this.ballads = [];
        this.resources = [];
        this.itemBelt = [];
        this.achievements = [];
        this.logData = [];
        this.trackedResources = [];
        this.enemyDefeatCount = [];
        this.coliseumDefeatCount = [];
        this.itemBeltSize = 1;
        //this.activeBattle = new Battle();
        this.playerNavigation = new PlayerNavigation();
        this.timers = new Timers();
        this.settings = new Settings();
        this.gameLogSettings = new Settings();
        this.freeTreasureChests = new FreeTreasureChests();
        this.currentStoryId = 0;
        this.extraSpeedTimeRemaining = 0;
        this.chthonicPowers = new ChthonicPowers();
        this.alchemy = new Alchemy();
        this.keybinds = new Settings();
        this.altars = new Altars();
        this.optionalScenesViewed = [];
        this.guid = Guid.create().toString();
        this.isGamePaused = false;
        this.isBattlePaused = false;
        this.altarOfAsclepus = new Character();
        this.altarOfAsclepus.battleStats.maxHp = 20000;
        this.altarOfAsclepus.battleStats.currentHp = 0;
    }
}
