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

function CreateBlockData (blockType, counter, nextBlockData) {
	var blockData = {blockType:blockType, counter:counter, nextBlockData:nextBlockData};
	return blockData;
};

var width = 13;
var height = 16;

var Blocks = {
	STONE: 0,
	SAND: 1,
	VINE: 2,
	WATER: 3,
	FIRE: 4,
	ICE: 5,
	CREATURE: 6,
	PLASMA: 7,
	BOMB: 8,
	FRUIT: 9,
	ZAP: 10,
	RANDOM: 11,
	SKY: 12,
	SNOWMAN: 13,
	CORPSE: 14,
	GRAVE: 15,
	EXPLOSION: 16
}

//blockProperties {blockColor, glyphColor, glyphSymbol, blockFunction, isFalling}
//NOTE ALL BLOCK FUNCTIONS SHOULD ACCEPT x,y AS INPUT, BUT NOTHING ELSE
var blockProperties =              [{blockColor:0x333333, glyphColor:0xC2C2C2, glyphSymbol:0x2752, blockFunction: null, isFalling: false, soundEffects: "fx_click", name: "Stone"}];
blockProperties[Blocks.SAND] =    {blockColor:0xFFFFCC, glyphColor:0x808066, glyphSymbol:0x21E9, blockFunction: null, isFalling: true, soundEffects: "fx_squish", name: "Sand"};
blockProperties[Blocks.VINE] =      {blockColor:0x4A9764, glyphColor:0x99FF99, glyphSymbol:0x2766, blockFunction: Grow, isFalling: false, soundEffects: "piano_g6", name: "Vine"};
blockProperties[Blocks.WATER] =     {blockColor:0x3333D6, glyphColor:0x85D6FF, glyphSymbol:0x224B, blockFunction: Douse, isFalling: true, soundEffects: "fx_drip2", name: "Water"};
blockProperties[Blocks.FIRE] =      {blockColor:0xFF6600, glyphColor:0xFFFFB2, glyphSymbol:0x2668, blockFunction: CatchFire, isFalling: false, soundEffects: "fx_scratch", name: "Fire"};
blockProperties[Blocks.ICE] =       {blockColor:0xCCFFFF, glyphColor:0x0099CC, glyphSymbol:0x2744, blockFunction: Freeze, isFalling: false, soundEffects: "fx_drip1", name: "Ice"};
blockProperties[Blocks.CREATURE] =  {blockColor:0x99FF99, glyphColor:0x2E4C2E, glyphSymbol:0x263A, blockFunction: MoveCreature, isFalling: false, soundEffects: "fx_chirp1", name: "Creature"};
blockProperties[Blocks.PLASMA] =     {blockColor:0x8F5500, glyphColor:0xFFFFB2, glyphSymbol:0x2604, blockFunction: TorchFunction, isFalling: true, soundEffects: "fx_tick", name: "Plasma"};
blockProperties[Blocks.BOMB] =      {blockColor:0x800000, glyphColor:0xFFFF00, glyphSymbol:0x2622, blockFunction: BombFunction, isFalling: false, soundEffects: "fx_squink", name: "Bomb"};
blockProperties[Blocks.FRUIT] =      {blockColor:0x985DD4, glyphColor:0x3D007A, glyphSymbol:0x047C, blockFunction: null, isFalling: true, soundEffects: "fx_pop", name: "Fruit"};
blockProperties[Blocks.ZAP] =       {blockColor:0x333314, glyphColor:0xFFFF00, glyphSymbol:0x2124, blockFunction: Electrocute, isFalling: false, soundEffects: "fx_zurp", name: "Zap"};
blockProperties[Blocks.RANDOM] =    {blockColor:0x888888, glyphColor:0xFFFFFF, glyphSymbol:0x003F, blockFunction: null, isFalling: false, soundEffects: "fx_hoot", name: "Random"};
blockProperties[Blocks.SKY] =       {blockColor:0xC2C2A3, glyphColor:0xC2C2A3, glyphSymbol:PS.DEFAULT, blockFunction: null, isFalling: false, soundEffects: "fx_swoosh", name: "Erase"};
blockProperties[Blocks.SNOWMAN] =   {blockColor:0xCCFFFF, glyphColor:0x0099CC, glyphSymbol:0x2603, blockFunction: Freeze, isFalling: false, soundEffects: "fx_drip1", name: "Snowman"};
blockProperties[Blocks.CORPSE] =    {blockColor:0x6B8F00, glyphColor:0x1F2900, glyphSymbol:0x2620, blockFunction: null, isFalling: true, soundEffects: "fx_chirp2", name: "Corpse"};
blockProperties[Blocks.GRAVE] =     {blockColor:0x888888, glyphColor:0xDDDDDD, glyphSymbol:0x21ED, blockFunction: null, isFalling: true, soundEffects: "fx_chirp1", name: "Grave"};
blockProperties[Blocks.EXPLOSION] = {blockColor:0xFFFFFF, glyphColor:0xFFFFFF, glyphSymbol: PS.DEFAULT, blockFunction: ExplosionFunction, isFalling: false, soundEffects: "fx_bang", name: "Explosion"};

var selected = 0;






function PlaceBlock(x, y, blockValue) {

	if (selected === 11) {
		var rand = PS.random(11) - 1;
		PS.color(x, y, blockProperties[rand].blockColor);
		PS.glyph(x, y, blockProperties[rand].glyphSymbol);
		PS.glyphColor(x, y, blockProperties[rand].glyphColor);
		PS.data(x, y, CreateBlockData(rand, 0, null));
	}
	else {
		PS.color(x, y, blockProperties[blockValue].blockColor);
		PS.glyph(x, y, blockProperties[blockValue].glyphSymbol);
		PS.glyphColor(x, y, blockProperties[blockValue].glyphColor);
		PS.data(x, y, CreateBlockData(blockValue, 0, null));
	}

};

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

//The AI for moving the creatures. Currently they sometimes eat each other? Rude
function MoveCreature(x,y) {


	var direction = (PS.random(4) - 1);


	// Kills if there is a ZAP nearby
	if (CheckRadial(x, y, Blocks.ZAP, 2) || CheckRadial(x,y, Blocks.EXPLOSION, 3))	{
		SetNextBlockData(x, y, CreateBlockData(Blocks.CORPSE, 0, null))}


	//Otherwise, carry on as normal
	else {








		if (direction === 0 && IsOnMap(x + 1, y)) {
			//Moves creature
			if (PS.data(x + 1, y).blockType === Blocks.SKY && (!NextBlockDataIsNotNull(x + 1, y) || PS.data(x + 1, y).nextBlockData.blockType != Blocks.CREATURE)) {
				SetNextBlockData(x + 1, y, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Lets creature swim
			if (PS.data(x + 1, y).blockType === Blocks.WATER) {
				SetNextBlockData(x + 1, y, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
			}
			//Lets creatures eat
			if (PS.data(x + 1, y).blockType === Blocks.FRUIT) {
				SetNextBlockData(x + 1, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Kills if they try to walk into fire
			if (PS.data(x + 1, y).blockType === Blocks.FIRE) {
				SetNextBlockData(x + 1, y, CreateBlockData(Blocks.CORPSE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			// Builds snowmen
			if (PS.data(x + 1, y).blockType === Blocks.ICE) {
				SetNextBlockData(x + 1, y, CreateBlockData(Blocks.SNOWMAN, 0, null));
			}
		}
		if (direction === 1 && IsOnMap(x, y + 1)) {
			//Moves creature
			if (PS.data(x, y + 1).blockType === Blocks.SKY && (!NextBlockDataIsNotNull(x, y + 1) || PS.data(x, y + 1).nextBlockData.blockType != Blocks.CREATURE)) {
				SetNextBlockData(x, y + 1, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Lets creature swim
			if (PS.data(x, y + 1).blockType === Blocks.WATER) {
				SetNextBlockData(x, y + 1, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
			}
			//Lets creatures eat
			if (PS.data(x, y + 1).blockType === Blocks.FRUIT) {
				SetNextBlockData(x, y + 1, CreateBlockData(Blocks.SKY, 0, null));
			}
			// Kills if they try to walk into fire
			if (PS.data(x, y + 1).blockType === Blocks.FIRE) {
				SetNextBlockData(x, y + 1, CreateBlockData(Blocks.CORPSE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Builds snowmen
			if (PS.data(x, y + 1).blockType === Blocks.ICE) {
				SetNextBlockData(x, y + 1, CreateBlockData(Blocks.SNOWMAN, 0, null));
			}
		}
		if (direction === 2 && IsOnMap(x - 1, y)) {
			//Moves creature
			if (PS.data(x - 1, y).blockType === Blocks.SKY && (!NextBlockDataIsNotNull(x - 1, y) || PS.data(x - 1, y).nextBlockData.blockType != Blocks.CREATURE)) {
				SetNextBlockData(x - 1, y, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Lets creature swim
			if (PS.data(x - 1, y).blockType === Blocks.WATER) {
				SetNextBlockData(x - 1, y, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
			}
			//Lets creature eat
			if (PS.data(x - 1, y).blockType === Blocks.FRUIT) {
				SetNextBlockData(x - 1, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			// Kills if they try to walk into fire
			if (PS.data(x - 1, y).blockType === Blocks.FIRE) {
				SetNextBlockData(x - 1, y, CreateBlockData(Blocks.CORPSE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			// Builds snowmen
			if (PS.data(x - 1, y).blockType === Blocks.ICE) {
				SetNextBlockData(x - 1, y, CreateBlockData(Blocks.SNOWMAN, 0, null));
			}
		}
		if (direction === 3 && IsOnMap(x, y - 1)) {
			//Moves creature
			if (PS.data(x, y - 1).blockType === Blocks.SKY && (!NextBlockDataIsNotNull(x, y - 1) || PS.data(x, y - 1).nextBlockData.blockType != Blocks.CREATURE)) {
				SetNextBlockData(x, y - 1, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Lets creature swim
			if (PS.data(x, y - 1).blockType === Blocks.WATER) {
				SetNextBlockData(x, y - 1, CreateBlockData(Blocks.CREATURE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
			}
			//Lets creatures eat
			if (PS.data(x, y - 1).blockType === Blocks.FRUIT) {
				SetNextBlockData(x, y - 1, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Kills if they try to walk into fire
			if (PS.data(x, y - 1).blockType === Blocks.FIRE) {
				SetNextBlockData(x, y - 1, CreateBlockData(Blocks.CORPSE, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
			}
			//Builds snowmen
			if (PS.data(x, y - 1).blockType === Blocks.ICE) {
				SetNextBlockData(x, y - 1, CreateBlockData(Blocks.SNOWMAN, 0, null));
			}
		}


		//Bury the dead
		if (IsOnMap(x + 1, y) && PS.data(x + 1, y).blockType === Blocks.CORPSE) {
			SetNextBlockData(x + 1, y, CreateBlockData(Blocks.GRAVE, 0, null));
		}
		if (IsOnMap(x, y - 1) && PS.data(x, y - 1).blockType === Blocks.CORPSE) {
			SetNextBlockData(x, y - 1, CreateBlockData(Blocks.GRAVE, 0, null));
		}
		if (IsOnMap(x - 1, y) && PS.data(x - 1, y).blockType === Blocks.CORPSE) {
			SetNextBlockData(x - 1, y, CreateBlockData(Blocks.GRAVE, 0, null));
		}
		if (IsOnMap(x, y + 1) && PS.data(x, y + 1).blockType === Blocks.CORPSE) {
			SetNextBlockData(x, y + 1, CreateBlockData(Blocks.GRAVE, 0, null));
		}

	}

};

function BombFunction(x,y) {

	if(CheckRadial(x, y, Blocks.EXPLOSION, 2) || CheckRadial(x, y, Blocks.FIRE, 2) || CheckRadial(x, y, Blocks.ZAP, 2) || PS.data(x,y).counter > 0) {
		IncrementCounter(x,y);
		PS.audioPlay("fx_blip");
	}




	if (PS.data(x,y).counter >= 4) {
		SetNextBlockData(x,y, CreateBlockData(Blocks.EXPLOSION, 0, null));
		PS.audioPlay("fx_bang");
	}


}


function Freeze(x,y) {


	//Checks if there is fire or a torch nearby, then melts if there is
	if(CheckRadial(x, y, Blocks.PLASMA, 2) || CheckRadial(x, y, Blocks.FIRE, 2) || CheckRadial(x, y, Blocks.ZAP, 2)) {
		SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
	}

	//Otherwise, spreads ice
	else {
		if (IsOnMap(x + 1, y) && PS.data(x + 1, y).blockType === Blocks.WATER) {
			SetNextBlockData(x + 1, y, CreateBlockData(Blocks.ICE, 0, null));
		}
		if (IsOnMap(x, y - 1) && PS.data(x, y - 1).blockType === Blocks.WATER) {
			SetNextBlockData(x, y - 1, CreateBlockData(Blocks.ICE, 0, null));
		}
		if (IsOnMap(x - 1, y) && PS.data(x - 1, y).blockType === Blocks.WATER) {
			SetNextBlockData(x - 1, y, CreateBlockData(Blocks.ICE, 0, null));
		}
		if (IsOnMap(x, y + 1) && PS.data(x, y + 1).blockType === Blocks.WATER) {
			SetNextBlockData(x, y + 1, CreateBlockData(Blocks.ICE, 0, null));
		}
	}
}

function CatchFire(x,y) {

	IncrementCounter(x,y);

	//Burn leaves around you
	if (IsOnMap(x+1,y) && PS.data(x+1,y).blockType === Blocks.VINE) {
		SetNextBlockData(x+1, y, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x,y-1) && PS.data(x,y-1).blockType === Blocks.VINE) {
		SetNextBlockData(x, y-1, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x-1,y) && PS.data(x-1,y).blockType === Blocks.VINE) {
		SetNextBlockData(x-1, y, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x,y+1) && PS.data(x,y+1).blockType === Blocks.VINE) {
		SetNextBlockData(x, y+1, CreateBlockData(Blocks.FIRE, 0, null));
	}


	if (PS.data(x,y).counter >= 5) {
		SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
	}

}


function TorchFunction(x, y) {

	//Burn leaves around you
	if (IsOnMap(x+1,y) && PS.data(x+1,y).blockType === Blocks.VINE) {
		SetNextBlockData(x+1, y, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x,y-1) && PS.data(x,y-1).blockType === Blocks.VINE) {
		SetNextBlockData(x, y-1, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x-1,y) && PS.data(x-1,y).blockType === Blocks.VINE) {
		SetNextBlockData(x-1, y, CreateBlockData(Blocks.FIRE, 0, null));
	}
	if (IsOnMap(x,y+1) && PS.data(x,y+1).blockType === Blocks.VINE) {
		SetNextBlockData(x, y+1, CreateBlockData(Blocks.FIRE, 0, null));
	}


}




function Grow(x, y) {

	var seed = PS.random(255);
	var isWatered = CheckRadial(x, y, Blocks.WATER, 2);

	if ((seed == 0 || (seed == 1 && isWatered)) && IsOnMap(x + 1, y) && (PS.data(x + 1, y).blockType === Blocks.SKY)) {
		SetNextBlockData(x + 1, y, CreateBlockData(Blocks.VINE, 0, null));
	}
	if ((seed == 2 || (seed == 3 && isWatered)) && IsOnMap(x - 1, y) && (PS.data(x - 1, y).blockType === Blocks.SKY)) {
		SetNextBlockData(x - 1, y, CreateBlockData(Blocks.VINE, 0, null));
	}
	if ((seed == 4 || (seed == 5 && isWatered)) && IsOnMap(x, y + 1) && (PS.data(x, y + 1).blockType === Blocks.SKY)) {
		SetNextBlockData(x, y + 1, CreateBlockData(Blocks.VINE, 0, null));
	}
	if ((seed == 6 || (seed == 7 && isWatered)) && IsOnMap(x, y - 1) && (PS.data(x, y - 1).blockType === Blocks.SKY)) {
		SetNextBlockData(x, y - 1, CreateBlockData(Blocks.VINE, 0, null));
	}

	if (seed == 8 && IsOnMap(x + 1, y) && (PS.data(x + 1, y).blockType === Blocks.SKY)) {
		SetNextBlockData(x + 1, y, CreateBlockData(Blocks.FRUIT, 0, null));
	}
	if (seed == 9 && IsOnMap(x - 1, y) && (PS.data(x - 1, y).blockType === Blocks.SKY)) {
		SetNextBlockData(x - 1, y, CreateBlockData(Blocks.FRUIT, 0, null));
	}
	if (seed == 10 && IsOnMap(x, y + 1) && (PS.data(x, y + 1).blockType === Blocks.SKY)) {
		SetNextBlockData(x, y + 1, CreateBlockData(Blocks.FRUIT, 0, null));
	}
	if (seed == 11 && IsOnMap(x, y - 1) && (PS.data(x, y - 1).blockType === Blocks.SKY)) {
		SetNextBlockData(x, y - 1, CreateBlockData(Blocks.FRUIT, 0, null));
	}


}



function Douse(x,y) {

	//Douse fires around you
	if (IsOnMap(x + 1, y) && PS.data(x + 1, y).blockType === Blocks.FIRE) {
		SetNextBlockData(x + 1, y, CreateBlockData(Blocks.SKY, 0, null));
	}
	if (IsOnMap(x, y - 1) && PS.data(x, y - 1).blockType === Blocks.FIRE) {
		SetNextBlockData(x, y - 1, CreateBlockData(Blocks.SKY, 0, null));
	}
	if (IsOnMap(x - 1, y) && PS.data(x - 1, y).blockType === Blocks.FIRE) {
		SetNextBlockData(x - 1, y, CreateBlockData(Blocks.SKY, 0, null));
	}
	if (IsOnMap(x, y + 1) && PS.data(x, y + 1).blockType === Blocks.FIRE) {
		SetNextBlockData(x, y + 1, CreateBlockData(Blocks.SKY, 0, null));
	}
};

function Electrocute(x,y) {

	IncrementCounter(x,y);


	if (PS.data(x,y).counter >= 1) {
		SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
	}
}


function ExplosionFunction(x,y) {

	for (i = -1;  i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			if (IsOnMap(x + i, y + j)) {
				SetNextBlockData(x + i, y + j, CreateBlockData(Blocks.FIRE, 4, null));
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

	return (x < width && x >= 0 && y < height - 1 && y >= 0);

};

//Checks if nextBlockData has been assigned yet
function NextBlockDataIsNotNull(x,y) {

	return ((PS.data(x,y).nextBlockData != null) && (PS.data(x,y).nextBlockData.blockType != null))

};

//Complicated function for water physics. Not for the weak of heart!
//Would highly recommend not changing this unless you know what you are doing!
function WaterFlow(x,y) {

	//Use this variable as an ending condition for water to stop checking
	var stillOnMap = true;
	var blockedLeft = false;
	var blockedRight = false;
	for (var xDistance = 1; stillOnMap && (!blockedLeft || !blockedRight); xDistance++) {

		//Set to false to check for ending condition
		stillOnMap = false;

		//Make sure it is on the map and the right isn't already blocked
		if (IsOnMap(x+xDistance,y+1) && !blockedRight) {
			stillOnMap = true;

			//Check to see if water is blocked to the right
			if ((PS.data(x+xDistance,y).blockType != Blocks.SKY) && (PS.data(x+xDistance,y).blockType != Blocks.WATER)) {
				blockedRight = true;
			}

			//If there is an open space to the right xDistance away
			else if (PS.data(x+xDistance,y+1).nextBlockData.blockType === Blocks.SKY) {
				SetNextBlockData(x+xDistance, y+1, CreateBlockData(Blocks.WATER, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
				//Successfully flowed, return.
				return;
			}
		}

		//Make sure it is on the map and the right isn't already blocked
		if (IsOnMap(x-xDistance,y+1) && !blockedLeft) {
			stillOnMap = true;

			//Check to see if water is blocked to the left
			if ((PS.data(x-xDistance,y).nextBlockData.blockType != Blocks.SKY) && (PS.data(x-xDistance,y).nextBlockData.blockType != Blocks.WATER)) {
				blockedLeft = true;
			}

			//If there is an open space to the right xDistance away
			else if (PS.data(x-xDistance,y+1).nextBlockData.blockType === Blocks.SKY) {
				SetNextBlockData(x-xDistance, y+1, CreateBlockData(Blocks.WATER, 0, null));
				SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
				//Successfully flowed, return.
				return;
			}
		}
	}

	//Found no where for water to flow to. It does not flow.

};

function Fall(x,y) {

	var blockData = PS.data(x,y);
	//If map is beneath it
	if (IsOnMap(x,y+1) && (NextBlockDataIsNotNull(x,y+1))) {

		//If sky is below
		if (PS.data(x,y+1).nextBlockData.blockType === Blocks.SKY) {
			SetNextBlockData(x, y+1, CreateBlockData(blockData.blockType, 0, null));
			SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
		}
		//If water, here is where water physics are implemented
		else if (blockData.blockType == Blocks.WATER) {
			WaterFlow(x,y);
		}
		//If water is below falling block
		else if (PS.data(x,y+1).nextBlockData.blockType === Blocks.WATER) {
			SetNextBlockData(x, y+1, CreateBlockData(blockData.blockType, 0, null));
			SetNextBlockData(x, y, CreateBlockData(Blocks.WATER, 0, null));
		}
		//If fire is below
		else if (PS.data(x,y+1).nextBlockData.blockType === Blocks.FIRE) {
			SetNextBlockData(x, y, CreateBlockData(Blocks.SKY, 0, null));
		}

	}

};

function GameLoop() {

	//First loop through the game and set the next placement of blocks
	//This essentially "builds" a second map
	for (var y = height - 2; y >= 0; y--) {
		for (var x = 0; x < width; x++) {

			var blockData = PS.data(x,y);

			//Set by default that the next block will be the current one. Can change.
			if ((PS.data(x,y).nextBlockData === null)) {
				SetNextBlockData(x, y, CreateBlockData(blockData.blockType, blockData.counter, null));
			}
			//If it is a falling block, try to fall
			if (blockProperties[blockData.blockType].isFalling) {
				Fall(x,y);
			}
			//If a block has a function, call it
			if (blockProperties[blockData.blockType].blockFunction != null) {
				blockProperties[blockData.blockType].blockFunction(x,y);
			}
		}
	}

	//Set all the blocks in the respective block data to what they should be.
	for (var y = height - 2; y >= 0; y--) {
		for (var x = 0; x < width; x++) {

			var updatedBlockData = PS.data(x,y);

			//Move the nextBlockData to the current block data
			PS.data(x, y, updatedBlockData.nextBlockData);

			PS.color(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].blockColor);
			PS.glyph(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].glyphSymbol);
			PS.glyphColor(x, y, blockProperties[updatedBlockData.nextBlockData.blockType].glyphColor);
		}
	}

};

// Required functions are found below. They call and use the other functions found above.

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function (system, options) {
	"use strict";

	//Get bottom row height
	var bottomRow = (height - 1);

	//Initialize grid size. Can be adjusted above (do not recommend width less than 13)
	PS.gridSize(width, height);

	//Set the background to be a nice black color
	PS.bgAlpha(PS.ALL, bottomRow, 255);
	PS.bgColor(PS.ALL, bottomRow, PS.COLOR_BLACK);
	PS.borderColor(PS.ALL, bottomRow, PS.COLOR_BLACK);

	PS.applyRect(0, 0, width, bottomRow, PS.color, blockProperties[Blocks.SKY].blockColor);
	PS.applyRect(0, 0, width, bottomRow, PS.borderColor, 0x888872);
    PS.applyRect(0, 0, width, bottomRow, PS.border, 0);

	//Initialize all blocks as air blocks
	for (var y = height - 1; y >= 0; y--) {
		for (var x = 0; x < width; x++) {
			PS.data(x, y, CreateBlockData(Blocks.SKY, 0, null));
		}
	}

	//Bottom row of beads are selectable circles
	PS.radius(PS.ALL, bottomRow, 50);
	PS.scale(PS.ALL, bottomRow, 90);

	//Set the initially selected block to be stone
	PS.border(Blocks.STONE, bottomRow, 4);
	PS.borderColor(Blocks.STONE, bottomRow, 0xFFFF00);

	//Color the backdrop to be black (shouldn't be seen)
	PS.gridColor(PS.COLOR_BLACK);

	// Defines the stone selection bead
	PlaceBlock(0, bottomRow, 0);

	// Defines the leaf selection bead
	PlaceBlock(1, bottomRow, 1);

	// Defines the water selection bead
	PlaceBlock(2, bottomRow, 2);

	// Defines the fire selection bead
	PlaceBlock(3, bottomRow, 3);

	// Defines the gravel selection bead
	PlaceBlock(4, bottomRow, 4);

	// Defines the ice selection bead
	PlaceBlock(5, bottomRow, 5);

	// Defines the creature selection bead
	PlaceBlock(6, bottomRow, 6);

	// Defines the torch selection bead
	PlaceBlock(7, bottomRow, 7);

	// Defines the bomb selection bead
	PlaceBlock(8, bottomRow, 8);

	// Defines the food selection bead
	PlaceBlock(9, bottomRow, 9);

	// Defines the zap selection bead
	PlaceBlock(10, bottomRow, 10);

	// Defines the random selection bead
	PS.color(11, bottomRow, blockProperties[Blocks.RANDOM].blockColor);
	PS.glyph(11, bottomRow, blockProperties[Blocks.RANDOM].glyphSymbol);
	PS.glyphColor(11, bottomRow, blockProperties[Blocks.RANDOM].glyphColor);

	// Defines the erase selection bead
	PS.color(12, bottomRow, PS.COLOR_WHITE);
	PS.glyph(12, bottomRow, 0x00D7);
	PS.glyphColor(12, bottomRow, 0xFF3300);

	//The global timer. Should always be running, no need to stop it.
	PS.timerStart (20, GameLoop);

    PS.statusColor(PS.COLOR_WHITE);
    PS.statusText("Welcome!");

    // Creates the initial map
    PlaceBlock(PS.ALL, bottomRow - 1, Blocks.STONE);
    PlaceBlock(PS.ALL, bottomRow - 2, Blocks.STONE);
    PlaceBlock(PS.ALL, bottomRow - 3, Blocks.STONE);
    PlaceBlock(5, bottomRow - 3, Blocks.WATER);
    PlaceBlock(6, bottomRow - 3, Blocks.WATER);
    PlaceBlock(7, bottomRow - 3, Blocks.WATER);
    PlaceBlock(8, bottomRow - 3, Blocks.WATER);
    PlaceBlock(9, bottomRow - 3, Blocks.WATER);
    PlaceBlock(10, bottomRow - 3, Blocks.WATER);
    PlaceBlock(6, bottomRow - 2, Blocks.WATER);
    PlaceBlock(7, bottomRow - 2, Blocks.WATER);
    PlaceBlock(8, bottomRow - 2, Blocks.WATER);
    PlaceBlock(9, bottomRow - 2, Blocks.WATER);
    PlaceBlock(11, bottomRow - 3, Blocks.SAND);
    PlaceBlock(12, bottomRow - 3, Blocks.SAND);
    PlaceBlock(4, bottomRow - 3, Blocks.SAND);
    PlaceBlock(7, bottomRow - 1, Blocks.SAND);
    PlaceBlock(6, bottomRow - 1, Blocks.SAND);
    PlaceBlock(8, bottomRow - 1, Blocks.SAND);
    PlaceBlock(9, bottomRow - 1, Blocks.SAND);
    PlaceBlock(5, bottomRow - 2, Blocks.SAND);
    PlaceBlock(10, bottomRow - 2, Blocks.SAND);
    PlaceBlock(3, bottomRow - 4, Blocks.CREATURE);
    PlaceBlock(11, bottomRow - 4, Blocks.VINE);
    PlaceBlock(11, bottomRow - 5, Blocks.VINE);


};

var clicking = false;



// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

    clicking = true;

	//If you are changing what block you are placing
	if (y === (height - 1)) {
		PS.border(selected, y, 1);
		PS.borderColor(selected, y, PS.COLOR_BLACK);
		selected = x;
		PS.border(selected, y, 4);
		PS.borderColor(selected, y, 0xFFFF00);
        PS.statusText(blockProperties[selected].name);
	}
	//Else you are placing a block
	else {
		PlaceBlock(x, y, selected);
		PS.audioPlay(blockProperties[selected].soundEffects);
	}

};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

    clicking = false;

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

    if (clicking) {
        //If you are changing what block you are placing
        if (y === (height - 1)) {
            PS.border(selected, y, 1);
            PS.borderColor(selected, y, PS.COLOR_BLACK);
            selected = x;
            PS.border(selected, y, 4);
            PS.borderColor(selected, y, 0xFFFF00);
            PS.statusText(blockProperties[selected].name);
        }
        //Else you are placing a block
        else {
            PlaceBlock(x, y, selected);
            PS.audioPlay(blockProperties[selected].soundEffects);
        }
    }

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

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

	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
};

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

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	 PS.debug( "PS.input() called\n" );
	 var device = sensors.wheel; // check for scroll wheel
	 if ( device )
	 {
	 PS.debug( "sensors.wheel = " + device + "\n" );
	 }
	 */

	// Add code here for when an input event is detected
};

PS.swipe = function( data, options ) {
	"use strict";

};