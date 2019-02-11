//	Time variables
var tempo = 120 //[BPM]
var quarterNote	= 60/tempo, //[s]
	  tatum = quarterNote/8, //[s]	note quantized at 1/32
    lookahead = tatum,
    measure = 4 * quarterNote;
document.querySelector("#TempoInput").onchange = function() {
  tempo = Number(this.value);
  quarterNote	= 60/tempo;
  tatum		= quarterNote/8;
  lookahead = tatum;
  measure = 4 * quarterNote;
}

//	Pitch variables
var pitch = 440 //[Hz]
document.querySelector("#PitchInput").onchange = function() {
  pitch = Number(this.value);
}

var keyMusic = 0; 	//[0 to 6]
document.querySelector("#KeySelector").onchange = function() {
  keyMusic = Number(this.value);
}

var octave = 0; //[-1 to 1]
document.querySelector("#OctaveSelector").onchange = function() {
  octave = Number(this.value);
}

var mode = 0;	//[0 to 6]
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
  document.documentElement.style.setProperty('--hueRotate', this.value*51);
}

var tuning = 0; // 0: JUST;  1: EQUAL;
document.querySelector("#TuningSelector").onchange = function() {
  tuning = Number(this.value);
}

var alteration = 0;
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