window.onload = () => console.log("Greetings fellow robots!");

var audio = new Audio("workbench.mp3");
audio.loop = true;

function toggleAudio() {
    if (audio.paused) {
        audio.currentTime = 0;
        console.log("Starting audio");
        audio.play();
    }
    else {
        console.log("Unstarting audio");
        audio.pause();
    }
}

function randomizeBackground() {
    let r = randomColorValue();
    let g = randomColorValue();
    let b = randomColorValue();
    let val = `rgb(${r},${g},${b})`;
    console.log(`Randomizing background to ${val}`);
    document.body.style.background = val;
}

function randomColorValue() {
    return Math.floor(Math.random() * 256);
}