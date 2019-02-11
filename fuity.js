/*
  Tommaso Sciotto
  10325866/914844
    "Fuity"
  Advanced Coding Tools and Methodologies
  Computer Music - Representations and Models
  06/02/2019
*/


//Global constants

const colors = [0, 2, 4, -1, 1, 3, 5]; //used for the background hue, based on the mode.

const romanNumbers = ["I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
          "VIII",
          "IX",
          "X",
          "XI",
          "XII",
          "XIII",
          "XIV",
          "XV"];

const keys = "cftvgybhunjimko";

//	Ratios in the scale
//        			PYTHAGOREAN		JUST	 EQUAL
const scaleRatios =	[[1,      1,		 1],
                 		[9/8,     9/8,	 2**(2/12)],
                 		[81/64,   5/4,	 2**(4/12)],
                 		[4/3,     4/3,	 2**(5/12)],
                 		[3/2,     3/2,	 2**(7/12)],
                 		[27/16,   5/3,	 2**(9/12)],
                 		[243/128, 15/8,	 2**(11/12)]];

const limmas =      [256/243, 16/15, 2**(1/12)];

const ionianSemitones = [0, 2, 4, 5, 7, 9, 11];
var   modalSemitones  = [0, 2, 4, 5, 7, 9, 11], //initialized to ionian
      modalSignature  = [0, 0, 0, 0, 0, 0, 0];  //difference between modal and ionian intervals in semitones


//Parrot images

/*
Silent
Battipiombo   https://i.imgur.com/ObxnghE.png
Giacintino    https://i.imgur.com/bAJqu3q.png
Tricolore     https://i.imgur.com/9E7vj4g.png
Rubritorquis  https://i.imgur.com/d1bMXnT.png

Singing
Battipiombo   https://i.imgur.com/BxRmcOD.png
Giacintino    https://i.imgur.com/g18Dh0i.png
Tricolore     https://i.imgur.com/MrfXERR.png
Rubritorquis  https://i.imgur.com/TbPCPPW.png

*/

var	c = new AudioContext();
var gameIsOn = false;
var gameStartTime = 0;

var parrotIndex = -1;
var silentParrots = ["https://i.imgur.com/HyGOoo2.png", "https://i.imgur.com/bAJqu3q.png", "https://i.imgur.com/9E7vj4g.png", "https://i.imgur.com/qhNMQRY.png"];
var singingParrots = ["https://i.imgur.com/Hh7iZfS.png", "https://i.imgur.com/g18Dh0i.png", "https://i.imgur.com/MrfXERR.png", "https://i.imgur.com/PDQ34bV.png"];

                          //Bellini                           Verdi                               Rossini                          Donizetti
var happyComposers =  ["https://i.imgur.com/gexITLa.png", "https://i.imgur.com/RuDsUj2.png", "https://i.imgur.com/J5OWeqU.png", "https://i.imgur.com/XNoftVz.png"]
var sadComposers =    ["https://i.imgur.com/FKS4bL4.png", "https://i.imgur.com/TLpyF0R.png", "https://i.imgur.com/UrUilvl.png", "https://i.imgur.com/SlfC64l.png"]

var belliniContext = document.querySelector("#Bellini").getContext("2d");
var bellini = new Image();
var verdiContext = document.querySelector("#Verdi").getContext("2d");
var verdi = new Image();
var rossiniContext = document.querySelector("#Rossini").getContext("2d");
var rossini = new Image();
var donizettiContext = document.querySelector("#Donizetti").getContext("2d");
var donizetti = new Image();

var waveform = 'triangle';

var backgroundCanvas = document.querySelector("#backgroundCanvas")
var backgroundContext = backgroundCanvas.getContext("2d");

var yourCanvas = document.querySelector("#yourCanvas")
var yourContext = yourCanvas.getContext("2d");

var theirCanvas = document.querySelector("#theirCanvas")
var theirContext = theirCanvas.getContext("2d");

var x0 = -320,
    y0 = -20;

var you = new Image();
var yourX = x0,
    yourY = y0;

var they = new Image();
var theirX = x0 - 900,
    theirXtarget = x0,
    theirY = y0;

var keyboardOn = false;

var yourNote;
var yourMelody = [];

var theirNote;
var theirBuffer = [],
    theirMelody = [];

var yourNoteOn = false;
var playedKey;

var silentUntilNow = true;

//fastCheck
var theirIndex = 0,
    playedIndex = -1;

//keyReader.js
const MIDInotes = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72];
var playedMIDInote;

//metronome.js
var metronome = true;
var nextTickTime;

//scanners.js
var nextMeasureAtTime;
var lookAhead;
var score = 0;
var threshold = 50;

//score evaluation
var bonus = 0;
//melodic consonance
var melodicDeltas = [];
var melodicBonus = 0;
//harmonic consonance
var harmonicDelta;
var harmonicBonus = 0;
//contour quality
var melodicConsonances = [];
var contourBonus = 0;
//variety
var yourGrid = [],            yourPreviousGrid = [],
    theirGrid = [];           //only used for inspection
var yourOriginalGrid = [],    //to be passed to the previous grid
    yourGridSum = 0,          yourPreviousGridSum = 0,
    yourGridValidLength = 0,  yourPreviousGridValidLength = 0,
    yourGridMean,             yourPreviousGridMean;
var validDeltas = 0,
    maxValidDeltas = 0,
    delta2 = 0,
    delta2sum = 0;
    maxDelta2sum = 0;
var variance = 0,
    varietyBonus = 0;
var breathing;


var win = false;
    lose = false;



// MIDI

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onSuccess, onFailure);
}
else
  console.log("WebMIDI not supported");

function onSuccess(midiAccess) {
  var inputs = midiAccess.inputs;
  if(inputs.size)
    document.querySelector("#playNotes").innerHTML = "Play notes on your computer keyboard or MIDI device";
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}
function onFailure() {
  console.log("MIDI access failed");
}


//  Options

//  Time variables
var tempo = 120 //[BPM]
var quarterNote = 60/tempo, //[s]
    tatum = quarterNote/8, //[s]  note quantized at 1/32
    lookahead = tatum,
    measure = 4 * quarterNote;
document.querySelector("#TempoInput").onchange = function() {
  tempo = Number(this.value);
  quarterNote = 60/tempo;
  tatum   = quarterNote/8;
  lookahead = tatum;
  measure = 4 * quarterNote;
}

//  Pitch variables
var pitch = 440 //[Hz]
document.querySelector("#PitchInput").onchange = function() {
  pitch = Number(this.value);
}

var keyMusic = 0;   //[0 to 6]
document.querySelector("#KeySelector").onchange = function() {
  keyMusic = Number(this.value);
}

var octave = 0; //[-1 to 1]
document.querySelector("#OctaveSelector").onchange = function() {
  octave = Number(this.value);
}

var mode = 0; //[0 to 6]
document.querySelector("#ModeSelector").onchange = function() {
  for(var k = 0; k < 7; k++) {
    if (document.querySelector("#ModeSelector").options[k].innerHTML[document.querySelector("#ModeSelector").options[k].innerHTML.length-1] == "*"){
      document.querySelector("#ModeSelector").options[k].innerHTML = document.querySelector("#ModeSelector").options[k].innerHTML.slice(0, -1);
    }
  }
  mode = Number(this.value);
  for (var i = 0; i < 7; i++) {
    modalSemitones[i] = (12 + ionianSemitones[(mode+i+7)%7]-ionianSemitones[mode])%12;
    modalSignature[i] = modalSemitones[i] - ionianSemitones[i];
    signature[i] = modalSignature[i];
    for (k = -1; k <2; k++) {
      if (k == modalSignature[i])
        document.querySelector("#SignatureSelector" + i).options[1-k].selected = true;
      else
        document.querySelector("#SignatureSelector" + i).options[1-k].selected = false;
    }
  }
  document.documentElement.style.setProperty('--hueRotate', colors[this.value]*51);
}

var tuning = 0; // 0: pythagorean; 1: 5-limit just intonation;  2: equal temperament;
document.querySelector("#TuningSelector").onchange = function() {
  tuning = Number(this.value);
}

var alteration = 0; // -1: flat; +1: sharp;
document.querySelector("#AlterationSelector").onchange = function() {
  alteration = Number(this.value);
}


var signature = new Array(7).fill(0);
document.querySelector("#SignatureSelector0").onchange = function() {
  signature[0] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector1").onchange = function() {
  signature[1] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector2").onchange = function() {
  signature[2] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector3").onchange = function() {
  signature[3] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector4").onchange = function() {
  signature[4] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector5").onchange = function() {
  signature[5] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}
document.querySelector("#SignatureSelector6").onchange = function() {
  signature[6] = Number(this.value);
  if (document.querySelector("#ModeSelector").options[mode].innerHTML[document.querySelector("#ModeSelector").options[mode].innerHTML.length-1] != "*")
    document.querySelector("#ModeSelector").options[mode].innerHTML += "*";
}

var interval = 0;
document.querySelector("#intervalSelector").onchange = function() {
  interval = Number(this.value);
}

var proportion = 1;
document.querySelector("#proportionInput").onchange = function() {
  proportion = Number(this.value);
}

var sign = 1;
document.querySelector("#signSelector").onchange = function() {
  sign = Number(this.value);
  document.documentElement.style.setProperty('--inversion', this.value);
}

var reversal = 1;
document.querySelector("#reversalSelector").onchange = function() {
  reversal = Number(this.value);
}

var metronome = false;
document.querySelector("#metronomeSelector").onchange = function() {
  metronome = !metronome;
}



//Game interface

//1. First page is the introduction. Upon clicking I MAY, it loads the second page.
document.querySelector("#Imay").addEventListener("click", function() {
  //Move on to the next page
  document.querySelector("#introduction").classList.toggle("displayNone");
  document.querySelector("#chooseParrot").classList.toggle("displayNone");
  document.querySelectorAll("#mugshots > canvas").forEach(function(item, index) {
    var mugshotContext = item.getContext("2d");
    var mugshot = new Image();
    mugshot.src = silentParrots[index];
    setTimeout(()=>mugshotContext.drawImage(mugshot, -280, -30), 200);


  });
});

//2. Second page allows for parrot selection.
document.querySelectorAll("#mugshots > canvas").forEach(function(item, index) {
  item.addEventListener("click", function() {
    parrotIndex = index;
    you.src = silentParrots[parrotIndex];
    they.src = silentParrots[parrotIndex];

    document.querySelector("#chooseParrot").classList.toggle("displayNone");
    document.querySelector("#keyboard-start").classList.toggle("displayNone");
    document.querySelector("#control").classList.toggle("displayNone");
    keyboardOn = true;
  });
});

// 3. Third page displays an interface of the keyboard, and lets the user practice and determine musical options.

document.querySelector("#start").onclick = function() {
  document.querySelector("#keyboard-start").classList.toggle("displayNone");

  document.querySelector("#composers").classList.toggle("displayNone");

  bellini.src = happyComposers[0];
  setTimeout(()=>belliniContext.drawImage(bellini, 0, 0), 200);
  verdi.src = happyComposers[1];
  setTimeout(()=>verdiContext.drawImage(verdi, 0, 0), 200);
  rossini.src = happyComposers[2];
  setTimeout(()=>rossiniContext.drawImage(rossini, 0, 0), 200);
  donizetti.src = happyComposers[3];
  setTimeout(()=>donizettiContext.drawImage(donizetti, 0, 0), 200);

  document.querySelector("#screen").classList.toggle("displayNone");
  gameIsOn = true;

  yourContext.drawImage(you, yourX, yourY);
  theirContext.drawImage(they, theirX, theirY);
}


// 4. The fourth page is where the actual game takes place.
