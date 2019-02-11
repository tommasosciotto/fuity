var voices = window.speechSynthesis.getVoices();
var utterance = new SpeechSynthesisUtterance();
utterance.voice = voices[6];

utterance.text = "Such careless attitude attracts an individual of your kind.";
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


/*

"You are a parrot, all by yourself in some sort of peaceful, eerie wilderness."
"Silence is thick and you burst into singing, although it seems you've never tried before."
"Such careless attitude attracts an individual of your kind."
"How should they respond? As any parrot would: by imitating."
"Perhaps they mock you, perhaps they show some interest.""
"And if you take the right steps, and you learn to listen, and you try being consistent, and you don't get boring,"
"You're going to make this a game for two."

*/