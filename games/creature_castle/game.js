// game.js for Perlenspiel 3.1

/*
 Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
 Perlenspiel is Copyright Â© 2009-14 Worcester Polytechnic Institute.
 This file is part of Perlenspiel.

 Perlenspiel is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Perlenspiel is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Lesser General Public License for more details.

 You may have received a copy of the GNU Lesser General Public License
 along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
 */

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

//Goron City music taken from the Legend of Zelda series

function CreateBlockData (blockType, counter, health, nextBlockData) {
	var blockData = {blockType:blockType, counter:counter, health:health, nextBlockData:nextBlockData};
	return blockData;
};

var width = 15;
var height = 17;

var BLOCKS = {
    GROUND: 0,
	WALL: 1,
	CREATURE: 2,
	ENEMY1: 3,
	ENEMY2: 4,
	ENEMY3: 5,
	ENEMY4: 6,
	ENEMY5: 7,
	FOOD: 8,
	BUDDY: 9,
	WALL_UPGRADE: 10,
	SLUDGE: 11,
	CLICK_STRENGTH: 12,
	CLICK_SIZE: 13,
	NUKE: 14,
    PURCHASE: 15,
    INCOME: 16,
    YES: 17,
    NO: 18,
    TUTORIAL_ENEMY1: 19,
    TUTORIAL_ENEMY2: 20,
    WALL_UPGRADE2: 21,
    WALL_UPGRADE3: 22,
    WALL_UPGRADE4: 23
};

var DIRECTION = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3
}


var upgradeProperties = [{upgradeLevel: 0, upgradeFunction: null, upgrade1: 2000, upgrade2: 5000, upgrade3: 10000, upgrade4: 20000, upgrade5: 50000}];
upgradeProperties[BLOCKS.FOOD] = {upgradeLevel: 0, upgradeFunction: UpgradeFood, upgrade1: 50, upgrade2: 50, upgrade3: 50, upgrade4: 50, upgrade5: 50};
upgradeProperties[BLOCKS.BUDDY] = {upgradeLevel: 0, upgradeFunction: UpgradeBuddy, upgrade1: 1234, upgrade2: 5000, upgrade3: 10000, upgrade4: 20000, upgrade5: 200000};
upgradeProperties[BLOCKS.WALL_UPGRADE] = {upgradeLevel: 0, upgradeFunction: UpgradeWalls, upgrade1: 2000, upgrade2: 10000, upgrade3: 123456, upgrade4: 987654, upgrade5: 5151515};
upgradeProperties[BLOCKS.SLUDGE] = {upgradeLevel: 0, upgradeFunction: UpgradeSludge, upgrade1: 50000, upgrade2: 900000, upgrade3: null, upgrade4: null, upgrade5: null};
upgradeProperties[BLOCKS.CLICK_STRENGTH] = {upgradeLevel: 0, upgradeFunction: UpgradeDamage, upgrade1: 3000, upgrade2: 15000, upgrade3: 80000, upgrade4: 500000, upgrade5: 7500000};
upgradeProperties[BLOCKS.CLICK_SIZE] = {upgradeLevel: 0, upgradeFunction: UpgradeRadius, upgrade1: 10000, upgrade2: 500000, upgrade3: null, upgrade4: null, upgrade5: null};
upgradeProperties[BLOCKS.NUKE] = {upgradeLevel: 0, upgradeFunction: UpgradeNuke, upgrade1: 666, upgrade2: 10000, upgrade3: 100000, upgrade4: 666666, upgrade5: 20000000};
upgradeProperties[BLOCKS.INCOME] = {upgradeLevel: 0, upgradeFunction: UpgradeIncome, upgrade1: 5000, upgrade2: 50000, upgrade3: 500000, upgrade4: 5000000, upgrade5: 50000000};

var enemyProperties = [{health: 1, damage: 1, movementSpeed: 1, worth: 1}];
enemyProperties[BLOCKS.ENEMY1] = {health: 1, damage: 1, movementSpeed: 10, worth: 10};
enemyProperties[BLOCKS.ENEMY2] = {health: 4, damage: 5, movementSpeed: 8, worth: 50};
enemyProperties[BLOCKS.ENEMY3] = {health: 8, damage: 10, movementSpeed: 20, worth: 300};
enemyProperties[BLOCKS.ENEMY4] = {health: 16, damage: 20, movementSpeed: 1, worth: 2000};
enemyProperties[BLOCKS.ENEMY5] = {health: 400, damage: 300, movementSpeed: 2, worth: 25000};

//blockProperties {blockColor, glyphColor, glyphSymbol, blockFunction, soundEffects, name}
//NOTE ALL BLOCK FUNCTIONS SHOULD ACCEPT x,y AS INPUT, BUT NOTHING ELSE
var blockProperties =              [{blockColor:0xC2C2A3, glyphColor:0xC2C2A3, glyphSymbol:PS.DEFAULT, blockFunction: null, soundEffects: "fx_swoosh", name: ""}];
blockProperties[BLOCKS.GROUND] =     {blockColor:0xC2C2A3, glyphColor:0xC2C2A3, glyphSymbol:PS.DEFAULT, blockFunction: null, soundEffects: "fx_swoosh", name: ""}
blockProperties[BLOCKS.WALL] =       {blockColor:0x333333, glyphColor:0xC2C2C2, glyphSymbol:0x2752, blockFunction: null, soundEffects: "fx_click", name: "Castle Wall"};
blockProperties[BLOCKS.CREATURE] =   {blockColor:0x99FF99, glyphColor:0x2E4C2E, glyphSymbol:0x263A, blockFunction: MoveCreature, soundEffects: "fx_chirp1", name: "Creature"};
blockProperties[BLOCKS.ENEMY1] =     {blockColor:0x990000, glyphColor:0xFFFFFF, glyphSymbol:0x265F, blockFunction: MoveEnemy, soundEffects: "piano_g6", name: "Biter"};
blockProperties[BLOCKS.ENEMY2] =     {blockColor:0x3333D6, glyphColor:0x85D6FF, glyphSymbol:0x270A, blockFunction: MoveEnemy, soundEffects: "fx_drip2", name: "Kicker"};
blockProperties[BLOCKS.ENEMY3] =     {blockColor:0xFF6600, glyphColor:0xFFFFB2, glyphSymbol:0x2702, blockFunction: MoveEnemy, soundEffects: "fx_scratch", name: "Slasher"};
blockProperties[BLOCKS.ENEMY4] =     {blockColor:0xCCFFFF, glyphColor:0x0099CC, glyphSymbol:0x2694, blockFunction: MoveEnemy, soundEffects: "fx_drip1", name: "Smasher"};
blockProperties[BLOCKS.ENEMY5] =     {blockColor:0x99BB99, glyphColor:0x2E2F2E, glyphSymbol:0x263A, blockFunction: MoveEnemy, soundEffects: "fx_chirp1", name: "Exploder"};
blockProperties[BLOCKS.FOOD] =       {blockColor:0x99FF99, glyphColor:0x2E4C2E, glyphSymbol:0x047C, blockFunction: null, soundEffects: "fx_pop", name: "Feed Doug"};
blockProperties[BLOCKS.BUDDY] =      {blockColor:0x2E4C2E, glyphColor:0x99FF99, glyphSymbol:0x263A, blockFunction: null, soundEffects: "fx_chirp1", name: "Buddy+"};
blockProperties[BLOCKS.WALL_UPGRADE] =     {blockColor:0x333399, glyphColor:0xC2C2FF, glyphSymbol:0x274E, blockFunction: null, soundEffects: "fx_click", name: "Walls+"};
blockProperties[BLOCKS.WALL_UPGRADE2] =     {blockColor:0x222266, glyphColor:0xD2D2FF, glyphSymbol:0x2752, blockFunction: null, soundEffects: "fx_click", name: "Walls+"};
blockProperties[BLOCKS.WALL_UPGRADE3] =     {blockColor:0x111133, glyphColor:0xE2E2FF, glyphSymbol:0x2752, blockFunction: null, soundEffects: "fx_click", name: "Walls+"};
blockProperties[BLOCKS.WALL_UPGRADE4] =     {blockColor:0x000000, glyphColor:0xFFFFFF, glyphSymbol:0x2752, blockFunction: null, soundEffects: "fx_click", name: "Walls+"};
blockProperties[BLOCKS.SLUDGE] =       {blockColor:0x333314, glyphColor:0xFFFF00, glyphSymbol:0x26FD, blockFunction: null, soundEffects: "fx_zurp", name: "Slowing Sludge"};
blockProperties[BLOCKS.CLICK_STRENGTH] =    {blockColor:0xFFCCCC, glyphColor:0x800000, glyphSymbol:0x261B, blockFunction: null, soundEffects: "fx_hoot", name: "Damage+"};
blockProperties[BLOCKS.CLICK_SIZE] =   {blockColor:0x800000, glyphColor:0xFFCCCC, glyphSymbol:0x261E, blockFunction: null, soundEffects: "fx_drip1", name: "Damage Radius"};
blockProperties[BLOCKS.NUKE] =    {blockColor:0x800000, glyphColor:0xFFFF00, glyphSymbol:0x2622, blockFunction: null, soundEffects: "fx_squink", name: "Holy Nuke"};
blockProperties[BLOCKS.PURCHASE] =    {blockColor:0x2E4C2E, glyphColor:0x99FF99, glyphSymbol:0x0024, blockFunction: null, soundEffects: "fx_chirp1", name: "Purchase your selection"};
blockProperties[BLOCKS.INCOME] =      {blockColor:0x559955, glyphColor:0x99FF99, glyphSymbol:0x002B, blockFunction: null, soundEffects: "fx_chirp1", name: "Income+"};
blockProperties[BLOCKS.YES] =   {blockColor:0x99FF99, glyphColor:0x2E4C2E, glyphSymbol: 0x2714, blockFunction: null, soundEffects: "fx_chirp1", name: "Yes!"};
blockProperties[BLOCKS.NO] =  {blockColor:0x990000, glyphColor:0xFFFFFF, glyphSymbol:0x2716, blockFunction: null, soundEffects: "fx_chirp1", name: "No!"};
blockProperties[BLOCKS.TUTORIAL_ENEMY1] =     {blockColor:0x990000, glyphColor:0xFFFFFF, glyphSymbol:0x265F, blockFunction: null, soundEffects: "piano_g6", name: "Biter"};
blockProperties[BLOCKS.TUTORIAL_ENEMY2] =     {blockColor:0x3333D6, glyphColor:0x85D6FF, glyphSymbol:0x270A, blockFunction: null, soundEffects: "fx_drip2", name: "Kicker"};

var selectedx = 0;
var selected = 0;

//Keeps track of how many enemies on the screen
var enemies = 0;
var enemiesKilled = 0;
var wallsHit = false;
var level = 1;
var paused = false;
var starveTimer = 0;
var messageTimer = 0;
var creatureName = "Doug";

//Keeps score for the player (also used as money)
var score = 50;

//currently shown string
var currentString = "";

//Used for tutorial
var TutorialState = 0;

//Get bottom row height
var bottomRow = (height - 1);

//Some statically defined variables, occasionally may be altered by powerups.
//For the most part these can be considered static in functionality.
var MAX_ENEMIES = 15;
var CREATURE_HAPPINESS = 0;
var WALL_DEFENSE = 0;
var CREATURE_SPEED = 10;
var SLUDGE_FACTOR = 1;
var INCOME_FACTOR = 1;

//Player Damage Variables. Affects how much damage and how far the damage is done.
var PLAYER_DAMAGE = 1;
var PLAYER_DAMAGE_RADIUS = 0;

//The overarching gameloop for the game. Based on a timer.
function GameLoop() {

    if (!paused) {

        starveTimer++;
        messageTimer++;
        if (starveTimer >= 8) {
            UpdateScore(CREATURE_HAPPINESS * level * INCOME_FACTOR);
            if (CREATURE_HAPPINESS > 0) {
                CREATURE_HAPPINESS--;
                if (CREATURE_HAPPINESS >= 75 && (PS.random(100) >= 92)) {
                    GameUpdate("Doug loves you!")
                }
            }
            else {
                GameUpdate("Doug is unhappy!");
            }
            starveTimer = 0;
        }

        if (messageTimer >= 75) {
            DisplayMessage();
        }

        //First loop through the game and set the next placement of blocks
        //This essentially "builds" a second map
        for (var y = height - 3; y >= 0; y--) {
            for (var x = 0; x < width; x++) {

                var blockData = PS.data(x, y);

                //Set by default that the next block will be the current one. Can change.
                if ((PS.data(x, y).nextBlockData === null)) {
                    SetNextBlockData(x, y, CreateBlockData(blockData.blockType, blockData.counter, blockData.health, null));
                }
                //If a block has a function, call it
                if (blockProperties[blockData.blockType].blockFunction != null) {
                    blockProperties[blockData.blockType].blockFunction(x, y);
                }
            }
        }

        //Set all the blocks in the respective block data to what they should be.
        for (var y = height - 3; y >= 0; y--) {
            for (var x = 0; x < width; x++) {

                var updatedBlockData = PS.data(x, y);

                //Move the nextBlockData to the current block data
                PS.data(x, y, updatedBlockData.nextBlockData);

                PS.color(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].blockColor);
                PS.glyph(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].glyphSymbol);
                PS.glyphColor(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].glyphColor);
            }
        }

        SpawnEnemy();

        if (wallsHit) {
            wallsHit = false;
            PS.gridShadow(true, 0x7D1616);
        }
        else {
            PS.gridShadow(false, PS.COLOR_BLACK);
        }


        if (level === 6) {
            PS.statusText("You win!");
        }

    }


};

function DisplayMessage() {

    var randomMessage = PS.random(10);

    if (randomMessage <= 5) {
        GameUpdate("Level: " + level);
    }
    if (randomMessage === 6) {
        GameUpdate("Defend!");
    }
    if (randomMessage === 7) {
        GameUpdate("Doug wont judge");
    }
    if (randomMessage === 8) {
        GameUpdate("Upgrade!");
    }
    if (randomMessage === 9) {
        GameUpdate("Nuke to win");
    }
    if (randomMessage === 10) {
        GameUpdate("Enemies Killed: " + enemiesKilled);
    }

    messageTimer = 0;

}

function Upgrade() {

    upgradeProperties[selected].upgradeLevel++;

    DisplayCost();

    if (upgradeProperties[selected].upgradeFunction != null) {
        upgradeProperties[selected].upgradeFunction();
    }

}

function UpgradeFood() {

    if (CREATURE_HAPPINESS <= 100) {
        CREATURE_HAPPINESS += 10;
        if (CREATURE_HAPPINESS >= 100) {
            StatusUpdate("Doug is Satiated");
        }
        else {
            StatusUpdate(CREATURE_HAPPINESS + "% full");
        }
    }
    else {
        StatusUpdate("Doug is Satiated")
    }

    PS.audioPlay("perc_shaker", {volume: .2});
    upgradeProperties[BLOCKS.FOOD].upgradeLevel = 0;

}

function UpgradeSludge() {
    SLUDGE_FACTOR += 1;
    if (SLUDGE_FACTOR == 2) {
        blockProperties[BLOCKS.GROUND].blockColor = 0xA2A283;
    }
    if (SLUDGE_FACTOR == 3) {
        blockProperties[BLOCKS.GROUND].blockColor = 0x828263;
    }
    PS.audioPlay("fx_drip2", {volume: .2});
}



function UpgradeWalls() {
    WALL_DEFENSE += 1;
    if (WALL_DEFENSE == 1) {
        blockProperties[BLOCKS.WALL].blockColor = blockProperties[BLOCKS.WALL_UPGRADE].blockColor;
        blockProperties[BLOCKS.WALL].glyphColor = blockProperties[BLOCKS.WALL_UPGRADE].glyphColor;
    }

    if (WALL_DEFENSE == 2) {
        blockProperties[BLOCKS.WALL].blockColor = blockProperties[BLOCKS.WALL_UPGRADE2].blockColor;
        blockProperties[BLOCKS.WALL].glyphColor = blockProperties[BLOCKS.WALL_UPGRADE2].glyphColor;
    }

    if (WALL_DEFENSE == 3) {
        blockProperties[BLOCKS.WALL].blockColor = blockProperties[BLOCKS.WALL_UPGRADE3].blockColor;
        blockProperties[BLOCKS.WALL].glyphColor = blockProperties[BLOCKS.WALL_UPGRADE3].glyphColor;
    }

    if (WALL_DEFENSE == 4) {
        blockProperties[BLOCKS.WALL].blockColor = blockProperties[BLOCKS.WALL_UPGRADE4].blockColor;
        blockProperties[BLOCKS.WALL].glyphColor = blockProperties[BLOCKS.WALL_UPGRADE4].glyphColor;
    }
    if (WALL_DEFENSE == 5) {
        blockProperties[BLOCKS.WALL].glyphColor = 0xE6B800;
    }
    PS.audioPlay("perc_drum_tom4", {volume: .2});
}



function UpgradeNuke() {
    for (var y = height - 3; y >= 0; y--) {
        for (var x = 0; x < width; x++) {

            if ((PS.data(x, y).blockType === BLOCKS.ENEMY1 ||
                PS.data(x, y).blockType === BLOCKS.ENEMY2 ||
                PS.data(x, y).blockType === BLOCKS.ENEMY3 ||
                PS.data(x, y).blockType === BLOCKS.ENEMY4 ||
                PS.data(x, y).blockType === BLOCKS.ENEMY5 )) {
                PlaceBlock(x, y, BLOCKS.GROUND);
                enemiesKilled++;
            }

        }
    }
    enemies = 0;
    level++;
    PS.audioPlay("fx_blast3", {volume: .3});

    PS.gridFade(70, {rgb: 0xFFFFFF});
    PS.gridColor(PS.COLOR_BLACK);

    if (level === 6) {
        PlaceBlock(7, 9, BLOCKS.GROUND);
    }
}

function UpgradeIncome() {
    INCOME_FACTOR *= 2;
    PS.audioPlay("fx_ding", {volume: .1});
}

function UpgradeRadius() {
    PLAYER_DAMAGE_RADIUS += 1;
    PS.audioPlay("fx_jump8", {volume: .1});
}

function UpgradeDamage() {
    PLAYER_DAMAGE *= 2;
    PS.audioPlay("fx_powerup8", {volume: .1});
}

function UpgradeBuddy() {

    if (PS.data(7,7).blockType === BLOCKS.GROUND) {
        PlaceBlock(7, 7, BLOCKS.CREATURE);
    }
    else if (PS.data(6,6).blockType === BLOCKS.GROUND){
        PlaceBlock(6, 6, BLOCKS.CREATURE);
    }
    else if (PS.data(8,8).blockType === BLOCKS.GROUND){
        PlaceBlock(8, 8, BLOCKS.CREATURE);
    }
    else if (PS.data(6,8).blockType === BLOCKS.GROUND){
        PlaceBlock(6, 8, BLOCKS.CREATURE);
    }
    else {
        PlaceBlock(8, 6, BLOCKS.CREATURE);
    }

    CREATURE_HAPPINESS += 25;

    PS.audioPlay("fx_tweet", {volume: .2});

}

//Pets the creature. How cute.
function Pet() {

    PS.audioPlay("fx_chirp2", {volume: .1});
    UpdateScore(10*level^2*INCOME_FACTOR);

}

function PlaceBlock(x, y, blockValue) {

    PS.color(x, y, blockProperties[blockValue].blockColor);
    PS.glyph(x, y, blockProperties[blockValue].glyphSymbol);
    PS.glyphColor(x, y, blockProperties[blockValue].glyphColor);
    PS.data(x, y, CreateBlockData(blockValue, 0, 0, null));

}

function PlaceEnemy(x, y, blockValue, health) {

    PS.color(x, y, blockProperties[blockValue].blockColor);
    PS.glyph(x, y, blockProperties[blockValue].glyphSymbol);
    PS.glyphColor(x, y, blockProperties[blockValue].glyphColor);
    PS.data(x, y, CreateBlockData(blockValue, 0, health, null));

}

function SetNextBlockData(x, y, blockData) {

    PS.data(x,y).nextBlockData = blockData;

}

function IncrementCounter(x,y, amount) {

    if (amount) {
        PS.data(x, y).nextBlockData.counter = PS.data(x, y).counter + amount;
    }
    else {
        PS.data(x, y).nextBlockData.counter = PS.data(x, y).counter + 1;
    }
}

function GetEnemyDamage(enemy) {

    var baseDamage = -enemyProperties[enemy].damage;

    return (baseDamage - WALL_DEFENSE) * level;

}

//The AI for moving the creatures
function MoveEnemy(x,y) {

    IncrementCounter(x,y);

    if (CheckRadial(x, y, BLOCKS.WALL, 1)) {
        wallsHit = true;
        UpdateScore(GetEnemyDamage(PS.data(x,y).blockType));
    }

    if (PS.data(x, y).counter > (enemyProperties[PS.data(x,y).blockType].movementSpeed * ((SLUDGE_FACTOR + 2)/3))) {

        var direction = GetRandomTowardsCastleDirection(x,y);

        //RIGHT
        if (direction === DIRECTION.RIGHT && IsOnMap(x + 1, y)) {
            //Moves creature
            if (PS.data(x + 1, y).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x + 1, y) || PS.data(x + 1, y).nextBlockData.blockType === BLOCKS.GROUND)) {
                SetNextBlockData(x + 1, y, CreateBlockData(PS.data(x,y).blockType, 0, PS.data(x,y).health, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        //DOWN
        if (direction === DIRECTION.DOWN && IsOnMap(x, y + 1)) {
            //Moves creature
            if (PS.data(x, y + 1).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x, y + 1) || PS.data(x, y + 1).nextBlockData.blockType === BLOCKS.GROUND)) {
                SetNextBlockData(x, y + 1, CreateBlockData(PS.data(x,y).blockType, 0, PS.data(x,y).health, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        //LEFT
        if (direction === DIRECTION.LEFT && IsOnMap(x - 1, y)) {
            //Moves creature
            if (PS.data(x - 1, y).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x - 1, y) || PS.data(x - 1, y).nextBlockData.blockType === BLOCKS.GROUND)) {
                SetNextBlockData(x - 1, y, CreateBlockData(PS.data(x,y).blockType, 0, PS.data(x,y).health, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        //UP
        if (direction === DIRECTION.UP && IsOnMap(x, y - 1)) {
            //Moves creature
            if (PS.data(x, y - 1).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x, y - 1) || PS.data(x, y - 1).nextBlockData.blockType === BLOCKS.GROUND)) {
                SetNextBlockData(x, y - 1, CreateBlockData(PS.data(x,y).blockType, 0, PS.data(x,y).health, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
    }
}

function CheckRadial(x, y, blockType, radius) {
    for (i = (-radius);  i <= radius;  i++) {
        for (j = (-radius);  j <= radius; j++) {
            if (IsOnMap((x + i), (y + j)) && PS.data((x + i), (y + j)).blockType === blockType) {
                return true;
            }
        }
    }
    return false;
}

//Checks if coordinate is on map
function IsOnMap(x,y) {

    return (x < width && x >= 0 && y < height - 2 && y >= 0);

}

//Checks if nextBlockData has been assigned yet
function NextBlockDataIsNotNull(x,y) {

    return ((PS.data(x,y).nextBlockData != null) && (PS.data(x,y).nextBlockData.blockType != null))

}

//Damage dealing function. Called whenever the player clicks on the map.
//Damages everything that is not a creature, wall, or the ground.
function DealDamage(x,y) {

    for (var i = x - PLAYER_DAMAGE_RADIUS; i <= x + PLAYER_DAMAGE_RADIUS; i++) {
        for (var j = y - PLAYER_DAMAGE_RADIUS; j <= y + PLAYER_DAMAGE_RADIUS; j++) {
            if (IsOnMap(i,j)) {
                if (PS.data(i,j).blockType != BLOCKS.WALL && PS.data(i,j).blockType != BLOCKS.CREATURE) {
                    if (PS.data(i,j).blockType != BLOCKS.GROUND) {
                        DamageColorChange(i,j);
                        PS.data(i,j).health -= PLAYER_DAMAGE;
                        if (PS.data(i,j).health <= 0) {
                            PS.audioPlay("fx_bucket", {volume: .1});
                            UpdateScore(GetEnemyScore(PS.data(i,j).blockType));
                            PS.data(i, j, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
                            enemies--;
                            enemiesKilled++;
                        }
                    }
                }
            }
        }
    }

}

function DamageColorChange(x,y) {

    //var prevColor = PS.color(x, y, PS.CURRENT);
    var color = {rgb: 0x7D1616};
    //PS.fade(x, y, 10, color);
    PS.color(x, y, color.rgb);

}

function GetEnemyScore(enemy) {

    var baseScore = enemyProperties[enemy].worth;

    return (baseScore * level * INCOME_FACTOR);

}

function SpawnEnemy() {

    if (enemies < MAX_ENEMIES) {
        var weightedSpawnChance = (6 * level) - Math.log((enemies+2)^(3/2) * level);
        var spawnChance = PS.random(100);
        if (spawnChance < weightedSpawnChance) {
            var randx = PS.random(width) - 1;
            var randy = PS.random(height - 2) - 1;
            var randdir = PS.random(4) - 1;
            if (randdir === 0) {
                if (PS.data(0, randy).blockType === BLOCKS.GROUND) {
                    SpawnEnemyBasedOnLevel(0, randy);
                }
            }
            else if (randdir === 1) {
                if (PS.data(height - 3, randy).blockType === BLOCKS.GROUND) {
                    SpawnEnemyBasedOnLevel(height - 3, randy);
                }
            }
            else if (randdir === 2) {
                if (PS.data(randx, 0).blockType === BLOCKS.GROUND) {
                    SpawnEnemyBasedOnLevel(randx, 0);
                }
            }
            else {
                if (PS.data(randx, width - 1).blockType === BLOCKS.GROUND) {
                    SpawnEnemyBasedOnLevel(randx, width - 1);
                }
            }
        }
    }

}

function SpawnEnemyBasedOnLevel(x,y) {

    var spawnChance = PS.random(100);

    //LEVEL 1
    if (level === 1) {
        PlaceEnemy(x, y, BLOCKS.ENEMY1, enemyProperties[BLOCKS.ENEMY1].health);
    }
    //LEVEL 2
    else if (level === 2) {
        if (spawnChance < 80) {
            PlaceEnemy(x, y, BLOCKS.ENEMY1, enemyProperties[BLOCKS.ENEMY1].health);
        }
        else {
            PlaceEnemy(x, y, BLOCKS.ENEMY2, enemyProperties[BLOCKS.ENEMY2].health);
        }
    }
    //LEVEL 3
    else if (level === 3) {
        if (spawnChance < 40) {
            PlaceEnemy(x, y, BLOCKS.ENEMY1, enemyProperties[BLOCKS.ENEMY1].health);
        }
        else if (spawnChance < 80) {
            PlaceEnemy(x, y, BLOCKS.ENEMY2, enemyProperties[BLOCKS.ENEMY2].health);
        }
        else {
            PlaceEnemy(x, y, BLOCKS.ENEMY3, enemyProperties[BLOCKS.ENEMY3].health);
        }

    }
    //LEVEL 4
    else if (level === 4) {
        if (spawnChance < 20) {
            PlaceEnemy(x, y, BLOCKS.ENEMY1, enemyProperties[BLOCKS.ENEMY1].health);
        }
        else if (spawnChance < 50) {
            PlaceEnemy(x, y, BLOCKS.ENEMY2, enemyProperties[BLOCKS.ENEMY2].health);
        }
        else if (spawnChance < 90) {
            PlaceEnemy(x, y, BLOCKS.ENEMY3, enemyProperties[BLOCKS.ENEMY3].health);
        }
        else {
            PlaceEnemy(x, y, BLOCKS.ENEMY4, enemyProperties[BLOCKS.ENEMY4].health);
        }

    }
    //LEVEL 5
    else if (level === 5) {
        if (spawnChance < 5) {
            PlaceEnemy(x, y, BLOCKS.ENEMY1, enemyProperties[BLOCKS.ENEMY1].health);
        }
        else if (spawnChance < 20) {
            PlaceEnemy(x, y, BLOCKS.ENEMY2, enemyProperties[BLOCKS.ENEMY2].health);
        }
        else if (spawnChance < 80) {
            PlaceEnemy(x, y, BLOCKS.ENEMY3, enemyProperties[BLOCKS.ENEMY3].health);
        }
        else if (spawnChance < 95) {
            PlaceEnemy(x, y, BLOCKS.ENEMY4, enemyProperties[BLOCKS.ENEMY4].health);
        }
        else {
            PlaceEnemy(x, y, BLOCKS.ENEMY5, enemyProperties[BLOCKS.ENEMY5].health);
        }
    }

    enemies++;

}

//Function used for purchasing blocks.
function PurchaseBlock() {

    if (upgradeProperties[selected].upgradeLevel === 0) {
        if (upgradeProperties[selected].upgrade1 != null) {
            if (score >= upgradeProperties[selected].upgrade1) {
                score -= upgradeProperties[selected].upgrade1;
                Upgrade();
            }
            else {
                StatusUpdate("Not enough money!");
            }
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 1) {
        if (upgradeProperties[selected].upgrade2 != null) {
            if (score >= upgradeProperties[selected].upgrade2) {
                score -= upgradeProperties[selected].upgrade2;
                Upgrade();
            }
            else {
                StatusUpdate("Not enough money!");
            }
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 2) {
        if (upgradeProperties[selected].upgrade3 != null) {
            if (score >= upgradeProperties[selected].upgrade3) {
                score -= upgradeProperties[selected].upgrade3;
                Upgrade();
            }
            else {
                StatusUpdate("Not enough money!");
            }
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 3) {
        if (upgradeProperties[selected].upgrade4 != null) {
            if (score >= upgradeProperties[selected].upgrade4) {
                score -= upgradeProperties[selected].upgrade4;
                Upgrade();
            }
            else {
                StatusUpdate("Not enough money!");
            }
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 4) {
        if (upgradeProperties[selected].upgrade5 != null) {
            if (score >= upgradeProperties[selected].upgrade5) {
                score -= upgradeProperties[selected].upgrade5;
                Upgrade();
            }
            else {
                StatusUpdate("Not enough money!");
            }
        }
    }

}

//Displays the cost of whichever powerup is currently selected
function DisplayCost() {

    if (upgradeProperties[selected].upgradeLevel === 0) {
        if (upgradeProperties[selected].upgrade1 != null) {
            StatusUpdate(blockProperties[selected].name + " $" + upgradeProperties[selected].upgrade1);
        }
        else {
            StatusUpdate(blockProperties[selected].name + " MAX");
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 1) {
        if (upgradeProperties[selected].upgrade2 != null) {
            StatusUpdate(blockProperties[selected].name + " $" + upgradeProperties[selected].upgrade2);
        }
        else {
            StatusUpdate(blockProperties[selected].name + " MAX");
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 2) {
        if (upgradeProperties[selected].upgrade3 != null) {
            StatusUpdate(blockProperties[selected].name + " $" + upgradeProperties[selected].upgrade3);
        }
        else {
            StatusUpdate(blockProperties[selected].name + " MAX");
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 3) {
        if (upgradeProperties[selected].upgrade4 != null) {
            StatusUpdate(blockProperties[selected].name + " $" + upgradeProperties[selected].upgrade4);
        }
        else {
            StatusUpdate(blockProperties[selected].name + " MAX");
        }
    }
    else if (upgradeProperties[selected].upgradeLevel === 4) {
        if (upgradeProperties[selected].upgrade5 != null) {
            StatusUpdate(blockProperties[selected].name + " $" + upgradeProperties[selected].upgrade5);
        }
        else {
            StatusUpdate(blockProperties[selected].name + " MAX");
        }
    }
    else {
        StatusUpdate(blockProperties[selected].name + " MAX");
    }

}

//The AI for moving the creatures. Very dumb.
function MoveCreature(x,y) {

    var direction = (PS.random(4) - 1);

    IncrementCounter(x,y);

    if (PS.data(x, y).counter > (CREATURE_SPEED - CREATURE_HAPPINESS/10)) {

        if (direction === DIRECTION.RIGHT && IsOnMap(x + 1, y)) {
            //Moves creature
            if (PS.data(x + 1, y).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x + 1, y) || PS.data(x + 1, y).nextBlockData.blockType != BLOCKS.CREATURE)) {
                SetNextBlockData(x + 1, y, CreateBlockData(BLOCKS.CREATURE, 0, 0, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        if (direction === DIRECTION.DOWN && IsOnMap(x, y + 1)) {
            //Moves creature
            if (PS.data(x, y + 1).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x, y + 1) || PS.data(x, y + 1).nextBlockData.blockType != BLOCKS.CREATURE)) {
                SetNextBlockData(x, y + 1, CreateBlockData(BLOCKS.CREATURE, 0, 0, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        if (direction === DIRECTION.LEFT && IsOnMap(x - 1, y)) {
            //Moves creature
            if (PS.data(x - 1, y).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x - 1, y) || PS.data(x - 1, y).nextBlockData.blockType != BLOCKS.CREATURE)) {
                SetNextBlockData(x - 1, y, CreateBlockData(BLOCKS.CREATURE, 0, 0, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
        if (direction === DIRECTION.UP && IsOnMap(x, y - 1)) {
            //Moves creature
            if (PS.data(x, y - 1).blockType === BLOCKS.GROUND && (!NextBlockDataIsNotNull(x, y - 1) || PS.data(x, y - 1).nextBlockData.blockType != BLOCKS.CREATURE)) {
                SetNextBlockData(x, y - 1, CreateBlockData(BLOCKS.CREATURE, 0, 0, null));
                SetNextBlockData(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
            }
        }
    }
}

//Function used to get the direction towards the castle, depending on what
//quadrant the enemy is currently in. Adds a bit of randomosity to the movement.
function GetRandomTowardsCastleDirection(x,y) {

    var direction = 0;
    var rand = (PS.random(2) - 1);
    //Bottom left quadrant
    if (x <= 7 && y >= 7) {
        if (rand === 0) {
            direction = DIRECTION.RIGHT;
        }
        else {
            direction = DIRECTION.UP;
        }
    }
    //Bottom right quadrant
    else if (x >= 7 && y >= 7) {
        if (rand === 0) {
            direction = DIRECTION.LEFT;
        }
        else {
            direction = DIRECTION.UP;
        }
    }
    //Top right quadrant
    else if (x >= 7 && y <= 7) {
        if (rand === 0) {
            direction = DIRECTION.LEFT;
        }
        else {
            direction = DIRECTION.DOWN;
        }
    }
    //Top left quadrant
    else {
        if (rand === 0) {
            direction = DIRECTION.RIGHT;
        }
        else {
            direction = DIRECTION.DOWN;
        }
    }

    return direction;

}

//Function to update the status line. Includes the score always.
function StatusUpdate (input) {
    PS.statusText(input + " -- Money: $" + score);
    currentString = input;
}

function GameUpdate(input) {
    PS.statusText(input + " -- " +  CREATURE_HAPPINESS + "% Full $" + score);
    currentString = input;
}

//Updates the score with a given input value. Remembers the past string and places it back.
function UpdateScore(addedScore) {

    score += addedScore;
    if (score < 0) {
        score = 0;
    }
    GameUpdate(currentString);

}

function StartGame () {

    //Initialize grid size. Can be adjusted above
    PS.gridSize(width, height);

    //Set the background to be a nice black color
    PS.bgAlpha(PS.ALL, bottomRow, 255);
    PS.bgColor(PS.ALL, bottomRow, PS.COLOR_BLACK);
    PS.borderColor(PS.ALL, bottomRow, PS.COLOR_BLACK);

    //Sets background to default ground color
    PS.applyRect(0, 0, width, bottomRow - 1, PS.color, blockProperties[BLOCKS.GROUND].blockColor);
    PS.applyRect(0, 0, width, bottomRow - 1, PS.borderColor, 0x888872);
    PS.applyRect(0, 0, width, bottomRow - 1, PS.border, 0);

    //Sets selectable area to be default black
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.color, 0x000000);
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.borderColor, 0x888872);
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.border, 0);

    //Initialize all blocks as ground blocks
    for (var y = height - 1; y >= 0; y--) {
        for (var x = 0; x < width; x++) {
            PS.data(x, y, CreateBlockData(BLOCKS.GROUND, 0, 0, null));
        }
    }

    //Bottom row of beads are selectable circles
    PS.radius(PS.ALL, bottomRow, 50);
    PS.scale(PS.ALL, bottomRow, 90);

    //Color the backdrop to be black (shouldn't be seen)
    PS.gridColor(PS.COLOR_BLACK);

    // Defines the food upgrade selection bead
    PlaceBlock(1, bottomRow, BLOCKS.FOOD);

    // Defines the income upgrade selection bead
    PlaceBlock(2, bottomRow, BLOCKS.INCOME);

    // Defines the buddy upgrade selection bead
    PlaceBlock(3, bottomRow, BLOCKS.BUDDY);

    // Defines the castle wall upgrade selection bead
    PlaceBlock(5, bottomRow, BLOCKS.WALL_UPGRADE);

    // Defines the sludge upgrade selection bead
    PlaceBlock(6, bottomRow, BLOCKS.SLUDGE);

    // Defines the stronger click upgrade selection bead
    PlaceBlock(8, bottomRow, BLOCKS.CLICK_STRENGTH);

    // Defines the bigger click upgrade selection bead
    PlaceBlock(9, bottomRow, BLOCKS.CLICK_SIZE);

    // Defines the nuke selection bead
    PlaceBlock(11, bottomRow, BLOCKS.NUKE);

    // Defines the purchase selection bead
    PlaceBlock(13, bottomRow, BLOCKS.PURCHASE);

    //The global timer. Should always be running, no need to stop it.
    PS.timerStart (5, GameLoop);

    PS.statusColor(PS.COLOR_WHITE);
    StatusUpdate("");

    // Creates the initial map
    PlaceBlock(5, 5, BLOCKS.WALL);
    PlaceBlock(6, 5, BLOCKS.WALL);
    PlaceBlock(7, 5, BLOCKS.WALL);
    PlaceBlock(8, 5, BLOCKS.WALL);
    PlaceBlock(9, 5, BLOCKS.WALL);
    PlaceBlock(9, 6, BLOCKS.WALL);
    PlaceBlock(9, 7, BLOCKS.WALL);
    PlaceBlock(9, 8, BLOCKS.WALL);
    PlaceBlock(9, 9, BLOCKS.WALL);
    PlaceBlock(8, 9, BLOCKS.WALL);
    PlaceBlock(7, 9, BLOCKS.WALL);
    PlaceBlock(6, 9, BLOCKS.WALL);
    PlaceBlock(5, 9, BLOCKS.WALL);
    PlaceBlock(5, 8, BLOCKS.WALL);
    PlaceBlock(5, 7, BLOCKS.WALL);
    PlaceBlock(5, 6, BLOCKS.WALL);
    PlaceBlock(7, 7, BLOCKS.CREATURE);

}


function StartTutorial () {

    //Initialize grid size. Can be adjusted above
    PS.gridSize(width, height);

    //Set the background to be a nice black color
    PS.bgAlpha(PS.ALL, bottomRow, 255);
    PS.bgColor(PS.ALL, bottomRow, PS.COLOR_BLACK);
    PS.borderColor(PS.ALL, bottomRow, PS.COLOR_BLACK);

    //Sets background to default ground color
    PS.applyRect(0, 0, width, bottomRow - 1, PS.color, blockProperties[BLOCKS.GROUND].blockColor);
    PS.applyRect(0, 0, width, bottomRow - 1, PS.borderColor, 0x888872);
    PS.applyRect(0, 0, width, bottomRow - 1, PS.border, 0);

    //Sets selectable area to be default black
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.color, 0x000000);
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.borderColor, 0x888872);
    PS.applyRect(0, bottomRow - 1, width, bottomRow, PS.border, 0);

    //Initialize all blocks as ground blocks
    for (var y = height - 1; y >= 0; y--) {
        for (var x = 0; x < width; x++) {
            PS.data(x, y, CreateBlockData(BLOCKS.GROUND, 0, null));
        }
    }

    //Bottom row of beads are selectable circles
    PS.radius(PS.ALL, bottomRow, 50);
    PS.scale(PS.ALL, bottomRow, 90);

    //Color the backdrop to be black (shouldn't be seen)
    PS.gridColor(PS.COLOR_BLACK);

    PS.statusColor(PS.COLOR_WHITE);
    PS.statusText("Welcome!  Click to continue.");

    // Creates the initial map
    PlaceBlock(5, 5, BLOCKS.WALL);
    PlaceBlock(6, 5, BLOCKS.WALL);
    PlaceBlock(7, 5, BLOCKS.WALL);
    PlaceBlock(8, 5, BLOCKS.WALL);
    PlaceBlock(9, 5, BLOCKS.WALL);
    PlaceBlock(9, 6, BLOCKS.WALL);
    PlaceBlock(9, 7, BLOCKS.WALL);
    PlaceBlock(9, 8, BLOCKS.WALL);
    PlaceBlock(9, 9, BLOCKS.WALL);
    PlaceBlock(8, 9, BLOCKS.WALL);
    PlaceBlock(7, 9, BLOCKS.WALL);
    PlaceBlock(6, 9, BLOCKS.WALL);
    PlaceBlock(5, 9, BLOCKS.WALL);
    PlaceBlock(5, 8, BLOCKS.WALL);
    PlaceBlock(5, 7, BLOCKS.WALL);
    PlaceBlock(5, 6, BLOCKS.WALL);

    TutorialState = 1;
}

// Required functions are found below. They call and use the other functions found above.

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function (system, options) {
    "use strict";

    //Initialize grid size. Can be adjusted above
    PS.gridSize(2, 1);

    //Color the backdrop to be black (shouldn't be seen)
    PS.gridColor(PS.COLOR_BLACK);

    PlaceBlock (0,0, BLOCKS.YES);
    PlaceBlock (1,0, BLOCKS.NO);

    PS.statusColor(PS.COLOR_WHITE);
    PS.statusText("Welcome!  Is this your first time playing?");

    var opt = {};
    opt.loop = true;
    opt.lock = true;
    opt.volume = .05;
    opt.path = "./";
    PS.audioPlay("Goron_City", opt);

}

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
    "use strict";

    //Starts tutorial
    if (PS.data(x, y).blockType === BLOCKS.YES) {
        StartTutorial();
    }


    //Skips tutorial
    if (PS.data(x, y).blockType === BLOCKS.NO) {
        StartGame();
    }

    if (TutorialState != 0) {
        Tutorial(x,y);
    }
    else {
        //If you are selecting something on the bottom row
        if (y >= (height - 2)) {

            PS.audioPlay("fx_click", {volume: .2});
            PS.gridShadow(true, PS.COLOR_GREEN);

            paused = true;

            if (PS.data(x, y).blockType === BLOCKS.PURCHASE) {
                if (selectedx != BLOCKS.GROUND) {
                    PurchaseBlock();
                }
                else {
                    StatusUpdate("No upgrade selected!");
                    PS.audioPlay("fx_uhoh", {volume: .1});
                }
            }

            else if (PS.data(x, y).blockType != BLOCKS.GROUND) {
                PS.borderColor(selectedx, y, PS.COLOR_BLACK);
                PS.border(selectedx, y, 1);
                selectedx = x;
                selected = PS.data(x, y).blockType;
                PS.border(selectedx, y, 4);
                PS.borderColor(selectedx, y, 0xFFFF00);
                DisplayCost();
            }

            else {
                StatusUpdate("Paused!");
            }

        }
        //Else you are killing an enemy block
        else {

            if (paused === true) {

                PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
                PS.border(selectedx, bottomRow, 1);
                selectedx = 0;
                selected = BLOCKS.GROUND;
                paused = false;
                PS.gridShadow(false, PS.COLOR_WHITE);
                DisplayMessage();

            }

            if (PS.data(x, y).blockType === BLOCKS.CREATURE) {
                Pet();
            }
            else {
                DealDamage(x, y);
            }
        }
    }

}

//Tutorial for the game. Placed at the end since it is dumbly long.
function Tutorial(x,y) {
    switch (TutorialState) {

        case 1:
            TutorialState++;
            break;

        case 2:
            PS.statusText("This is your creature. His name is " + creatureName + ".");
            PlaceBlock(7, 7, BLOCKS.CREATURE);

            TutorialState++;
            break;

        case 3:
            PS.statusText("Tap him to pet him. That makes money!");
            TutorialState++;
            break;

        case 4:
            PS.statusText("This is a monster. It wants your points!");
            PlaceBlock(7, 10, BLOCKS.TUTORIAL_ENEMY1);
            TutorialState++;
            break;

        case 5:
            PS.statusText("Click the monster to kill it.");
            if (PS.data(x, y).blockType == BLOCKS.TUTORIAL_ENEMY1) {
                TutorialState++;
                PS.audioPlay("fx_bucket", {volume: .1});
                PS.statusText("Nice!");
                PlaceBlock(7, 10, BLOCKS.GROUND);
            }
            break;

        case 6:
            PS.statusText("Stronger enemies have more health.");
            PlaceBlock(10, 7, BLOCKS.TUTORIAL_ENEMY2);
            if (PS.data(x, y).blockType == BLOCKS.TUTORIAL_ENEMY2) {
                TutorialState++;
                PS.audioPlay("fx_bucket", {volume: .1});
            }
            break;

        case 7:
            if (PS.data(x, y).blockType == BLOCKS.TUTORIAL_ENEMY2) {
                TutorialState++;
                PS.statusText("Got him!");
                PlaceBlock(10, 7, BLOCKS.GROUND);
                PS.audioPlay("fx_bucket", {volume: .1});
            }
            break;

        case 8:
            PS.statusText("Purchase items and upgrades in the store.");
            //Bottom row of beads are selectable circles
            PS.radius(PS.ALL, bottomRow, 50);
            PS.scale(PS.ALL, bottomRow, 90);

            //Color the backdrop to be black (shouldn't be seen)
            PS.gridColor(PS.COLOR_BLACK);

            TutorialState++;
            break;

        case 9:
            PS.statusText("The game pauses when you click the menu.");
            TutorialState++;
            break;

        case 10:
            // Defines the food upgrade selection bead
            PlaceBlock(1, bottomRow, BLOCKS.FOOD);
            PS.statusText("Food makes your creatures produce points.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 1;
            selected = PS.data(1, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 11:
            PS.statusText("If your creature is unhappy, feed it!");
            TutorialState++;
            break;

        case 12:
            PlaceBlock(2, bottomRow, BLOCKS.INCOME);
            PS.statusText("Income increases your wealth in many ways.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 2;
            selected = PS.data(2, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 13:
            // Defines the buddy upgrade selection bead
            PlaceBlock(3, bottomRow, BLOCKS.BUDDY);
            PS.statusText("Buddy gives you another creature.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 3;
            selected = PS.data(3, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 14:
            // Defines the castle wall upgrade selection bead
            PlaceBlock(5, bottomRow, BLOCKS.WALL_UPGRADE);
            PS.statusText("Walls make monsters steal fewer points.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 5;
            selected = PS.data(5, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 15:
            // Defines the sludge upgrade selection bead
            PlaceBlock(6, bottomRow, BLOCKS.SLUDGE);
            PS.statusText("Sludge slows monsters down.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 6;
            selected = PS.data(6, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 16:
            // Defines the stronger click upgrade selection bead
            PlaceBlock(8, bottomRow, BLOCKS.CLICK_STRENGTH);
            PS.statusText("Damage makes your clicks stronger.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 8;
            selected = PS.data(8, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 17:
            // Defines the bigger click upgrade selection bead
            PlaceBlock(9, bottomRow, BLOCKS.CLICK_SIZE);
            PS.statusText("Radius makes your clicks bigger.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 9;
            selected = PS.data(9, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 18:
            // Defines the nuke selection bead
            PlaceBlock(11, bottomRow, BLOCKS.NUKE);
            PS.statusText("Nukes destroy all monsters.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 11;
            selected = PS.data(11, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 19:
            PS.statusText("Once nuked, harder enemies start coming!");
            PlaceBlock(4, 7, BLOCKS.ENEMY3);
            PlaceBlock(3, 4, BLOCKS.ENEMY3);
            PlaceBlock(9, 2, BLOCKS.ENEMY3);
            TutorialState++;
            break;

        case 20:
            PS.statusText("Keep nuking to win the game!");
            TutorialState++;
            break;

        case 21:
            PS.statusText("After choosing an upgrade...");
            TutorialState++;
            break;

        case 22:
            // Defines the purchase selection bead
            PlaceBlock(13, bottomRow, BLOCKS.PURCHASE);
            PS.statusText("Click Purchase to purchase it.");
            PS.borderColor(selectedx, bottomRow, PS.COLOR_BLACK);
            PS.border(selectedx, bottomRow, 1);
            selectedx = 13;
            selected = PS.data(13, bottomRow).blockType;
            PS.border(selectedx, bottomRow, 4);
            PS.borderColor(selectedx, bottomRow, 0xFFFF00);
            TutorialState++;
            break;

        case 23:
            PS.statusText("That's all.  Have fun!");
            TutorialState++;
            break;

        case 24:
            TutorialState = 0;
            StartGame();
            break;

        default:
            break;
    }
}


// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

}

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

}

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

}

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

}

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

}

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

}

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

}

PS.swipe = function( data, options ) {
    "use strict";

};