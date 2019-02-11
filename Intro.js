/*
  Tommaso Sciotto
  10325866/914844
    "Fuity"
  Advanced Coding Tools and Methodologies
  Computer Music - Representations and Models
  06/02/2019
*/

//NOTE: this file is only used as the source for the narrator voice in the trailer.

var voices = window.speechSynthesis.getVoices();
var utterance = new SpeechSynthesisUtterance();
utterance.voice = voices[6];

utterance.text = "";
speechSynthesis.speak(utterance);

/*
"You are a parrot. All by yourself in some sort of peaceful, eerie wilderness."
"Silence is thick and you burst into singing, although it seems you've never tried before."
"Such careless attitude attracts an individual of your kind."
"Now, how should they respond? As any parrot would: by imitating."
"Perhaps they mock you, perhaps they show some interest."
"If you take the right steps, and you learn to listen, and you are consistent, and you don't get boring,"
"Whatever game it is, you're going to make this a game for two."
*/
