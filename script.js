//Global variables
const e_egg1 = [2, 2, 2, 1, 2, 3]; //Mario

var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;

var tonePlaying = false;
var volume = 0.5;

var clueHoldTime = 1000;
var cluePauseTime = 333;
var nextClueWaitTime = 1000;

var guessCounter = 0;

function startGame() {
  progress = 0;
  gamePlaying = true;
  
  //Swap the start and stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  
  //Replace the stop with start button again
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btnIndex) {
  document.getElementById("button"+btnIndex).classList.add("lit");
}

function clearButton(btnIndex) {
  document.getElementById("button"+btnIndex).classList.remove("lit");
}

function playSingleClue(btnIndex) {
  if(gamePlaying) {
    lightButton(btnIndex);
    playTone(btnIndex, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btnIndex);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  clueHoldTime = Math.exp(-2*progress/40) * 1000; //Make the game harder as you progress
  console.log("New time:",clueHoldTime);
  let delay = nextClueWaitTime;
  for(let i = 0; i <= progress; i++) {
    console.log("Playing single clue", pattern[i], "in", delay, "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btnIndex) {
  console.log("User guess:", btnIndex);
  startTone(btnIndex);
  if(gamePlaying) {
    //First check if the guess aligns with the expected button.
    if(btnIndex === pattern[guessCounter]) {
      if(guessCounter < progress) {
        guessCounter++; //Progress along the pattern
      } else { 
        if(progress < pattern.length-1) {
          progress++;
          playClueSequence(); //Play next sequence
        } else {
          winGame();
        }
      }
    } else { //Lose the game if they guess wrong
      loseGame();
    }
  }
}

function adjustVolume(volumeAmount) {
  console.log("Changing volume to", volumeAmount.target.value);
  volume = volumeAmount.target.value;
}

document.getElementById("volume").addEventListener("change", adjustVolume);

function loseGame() {
  stopGame();
  alert("Game over! You lost.");
}

function winGame() {
  stopGame();
  alert("Game over! You won!");
}


/*
  The following sections are provided directly for copy-paste from the SITE pre-work section.
*/
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)