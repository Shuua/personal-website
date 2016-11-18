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


var paletteRainbow = [
    {color: 0xB870FF},
    {color: 0xFF9DDE},
    {color: 0xFF6666},
    {color: 0xFFAD5C},
    {color: 0xFFFF66},
    {color: 0x94FF94},
    {color: 0x71DDFF},
    {color: 0x7094FF}
]


var paletteKoi = [
    {color: 0xF2D694},
    {color: 0x3D1C00},
    {color: 0x86B8B1},
    {color: 0xEEEEEE},
    {color: 0xFA2A00}
]

var paletteSunlight = [
    {color: 0xFDE880},
    {color: 0xFFB87E},
    {color: 0xFF847B},
    {color: 0xB3709A},
    {color: 0x543270}
]


var paletteMoonlight = [
    {color: 0xE2E3B4},
    {color: 0xADAC94},
    {color: 0x4A8196},
    {color: 0x2D4C81},
    {color: 0x191340}
]

var paletteBeach = [
    {color: 0x3D331A},
    {color: 0xC2AD7A},
    {color: 0xFFDC88},
    {color: 0x3B5EB2},
    {color: 0x88AAFF}
]


var paletteFirefly = [
    {color: 0x0B083D},
    {color: 0x8984AB},
    {color: 0x6F66FF},
    {color: 0xB2A458},
    {color: 0xFFED8D}
]

var paletteForest = [
    {color: 0x3D1C13},
    {color: 0xABA5A4},
    {color: 0xFFAC95},
    {color: 0x79B2A1},
    {color: 0xBCFFEB}
]

var paletteFruit = [
    {color: 0x92B219},
    {color: 0xEEFFB0},
    {color: 0xE3FF7C},
    {color: 0x8733B2},
    {color: 0xD687FF}
]


var paletteMonoGreen = [
    {color: 0x153B19},
    {color: 0xA7FFB0},
    {color: 0x5BFF6C},
    {color: 0x547F58}
]

var paletteMonoOrange = [
    {color: 0x3B2B15},
    {color: 0xFFDAA8},
    {color: 0xFFBA5C},
    {color: 0x7F6D54}
]

var paletteMonoRed = [
    {color: 0x3B1310},
    {color: 0xFF9B93},
    {color: 0xFF5347},
    {color: 0x7F4D4A}
]

var paletteMonoBlue = [
    {color: 0x1C2E3B},
    {color: 0x0094FF},
    {color: 0x77C6FF},
    {color: 0x62737F}
]

var paletteMonoPurple = [
    {color: 0x13123B},
    {color: 0x9D99FF},
    {color: 0x534CFF},
    {color: 0x4E4C7F}
]

var paletteMonoYellow = [
    {color: 0x3B382B},
    {color: 0xFFE26F},
    {color: 0xFFF2BB},
    {color: 0x7F7137}
]


var colorPaletteArray = [
    paletteBeach,
    paletteFirefly,
    paletteForest,
    paletteFruit,
    paletteKoi,
    paletteRainbow,
    paletteSunlight,
    paletteMoonlight,
    paletteMonoBlue,
    paletteMonoGreen,
    paletteMonoOrange,
    paletteMonoPurple,
    paletteMonoRed,
    paletteMonoYellow
]

var State = {
    START: 0,
    PUZZLE: 1,
    QUESTION: 2,
    ANSWER: 3
}


var Question = {
    MOST_COLOR: 0,
    LEAST_COLOR: 1,
    MOST_GLYPH: 2,
    LEAST_GLYPH: 3,
    ABSENT_COLOR: 4,
    ABSENT_GLYPH: 5,
    MOST_COLOR_GLYPH: 6,
    LEAST_COLOR_GLYPH: 7,
    GLYPH_COLOR: 8
}

//Displayed Question
//Displayed Answer
//Colors available
var QuestionProperties = [
    {},
    {},
    {}
]

var state = State.START;

//Must be initialized at start
var level = 0;
var currentTries = 0;
var totalTries = 0;
var gameOver = false;

//These will be defined by the generated puzzle
var width = 0;
var height = 0;
var question = Question.MOST_COLOR;
var puzzleBlockArray = [[]];
var puzzleGlyphArray = [[]];
var choices = 0;
var correctAnswer = 0;
var timer = 5;
var timerFunction;

//These arrays are maintained and used during gameplay
var colors = 5;
var colorArray = [];
var glyphs = 5;
var glyphArray = [
    {glyph: 0x2620},
    {glyph: 0x26C4},
    {glyph: 0x263C},
    {glyph: 0x2615},
    {glyph: 0x2665}
    ]
var choiceArray = [];
var selectedColors = [];
var selectedGlyphs = [];
var colorFrequency = [];
var glyphFrequency = [];
var chosenGlyph = 0;
var chosenGlyphColor = 0;

//Called at the start screen of the game
function Initialize() {

    //Highest level can get to is 15
    level = 0;
    currentTries = 0;
    totalTries = 0;

}

function DisplayTimerText() {
    PS.statusText(timer + " ----- Level " + (level+1) + " ----- " + timer);
}

function StartTimer() {

    timer = 3 + Math.floor(width/1.5);
    timerFunction = PS.timerStart(60, PuzzleTimer);
    DisplayTimerText();

}

function StopTimer() {

    PS.timerStop(timerFunction);

}

function PuzzleTimer() {

    timer--;
    PS.audioPlay("fx_blip");
    DisplayTimerText();
    if (timer <= 0) {
        StopTimer();
        DisplayQuestion();
        PS.border(PS.ALL, PS.ALL, 0);
        state = State.QUESTION;
    }

}

function SetPuzzleSettings() {

    for (var i = 0; i < 5; i++) {
        colorFrequency[i] = 0;
        glyphFrequency[i] = 0;
        selectedColors[i] = 0;
        choiceArray[i] = 0;
        selectedGlyphs[i] = 0;
    }

    PS.gridShadow(false);

}

function DisplayBlock(x, y, block) {

    PS.color(x, y, block.color);

}

function DisplayGlyph(x, y, glyph) {

    if (glyph != null) {
        PS.glyph(x, y, glyph.glyph);
        PS.glyphColor(x, y, PS.COLOR_BLACK);
    }

}

function GenerateQuestion() {

    var rand;

    //Generate the random number based on level.
    if (level <= 5) {
        rand = PS.random(2);
    }
    else if (level === 6) {
        rand = 3;
    }
    else {
        rand = PS.random(3);
    }

    //Use the random number to set the question.
    if (rand === 1) {
        question = Question.MOST_COLOR;
    }
    else if (rand === 2) {
        question = Question.LEAST_COLOR;
    }
    else {
        question = Question.GLYPH_COLOR;
    }

}

function GetNewColorBlock() {

    var rand;
    var block = null;
    while (block === null) {
        rand = PS.random(colors) - 1;
        if (selectedColors[rand] === 0) {
            block = colorArray[rand];
            selectedColors[rand] = 1;
        }
    }

    return block;

}

function ResetColors() {

    for (var i = 0; i < colors; i++) {
        selectedColors[i] = 0;
    }

}

function ChooseColorPalette() {
    var randPalette = 0;
    if (level < 8) {
        randPalette = PS.random(6) + 7;
    }
    else{
        randPalette = PS.random(8) - 1;
    }

    if (randPalette < 8)
    {
        colors = 5;
    }
    else
    {
        colors = 4;
    }
    colorArray = colorPaletteArray[randPalette];
}

function FindMostColor() {

    var mostFrequent = {color: 0, frequency: 0};
    //Determines which one occurred the most frequently
    for (var i = 0; i < choices; i++) {
        if (colorFrequency[i] > mostFrequent.frequency) {
            mostFrequent.color = i;
            mostFrequent.frequency = colorFrequency[i];
        }
    }

    //Gives a random boost of the most frequent blocks frequency, if it doesn't already fill the grid.
    if (mostFrequent.frequency != (width * height)) {
        BoostMostFrequent(mostFrequent.color);
    }

    return mostFrequent.color;

}

//Function that adds extra most frequent blocks to the page
function BoostMostFrequent(color) {

    var boosted = false;
    while (!boosted) {
        var randomWidth = PS.random(width) - 1;
        var randomHeight = PS.random(width) - 1;
        if (puzzleBlockArray[randomWidth][randomHeight] != choiceArray[color]) {
            puzzleBlockArray[randomWidth][randomHeight] = choiceArray[color];
            boosted = true;
        }
    }

}

function FindLeastColor() {

    var leastFrequent = {color: 0, frequency: 999};
    for (var i = 0; i < choices; i++) {
        if (colorFrequency[i] < leastFrequent.frequency) {
            leastFrequent.color = i;
            leastFrequent.frequency = colorFrequency[i];
        }
    }

    //Gives a random reduction of the least frequent blocks frequency, if it doesn't already not exist.
    if (leastFrequent.frequency != 0) {
        ReduceLeastFrequent(leastFrequent.color);
    }

    return leastFrequent.color;

}

//Function that adds extra most frequent blocks to the page
function ReduceLeastFrequent(color) {

    var reduced = false;
    while (!reduced) {

        var randomWidth = PS.random(width) - 1;
        var randomHeight = PS.random(width) - 1;

        if (puzzleBlockArray[randomWidth][randomHeight] === choiceArray[color]) {

            //Now loop trying to find a random color that isn't the current one.
            while (!reduced) {
                var randomColor = PS.random(choices) - 1;
                if (randomColor != color) {
                    puzzleBlockArray[randomWidth][randomHeight] = choiceArray[randomColor];
                    reduced = true;
                }
            }

        }

    }

}

//Generates based on level
function GeneratePuzzle() {

    ChooseColorPalette();

    choices = Math.floor((level + 8)/4);
    width = level + 9 - (choices * 3);
    height = level + 9 - (choices * 3);
    if (level > 5) {
        width -= 2;
        height -= 2;
    }


    //Add in glyphs
    setGlyphs();

    for (var i = 0; i < choices; i++) {
        choiceArray[i] = GetNewColorBlock();
    }

    var randomColor = 0;

    //Add in the colors
    for (var i = 0; i < height; i++) {
        puzzleBlockArray[i] = [];
        for (var j = 0; j < width; j++) {
            randomColor = PS.random(choices) - 1;
            puzzleBlockArray[i][j] = choiceArray[randomColor];
            colorFrequency[randomColor] += 1;
            if (level > 5 && puzzleGlyphArray[i][j] === glyphArray[chosenGlyph]) {
                chosenGlyphColor = randomColor;
            }
        }
    }

    if (question == Question.MOST_COLOR) {
        correctAnswer = FindMostColor();
    }
    else if (question == Question.LEAST_COLOR) {
        correctAnswer = FindLeastColor();
    }
    else {
        correctAnswer = chosenGlyphColor;
    }

    //Resets the selected colors. We have generated the puzzle already, we don't need to know this anymore.
    ResetColors();

}

function setGlyphs() {

    if (level > 5) {
        for (var i = 0; i < height; i++) {
            puzzleGlyphArray[i] = [];
            for (var j = 0; j < width; j++) {
                puzzleGlyphArray[i][j] = null;
            }
        }
        chosenGlyph = PS.random(5) - 1;
        for (var i = 0; i < glyphs; i++) {
            var randomWidth = PS.random(width) - 1;
            var randomHeight = PS.random(height) - 1;
            if (puzzleGlyphArray[randomWidth][randomHeight] == null) {
                puzzleGlyphArray[randomWidth][randomHeight] = glyphArray[i];
            }
            else {
                i--;
            }

        }
    }

}

//Displays whatever has been generated
function DisplayPuzzle() {

    PS.gridSize(width, height);
    PS.fade(PS.ALL, PS.ALL, 40);
    PS.gridColor(0x222222);
    PS.statusColor(PS.COLOR_WHITE);

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            DisplayBlock(j, i, puzzleBlockArray[i][j]);
            if (level > 5) {
                DisplayGlyph(j, i, puzzleGlyphArray[i][j]);
            }
        }
    }

    DisplayTimerText();

}

function DisplayQuestion() {

    PS.gridSize(choices, 1);
    PS.gridColor(0x222222);
    PS.statusColor(PS.COLOR_WHITE);

    for (var i = 0; i < choices; i++) {
        DisplayBlock(i, 0, choiceArray[i]);
    }
    if (question === Question.MOST_COLOR) {
        PS.statusText("Which color occurred the MOST?");
    }
    if (question === Question.LEAST_COLOR) {
        PS.statusText("Which color occurred the LEAST?");
    }
    if (question === Question.GLYPH_COLOR) {
        PS.statusText("Which color did this GLYPH appear on?");
        for (var i = 0; i < choices; i++) {
            DisplayGlyph(i, 0, glyphArray[chosenGlyph]);
        }
    }

}

function CheckAnswer(x) {

    currentTries++;
    if (x === correctAnswer) {
        if ((totalTries + currentTries) >= 15) {
            PS.statusText("Game Over! Got to level " + (level + 2) + " in 15 tries!");
            gameOver = true;
        }
        else if (currentTries === 1) {
            PS.statusText("Beat Level " + (level+1) + "! It took 1 try. Click to proceed");
        }
        else {
            PS.statusText("Beat Level " + (level + 1) + "! It took " + currentTries + " tries. Click to proceed");
        }
        level++;
        totalTries += currentTries;
        currentTries = 0;
    }
    else {
        if ((totalTries + currentTries) >= 15) {
            PS.statusText("Game Over! Got to level " + (level + 1) + " in 15 tries!");
            gameOver = true;
        }
        else if (currentTries === 1) {
            PS.statusText("Incorrect! You have tried this level 1 time.");
        }
        else {
            PS.statusText("Incorrect! You have tried this level " + currentTries + " times.");
        }
        PS.glyph(x, 0, 0x2716);
    }

}

function DisplayAnswer() {

    PS.fade(PS.ALL, PS.ALL, 60);
    PS.glyph(correctAnswer, 0, 0x2714);

    for (var i = 0; i < choices; i++) {

        var currentColor = PS.color(i, 0, PS.CURRENT);
        var red, green, blue;
        red = currentColor / 65536;
        green = (currentColor % 65536) / 256;
        blue = currentColor % 256;

        if (i != correctAnswer) {
           //Set the color to a darker version
           PS.color(i, 0, red - 180, green - 180, blue - 180);
        }
        else {
            //Make the correct answer brighter
            PS.color(i, 0, red + 50, green + 50, blue + 50);
            PS.gridShadow(true, red, green, blue);
        }
    }


// Required functions are found below. They call and use the other functions found above.

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

}

PS.init = function (system, options) {
	"use strict";

	//Initialize grid size.
	PS.gridSize(3, 3);

    PS.gridColor(0x222222);
    PS.statusColor(PS.COLOR_WHITE);

    PS.statusText("Welcome! Click the grid to begin!");

};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

    switch (state) {
        case State.START:
            state = State.PUZZLE;
            Initialize();
            SetPuzzleSettings();
            GenerateQuestion();
            GeneratePuzzle();
            DisplayPuzzle();
            StartTimer();
            PS.border(PS.ALL, PS.ALL, 0);
            break;
        case State.PUZZLE:
            timer--;
            if (timer >= 0) {
                PS.audioPlay("fx_blip");
                DisplayTimerText();
            }
            break;
        case State.QUESTION:
            state = State.ANSWER;
            CheckAnswer(x);
            DisplayAnswer();
            PS.border(PS.ALL, PS.ALL, 0);
            if (gameOver) {
                state = State.START;
                gameOver = false;
            }
            break;
        case State.ANSWER:
            state = State.PUZZLE;
            SetPuzzleSettings();
            GenerateQuestion();
            GeneratePuzzle();
            DisplayPuzzle();
            StartTimer();
            PS.border(PS.ALL, PS.ALL, 0);
            break;
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

};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

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

};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

};

PS.swipe = function( data, options ) {
    "use strict";

};