/*
  Tommaso Sciotto
  10325866/914844
    "Fuity"
  Advanced Coding Tools and Methodologies
  Computer Music - Representations and Models
  06/02/2019
*/


function note(value, etc){
	this.value = value;
  var rectifiedValue = this.value;
  var offsetSemitones = 0;
  while(rectifiedValue < 0) {
    rectifiedValue += 7;
    offsetSemitones -= 12;
  }
  this.semitones = offsetSemitones + 12*Math.floor(rectifiedValue/7) + ionianSemitones[rectifiedValue%7] + signature[rectifiedValue%7];
	this.frequency = calculateTone(this.value);
  
	this.startTime = quantize(c.currentTime);
	this.duration  = tatum;

	this.audio = new audioNote(this);

	this.transformValue = function() {
		this.value = interval + sign * Math.round(proportion * this.value);
    rectifiedValue = this.value;
    offsetSemitones = 0;
    while(rectifiedValue < 0) {
      rectifiedValue += 7;
      offsetSemitones -= 12;
    }
    this.semitones = offsetSemitones + 12*Math.floor(rectifiedValue/7) + ionianSemitones[rectifiedValue%7] + signature[rectifiedValue%7];
		this.frequency = calculateTone(this.value);
		this.audio = new audioNote(this);
	}
}

note.prototype.delay = function() {
  this.startTime += measure;
}




function audioNote(note) {
  this.o = c.createOscillator();
  this.o.type = waveform;
  this.g = c.createGain();
  this.o.connect(this.g);
  this.g.connect(c.destination);
  this.o.frequency.value = note.frequency;
  this.g.gain.value = 0.0;
}
//.attack and .release are used for direct playback
audioNote.prototype.attack = function() {
  this.o.start();
  this.g.gain.linearRampToValueAtTime(0.3, c.currentTime + tatum/3);
}
audioNote.prototype.release = function() {
  this.g.gain.linearRampToValueAtTime(0, c.currentTime + tatum/3);
  setTimeout(()=>this.o.stop(), 1000*tatum/3);
}
//.play is used for scheduled playback
play = function(note) {
  note.audio.o.start(note.startTime, 0, note.duration);
  note.audio.g.gain.setValueCurveAtTime([0, 0.3], note.startTime, tatum/3);
  note.audio.g.gain.setValueCurveAtTime([0.3, 0], note.startTime + note.duration - tatum/3, tatum/3);
}



function calculateTone(value) {
  var index = value;
  var transpose = 0;
  
  while (index < 0) {
    index += 7;
    transpose--;
  }

  while (index >= keys.length) {
    index -= 7;
    transpose++;
  }

  tone = pitch *                                                                            //  PITCH OF A4
         scaleRatios[keyMusic][tuning]/scaleRatios[5][tuning] *                             //  RATIO BETWEEN THE KEY AND A
         scaleRatios[(index + mode)%7][tuning] / scaleRatios[mode][tuning] *	              //  NOTE IN THE MODAL SCALE
         limmas[tuning]**(alteration + signature[(index)%7] - modalSignature[(index)%7]) *  //  GLOBAL AND NET SIGNATURE ALTERATIONS
         2**(octave + transpose + Math.floor((index + mode)/7));                            //  NOTE OCTAVE TRANSPOSE
  return tone;
}



 function quantize(time) {
   return(Math.ceil(time/tatum)*tatum);
 }


function tick(tickTime) {
  var o = c.createOscillator();
  o.type = 'square';
  var g = c.createGain();
  o.connect(g);
  g.connect(c.destination);
  o.frequency.value = 1;
  g.gain.value = 0.2;
  o.start(tickTime, 0, 0.01);
  g.gain.setValueCurveAtTime([0.2, 0], tickTime, 0.01);
}



function check() {

  if (win) {
    yourX -= 2;
    theirX += 2;
    backgroundContext.fillStyle = 'rgba(0,0,0,0.01)';
    backgroundContext.fillRect(0,0,930,390);
  }
  else if (lose) {
    backgroundContext.fillStyle = 'rgba(0,0,0,0.01)';
    backgroundContext.fillRect(0,0,930,390);
  }
  else {
  
    //metronome
    if (nextTickTime < c.currentTime + lookahead) {
      if(metronome) 
          tick(nextTickTime);
        nextTickTime += quarterNote;
      }
  
    //Sustain
    while(yourNoteOn &&
        yourNote.startTime + yourNote.duration < c.currentTime) {
      yourNote.duration += tatum;
      theirNote.duration += tatum;
    }
  
    //Update melodies and parrot images
  
      //Action based on your behavior
      if (yourNoteOn) {                                       //if you're playing,
        yourGrid.push(yourNote.semitones);                    //since you are singing, your note semitone value is stored in the grid
      }
      else {                                                  //if you're not playing,
        yourGrid.push(NaN);                                   //since you are not singing, a NaN value is stored in the grid
      }
  
    //Action based on their behavior
    if (theirMelody.length > 0 &&                           //if they have started singing
      theirIndex < theirMelody.length) {                    //and they have not sung all their notes yet
  
      if (theirMelody[theirIndex].startTime + theirMelody[theirIndex].duration <= c.currentTime) { //if they are not singing at the moment
        they.src = silentParrots[parrotIndex]               //use a silent parrot image
        theirIndex ++;                                      //they point to the next note, or wait for it
      }
  
      if (theirIndex < theirMelody.length &&                //(theirIndex may have been increased, so the condition must be posed again)
        theirMelody[theirIndex].startTime <= c.currentTime + lookahead) { //if they are singing at the moment (due to shorting at line 137)
        if (playedIndex < theirIndex){                      //if playback hasn't been activated for the current note
          play(theirMelody[theirIndex]);                    //activate it
          playedIndex++;                                    //and point to the next note, or wait for it
        }
        they.src = singingParrots[parrotIndex];             //use a singing parrot image
        theirY = y0 - 3*(theirMelody[theirIndex].value - interval);  //translate their parrot as a function of pitch (rectified wrt the canon interval)
        theirGrid.push(theirMelody[theirIndex].semitones);  //since they are singing, their semitone value is stored in the grid
  
        if (yourNoteOn) {                                   //if you're singing too
          harmonicDelta = Math.abs(theirMelody[theirIndex].semitones - yourNote.semitones)%12;  //consider the minimal absolute distance in semitones between the two voices
          switch (harmonicDelta) {      //based on the distance, evaluate consonance/dissonance
            case 0:                     //unison/octave would give perfect consonance, but they are unappealing in this context
              harmonicBonus += 1;     //Therefore, they are deliberately treated as imperfect consonance
              break;
            case 3: case 4:             //m/M III 
            case 7: case 8: case 9:     //perfect V, m/M VI
              harmonicBonus += 2;       //III, VI would give imperfect consonance, but they are harmonically appealing, therefore they are treated as perfect consonance
              break;
            default:
              harmonicBonus += -2;      //All other cases are deemed dissonant.
          }
          if (harmonicBonus > 0)
            verdi.src = happyComposers[1];
          else
            verdi.src = sadComposers[1];
        }
      }
        else  //since they are not singing, a NaN value is stored in the grid
      theirGrid.push(NaN);
    }
    else  //since they are not singing, a NaN value is stored in the grid
      theirGrid.push(NaN);
  

  
    //Measure check
    if (nextMeasureTime < (c.currentTime + lookahead)) {                  //if we are approaching the next measure
      
      harmonicBonus = Math.round(harmonicBonus)
  
      //Calculate variety
      //console.log("yourGrid", yourGrid)
      //console.log("yourPreviousGrid ", yourPreviousGrid)
  
      yourOriginalGrid = [];                                              //yourGrid is stored for later access by yourPreviousGrid
      for (k = 0; k < yourGrid.length; k++)
      yourOriginalGrid[k] = yourGrid[k];                               
  
      //uniform grid length
      if (yourGrid.length < yourPreviousGrid.length)
        yourPreviousGrid = yourPreviousGrid.slice(0, yourGrid.length);
      else if (yourPreviousGrid.length < yourGrid.length)
        yourGrid = yourGrid.slice(0, yourPreviousGrid.length);
  
      //rectify grids with respect to their mean
      if(yourGrid.length > 0) {
        for (var k = 0; k < yourGrid.length; k++) {
          if (!isNaN(yourGrid[k])) {
            yourGridSum += yourGrid[k];
            yourGridValidLength++;
          }
          if (!isNaN(yourPreviousGrid[k])) {
            yourPreviousGridSum += yourPreviousGrid[k];
            yourPreviousGridValidLength++;
          }
        }
        yourGridMean = Math.round(yourGridSum/yourGridValidLength);
        yourPreviousGridMean = Math.round(yourPreviousGridSum/yourPreviousGridValidLength);
        //console.log("yourGridMean ", yourGridMean)
        //console.log("yourPreviousGridMean", yourPreviousGridMean)
        for (var k = 0; k < yourGrid.length; k++)
          yourGrid[k] -= yourGridMean;
        for (var k = 0; k < yourPreviousGrid.length; k++)
          yourPreviousGrid[k] -= yourPreviousGridMean;
      }
      //console.log("MODIFIED")
      //console.log("yourGrid", yourGrid)
      //console.log("yourPreviousGrid ", yourPreviousGrid)
  
      
      validDeltas = 0;
      maxValidDeltas = 0;
      delta2 = 0;
      delta2sum = 0;
      minDelta2sum = 0;
      for (var k = 0; k < yourGrid.length; k++) {
        for (var i = 0; i < yourGrid.length; i++) {
          delta2 = (yourGrid[i]-yourPreviousGrid[(i+k)%yourGrid.length])**2;
          if (!isNaN(delta2)) {
            validDeltas++;
            delta2sum += delta2;
          }
        }
        if(validDeltas > maxValidDeltas) {
          maxValidDeltas = validDeltas;
          minDelta2sum = delta2sum;
        }
        else if (validDeltas == maxValidDeltas && delta2sum < minDelta2sum) {
          minDelta2sum = delta2sum;
        }
      }
      console.log("delta2sum = ", delta2sum, "; maxValidDeltas - 1 = ", maxValidDeltas)
      variance = delta2sum/Math.abs(maxValidDeltas-1);

      if (!isNaN(variance) && variance > 10)
        donizetti.src = happyComposers[3];
      else
        donizetti.src = sadComposers[3];
      
      yourPreviousGrid = [];    //yourGrid is stored for later access by yourPreviousGrid
      for (k = 0; k < yourOriginalGrid.length; k++)
        yourPreviousGrid[k] = yourOriginalGrid[k];  
      yourGrid = [];
      theirGrid = [];
      console.log("_________________________________________________________________") //      
  
      
      console.log("melodicBonus ", melodicBonus)
      console.log("harmonicBonus ", harmonicBonus)
      console.log("contourBonus ", contourBonus)
      console.log("variance = ", variance)
      
      bonus = melodicBonus + harmonicBonus + contourBonus;
  
      console.log("pre-variance bonus ", bonus);
      bonus = Math.round(bonus*(variance**(1/2))/10);
      console.log("post-variance bonus ", bonus);
  
      score += bonus;
      console.log("score ", score)
  
      melodicBonus = 0;
      harmonicBonus = 0;
      contourBonus = 0;
      
      if (score > threshold) {
        measure -= quarterNote;
        while(score > threshold)
          score -= threshold;
        //console.log("rectified score ", score)
        theirXtarget = theirX + 160;
      }
      else if (score < -threshold) {
        measure += quarterNote;
        while(score < -threshold)
          score += threshold;
        theirXtarget = theirX - 160;
      }
      
      if (measure == 0)
        win = true;
  
      if (measure > 4 * quarterNote)
        lose = true;

  
      while(theirBuffer.length > 0) {
        if (reversal == -1) {
          if (theirBuffer[theirBuffer.length-1].startTime >= nextMeasureTime - measure){
            theirBuffer[theirBuffer.length-1].startTime = 2*nextMeasureTime - (theirBuffer[theirBuffer.length-1].startTime + theirBuffer[theirBuffer.length-1].duration);
            theirMelody.push(theirBuffer[theirBuffer.length-1]);
          }
          theirBuffer.pop();
        }
        else {
          theirBuffer[0].startTime += measure;
          if (theirBuffer[0].startTime >= nextMeasureTime) {
            theirMelody.push(theirBuffer[0]);
          }
          theirBuffer.shift();
        }
      }
      nextMeasureTime += measure;
    }
  }

  if (yourNoteOn) {
    you.src = singingParrots[parrotIndex];                //use a singing parrot image
    yourY = y0 -  3*(yourNote.value);                     //translate your parrot as a function of pitch
  }
  else
    you.src = silentParrots[parrotIndex];                 //use a silent parrot image

  if (win) {
    bellini.src = happyComposers[0];
    verdi.src = happyComposers[1];
    rossini.src = happyComposers[2];
    donizetti.src = happyComposers[3];

    if (theirX < theirXtarget)
      theirX += 10;
  }
  else if (lose) {
    bellini.src = sadComposers[0];
    verdi.src = sadComposers[1];
    rossini.src = sadComposers[2];
    donizetti.src = sadComposers[3];

    theirX--;
  }
  else {
    if(theirX < theirXtarget)
      theirX+= 10;
    else if (theirX > theirXtarget)
      theirX-= 10;
  }

  yourContext.clearRect(0, 0, yourCanvas.width, yourCanvas.height);     //clear your canvas
  yourContext.drawImage(you, yourX, yourY);                             //draw your parrot
  theirContext.clearRect(0, 0, theirCanvas.width, theirCanvas.height);  //clear their canvas
  theirContext.drawImage(they, theirX, theirY);                         //draw their parrot

  belliniContext.drawImage(bellini, 0, 0)
  verdiContext.drawImage(verdi, 0, 0);
  rossiniContext.drawImage(rossini, 0, 0)
  donizettiContext.drawImage(donizetti, 0, 0);

  if(gameIsOn) {
    requestAnimationFrame(check);
  }
}