# Fuity
a game of chants

Tommaso Sciotto
10325866 - 914844
Advanced Coding Tools and Methodologies
Computer Music - Representations and Models

Fuity consists in a music game revolving around two singing parrots.
It is intended to improve one’s ability to create a catchy tune.
One parrot is controlled by the user, the other by the computer. The user plays a melody: after a measure, the computer responds with an imitation of it, in the form of a canon.
Based on the quality of the user’s melody, and its interaction with the computer generated one, the other parrot is either attracted or repelled.
The goal of the game is to have the two parrots to kiss and flee together.

The canon is a contrapuntal technique in which a melody acts as a subject (leader), to which one or more other voices respond, after a certain time, by imitation (follower).
The imitation may be at the unison, or at a given interval (e.g. canon at the III).
The imitation motion may be parallel, preserving the original intervals, or similar, scaling them by some factor.
The canon may be inverse, in that all intervals are the vertical mirror image of those in the original melody, and it may be backwards, in that the mirroring is performed horizontally in time. 
Other constraints are available, but not implemented in the current version of the game.
By definition, the game is based on canon in two voices.

The user may choose between three tuning systems: pythagorean tuning, in which frequency ratios are composed of powers of 2 and 3; 5-limit just intonation, which extends pythagorean tuning to powers of 5; equal temperament, in which frequency ratios are expressed as powers of the 12-th root of 2.

The user may select a tonal reference (by means of key, octave and alteration) and a modal scale; they may also intervene directly on the signature. The resulting scale, spanning across two octaves, is invariantly mapped over the computer keyboard or a parallel MIDI device.

The temporal scan is dynamic and may be changed in real time.
A metronome option is available.

At the beginning of the game, the counter-chant responds after a 4/4 measure.
At every measure, the performance is evaluated and, based on the score, the follower parrot may move towards or away from the leader, thus shortening or extending the measure by a quarter note.
When the measure is reduced to zero, the user wins, and the two chants are parallel and detached from rhythm.
When the follower moves further back from the initial position, the user loses and is left singing alone.



Technical aspects:

The current version of the game is implemented as an HTML5 page, relying on a CSS stylesheet and JavaScript scripts.
Notes are objects characterized by a diatonic and a chromatic value, a start time, a duration and an audio object.
Audio objects rely on the Web Audio API, and comprise an oscillator node, a gain node and scheduling values and functions.
Imitation notes are transformed by means of an offset interval, a scaling module and a sign.
Melodies are stored as arrays of notes. The imitation is first stored in a measure-long buffer; at every measure, the score is evaluated, the buffer is reformatted (shortened, extended, reversed) and added to the follower melody.
Melodic consonance and contour constraints are evaluated, limited to the user melody, at every new note.
Harmonic consonance is evaluated at every tatum (1/32), only if both voices are present.
Variety is evaluated at every measure, and compares the current measure with the previous: two temporal scans are created as note value arrays with tatum resolution; the previous measure is rolled over the current, and a third array stores the differences between values corresponding to the same time; variety is expressed as the minimum standard deviation of differences for the translation that produces the largest sample.



Issues:

JavaScript events rely on an unstable clock for performing and scheduling tasks, in that these tasks systematically skew the time scan.
The Web Audio API, on the other hand, relies on a highly precise clock (the audio context current time).
In the current implementation of the game, all time based tasks are comprised in a single function, invoked at the animation rate of the browser. Since this scan is unstable, the function has a lookahead (set to a tatum), within which it performes all forecoming events, so as not to skip them as the two clocks drift apart.
This implementation, though, it stable only for tempos up to 128 BPM, and only if few game constraints are selected.
The current code needs reformatting, and likely a worker-based implementation so as to distribute conflicting functions to as many separate threads as possible.



Evolution:

Upon fixing synchronization issues, future updates will include:
  - more contrapuntal options (free/fixed canon, mensural canon, second species counterpoint, difference canon);
  - real time accidents and option keyboard shortcuts;
  - improved animation and user interface;
  - more complex game dynamics, possibly involving more than two voices and more than one player;
  - a save option for encoding the performance as a .midi or an .mp3 file.

