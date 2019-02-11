/*
  Tommaso Sciotto
  10325866/914844
    "Fuity"
  Advanced Coding Tools and Methodologies
  Computer Music - Representations and Models
  06/02/2019
*/

function keyDownHandler(key) {
  if (keyboardOn) {
   
    //Conclude current note
    if (yourNoteOn) {
      yourNote.audio.release();
      if (win) {
        theirNote.audio.release();
        console.log("tried release")
        they.src = silentParrots[parrotIndex];
      }

      if (!gameIsOn) {
      document.getElementById(playedKey).classList.remove("playing");
      document.getElementById(playedKey).innerHTML = playedKey;
      }
    }

    //Create new note
    yourNote = new note(keys.indexOf(key));
    yourNote.audio.attack();
    yourNoteOn = true;

    if (gameIsOn && silentUntilNow) {
      gameStartTime = c.currentTime;
      silentUntilNow = false;

      nextMeasureTime = gameStartTime + measure;

      nextTickTime = gameStartTime + quarterNote;

      check();

    }

    if(win) {
      theirNote = new note(keys.indexOf(key));
      theirNote.transformValue();
      theirNote.audio.attack();
      they.src = singingParrots[parrotIndex];
      theirY = y0 - 3*(theirNote.value - interval);
    }
    else {
      if (gameIsOn) {
        yourMelody.push(yourNote);
        if (yourMelody.length > 1) {
  
          //Evaluate melodic consonance
          melodicDeltas.push(yourMelody[yourMelody.length-1].semitones - yourMelody[yourMelody.length-2].semitones);
          if (melodicDeltas[melodicDeltas.length-1] == 0){
            melodicBonus--;
            bellini.src = sadComposers[0];
            melodicConsonances.push(false);
          }
          else if (Math.abs(melodicDeltas[melodicDeltas.length-1]) < 6 ||
                   Math.abs(melodicDeltas[melodicDeltas.length-1]) == 7 ||
                   melodicDeltas[melodicDeltas.length-1] == 8) {
            melodicBonus += 2;
            bellini.src = happyComposers[0];
            melodicConsonances.push(true);
          }
          else {
            melodicBonus -= 2;
            bellini.src = sadComposers[0];
            melodicConsonances.push(false);
          }
  
          //Evaluate contour
          if (melodicDeltas.length > 1){
            if ((melodicConsonances[0] && melodicConsonances[1]) &&     //both intervals are consonant
                  ((melodicDeltas[melodicDeltas.length-2] == 7 && melodicDeltas[melodicDeltas.length-1] == 5)||             //they split an octave in V/IV
                   (melodicDeltas[melodicDeltas.length-2] == -5 && melodicDeltas[melodicDeltas.length-1] == -7) ||
                   (Math.abs(melodicDeltas[melodicDeltas.length-2]) < 5 && Math.abs(melodicDeltas[melodicDeltas.length-1]) < 5) || //both intervals are smaller than a perfect fourth
                   ((melodicDeltas[melodicDeltas.length-2] == 3 || melodicDeltas[melodicDeltas.length-2] == 4) && melodicDeltas[melodicDeltas.length-1] == 5) || //they create a III/IV pattern
                   (melodicDeltas[melodicDeltas.length-2] > 2 && (melodicDeltas[melodicDeltas.length-2] == -1 || melodicDeltas[melodicDeltas.length-2] == -2) || //leap up followed by step down
                   (melodicDeltas[melodicDeltas.length-2] < -2 && (melodicDeltas[melodicDeltas.length-2] == 1 || melodicDeltas[melodicDeltas.length-2] == 2))))) { //leap down followed by step up
              contourBonus++;
              rossini.src = happyComposers[2];
            }
            else {
              contourBonus--;
              rossini.src = sadComposers[2];
            }
  
          melodicConsonances.shift(); //for contour evaluation, only the last two consonances are needed
          }
        }
  
        theirNote = new note(yourNote.value);
        theirNote.transformValue();
        theirBuffer.push(theirNote);
      }
      else {
        playedKey = key.toUpperCase();
        document.getElementById(playedKey).classList.add("playing");
        document.getElementById(playedKey).innerHTML = romanNumbers[keys.indexOf(key)];
      }
    }
  }
}

function keyUpHandler(key) {
  if (keyboardOn) {
    yourNote.audio.release();

    yourNoteOn = false;
    if (gameIsOn) {
      if (win) {
        theirNote.audio.release();

        they.src = silentParrots[parrotIndex];
      }
      
    }
    else {
      document.getElementById(playedKey).classList.remove("playing");
      document.getElementById(playedKey).innerHTML = playedKey;
    }
  }
}




//Key reading

//Computer Keyboard

document.onkeydown = function(e) {
  if (validKeyDown(e, yourNote, yourNoteOn))
    keyDownHandler(e.key);
}
function validKeyDown(event, note, yourNoteOn) {
  key = event.key.toLowerCase();
  return(keys.includes(key) &&
         !event.repeat &&
        (!yourNoteOn ||
        note.value != keys.indexOf(key)))
}

document.onkeyup = function(e) {
    if (validKeyUp(e, yourNote))
    keyUpHandler(e.key);
}
function validKeyUp(event, note) {
  key = event.key.toLowerCase();
  return(keys.includes(key) &&
         note != null &&
         keys.indexOf(key) == note.value)
}



function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = 0;
  if (message.data.length > 2)
    velocity = message.data[2];
   if (MIDInotes.includes(note)) {
    if (command == 144 && velocity > 0) {
      playedMIDInote = note;
      var key = keys[MIDInotes.indexOf(note)];
      keyDownHandler(key);
    }
    else if ((command == 128 ||
             command == 144) &&
             note == playedMIDInote){
      var key = keys[MIDInotes.indexOf(note)];
      keyUpHandler(key);
    }
  }
}