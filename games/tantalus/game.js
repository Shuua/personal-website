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

//Audio by author C418 - Track titled Sleepless - Track titled Incredible

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

var width = 16;
var height = 16;

var mapImage = null;
var mapImageData = null;
var mapIsReady = false;
var mapDataIsReady = false;
var visibleLeftX = 0;
var visibleTopY = 0;

var xPos = 6;
var yPos = 6;
var relativeX = 6;
var relativeY = 6;

var upKey = 0;
var sideKey = 0;
var jumping = false;
var jumpCount = 3;
var falling = false;
var tutorialSong;

//The overarching gameloop for the game. Based on a timer.
function GameLoop() {

    if (mapIsReady && mapDataIsReady) {
        SmartMover();
		console.log(GetMapColors(mapImageData, xPos, yPos).blue)
        if (GetMapColors(mapImageData, xPos, yPos).blue === 100) {
            TutorialOver();
        }
    }

}

function SmartMover() {

    var xMovement = sideKey;
    var yMovement = upKey;

    //Detect how to Move
    var blockBelow = IsWall(xPos, yPos + 1);
    var blockLeft = IsWall(xPos - 1, yPos);
    var blockRight = IsWall(xPos + 1, yPos);
    var blockUp = IsWall(xPos, yPos - 1);

    if (xMovement === -1 && blockLeft) {
        xMovement = 0;
    }
    else if (xMovement === 1 && blockRight) {
        xMovement = 0;
    }

    if (yMovement && (blockUp || !blockBelow)) {
        yMovement = 0;
    }

    //Now that we have filtered the movement based on the surroundings, let them Move.

    //This enables jumping. Set it to true if they have jumped properly
    if (yMovement) {
        jumping = true;
        jumpCount = 3;
    }

    //If they have reached their peak of a jump.
    if (jumpCount <= 0 || blockUp) {
        jumping = false;
    }

    //If they fall over an edge
    if (!jumping && !blockBelow) {
        falling = true;
    }

    //Kill the falling or jumping if they are open to Move sideways and it would interfere with sideways movement
    //Moving sideways is much more important than jumping
    if (xMovement) {
        if (IsWall(xMovement + xPos, yPos + 1)) {
            falling = false;
        }
        if (IsWall(xMovement + xPos, yPos - 1)) {
            jumping = false;
        }
    }

    //If they are still jumping
    if (jumping) {
        Move(xMovement, -1);
        jumpCount--;
    }

    //If they are still falling
    else if (falling) {
        if (blockBelow) {
            falling = false;
            Move(xMovement, 0);
        }
        else {
            Move(xMovement, 1);
        }
    }

    //Else just Move sideways
    else {
        Move(xMovement, 0);
    }

}

function IsWall(x, y) {

    return (GetMapColors(mapImageData, x, y).red === 1);

}

function OutOfMiddleCorrection(x, y) {

    var xShift = 0;
    var yShift = 0;

    if (x + relativeX < 6) {
        xShift = -1;
    }
    else if (x + relativeX > 9) {
        xShift = 1;
    }
    else {
        relativeX += x;
    }
    if (y + relativeY < 6) {
        yShift = -1;
    }
    else if (y + relativeY > 9) {
        yShift = 1;
    }
    else {
        relativeY += y;
    }

    if (xShift != 0 || yShift != 0) {
        visibleLeftX += xShift;
        visibleTopY += yShift;
        PS.imageBlit(mapImage, 0, 0, {left:visibleLeftX, top:visibleTopY, width:16, height:16});
    }

}

function Move(x, y) {

    if (x === 0 && y === 0) {
        return;
    }

    if (!mapIsReady) {
        return;
    }

    var newX = x + xPos;
    var newY = y + yPos;

    var prevRelativeX = relativeX;
    var prevRelativeY = relativeY;

    OutOfMiddleCorrection(x, y);

    MoveBead(prevRelativeX, prevRelativeY, relativeX, relativeY);

    xPos = newX;
    yPos = newY;

}

function MoveBead(prevRelativeX, prevRelativeY, relativeX, relativeY) {

    var backColor = GetMapColors(mapImage, visibleLeftX + prevRelativeX, visibleTopY + prevRelativeY);
    PS.color(prevRelativeX, prevRelativeY, backColor.red, backColor.green, backColor.blue);
    PS.color(relativeX, relativeY, 0x375923);

}

function MapDataIsReady(image) {

    mapDataIsReady = true;
    mapImageData = image;

}

function MapIsReady(image) {

    mapIsReady = true;
    mapImage = image;
    PS.imageBlit(mapImage, 0, 0, {left:0, top:0, width:16, height:16});
    PS.color(6, 6, 0x375923);

}

function GetMapColors(map, x, y) {

    var dataArrayLocation = 4 * ((map.width * y) + x);

    var colors = {};
    colors.red = map.data[dataArrayLocation];
    colors.green = map.data[dataArrayLocation + 1];
    colors.blue = map.data[dataArrayLocation + 2];
    colors.alpha = map.data[dataArrayLocation + 3];
    return colors;

}

function TutorialOver() {

    var opt = {};
    opt.loop = true;
    opt.lock = true;
    opt.volume = .5;
    opt.path = "./";
    PS.audioStop(tutorialSong);
    PS.audioPlay("C418_Sleepless", opt);
    PS.statusFade(240, {rgb: 0x000000});
    PS.statusColor(0xFFFFFF);
    PS.statusText("Tantalus")

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
    PS.gridSize(width, height);

    //Color the backdrop to be black (shouldn't be seen)
    PS.gridColor(PS.COLOR_BLACK);

    PS.statusColor(PS.COLOR_BLACK);
    PS.statusText("");

    PS.border(PS.ALL, PS.ALL, 0);

    PS.imageLoad("./level.bmp", MapIsReady);
    PS.imageLoad("./level_data.bmp", MapDataIsReady);

    PS.timerStart (7, GameLoop);

    var opt = {};
    opt.loop = true;
    opt.lock = true;
    opt.volume = .5;
    opt.path = "./";
    tutorialSong = PS.audioPlay("C418_Incredible", opt);

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

PS.keyDown = function(key, shift, ctrl, options) {
    "use strict";

    switch (key)
    {
        case PS.KEY_ARROW_UP:
        case 87:
        case 119:
        {
            upKey = -1;
            break;
        }
        case PS.KEY_ARROW_DOWN:
        case 83:
        case 115:
        {
            break;
        }
        case PS.KEY_ARROW_LEFT:
        case 65:
        case 97:
        {
            sideKey = -1;
            break;
        }
        case PS.KEY_ARROW_RIGHT:
        case 68:
        case 100:
        {
            sideKey = 1;
            break;
        }
        default:
        {
            break;
        }
    }

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

PS.keyUp = function(key, shift, ctrl, options) {
    "use strict";

    switch (key)
    {
        case PS.KEY_ARROW_UP:
        case 87:
        case 119:
        {
            if (upKey === -1) {
                upKey = 0;
            }
            break;
        }
        case PS.KEY_ARROW_DOWN:
        case 83:
        case 115:
        {
            break;
        }
        case PS.KEY_ARROW_LEFT:
        case 65:
        case 97:
        {
            if (sideKey === -1) {
                sideKey = 0;
            }
            break;
        }
        case PS.KEY_ARROW_RIGHT:
        case 68:
        case 100:
        {
            if (sideKey === 1) {
                sideKey = 0;
            }
            break;
        }
        default:
        {
            break;
        }
    }

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