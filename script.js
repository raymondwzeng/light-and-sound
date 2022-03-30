//Global variables
var easterEggs = new Map();
easterEggs.set("Mario", [2, 2, 2, 1, 2, 3]);

var currEasterEggs = new Map(); //A container for currently matching easter egg codes. This is needed because mutltiple easter eggs may begin with the same tone. Non-matching entries would then be removed.

var easterEggProgress = 0;

var pattern = [5, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;

var tonePlaying = false;
var volume = 0.5;

var clueHoldTime = 1000;
var cluePauseTime = 333;
var nextClueWaitTime = 1000;

var guessCounter = 0;

function playEasterEgg(easterEggName) {
  if(easterEggName == "Mario") {
    console.log("Wahoo!");
    document.getElementById("github_logo").src = "https://cdn.glitch.global/3f2d6dc2-b99b-4f94-935a-476eeb1f9ed4/mario_idle.png?v=1648665575206";
    setTimeout(() => {
    document.getElementById("github_logo").src = "https://cdn.glitch.global/3f2d6dc2-b99b-4f94-935a-476eeb1f9ed4/GitHub-Mark-120px-plus.png?v=1648666680733" 
    }, 1000)
  }
}

function startGame() {
  progress = 0;
  gamePlaying = true;
  
  //Generate a random pattern of size 8 to pattern.
  var i;
  for(i = 0; i < 9; i++) { //Random generation algorithm from MDN documentation on Math.random(), URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    pattern[i] = Math.floor(Math.random() * (6 - 1) + 1);
  }
  
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
  let delay = nextClueWaitTime;
  for(let i = 0; i <= progress; i++) {
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
  } else {
    //Iterate through the map for easter eggs.
    for(const [key, value] of easterEggs.entries()) {
      var foundMatch = false;
      if(value[easterEggProgress] == btnIndex) {
        currEasterEggs.set(key, value);
        foundMatch = true;
      } else {
        if(currEasterEggs.get(key)) {
          currEasterEggs.delete(key);
        }
      }
    }
    if(foundMatch) {
      easterEggProgress++;
    } else {
      easterEggProgress = 0;
    }
    for(const [key, value] of currEasterEggs.entries()) {
      if(easterEggProgress == value.length) {
        console.log("Playing easter egg with name", key);
        playEasterEgg(key);
        currEasterEggs.clear();
        easterEggProgress = 0;
      }
    }
    console.log(currEasterEggs, " progress", easterEggProgress);
  }
}

function adjustVolume(volumeAmount) {
  volume = volumeAmount.target.value;
}

document.getElementById("volume").addEventListener("change", adjustVolume);

function loseGame() {
  stopGame();
  alert("Game over! You lost. Final score: " + progress);
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
  4: 466.2,
  5: 523.2
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