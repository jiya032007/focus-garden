let seconds = 0;
let timerInterval = null;

function updateDisplay() {
    document.getElementById('timer').innerText = seconds + "s";
    const size = Math.min(20 + seconds * 0.1, 200); 
    document.getElementById('plant').style.width = size + "px";
    document.getElementById('plant').style.height = size + "px";

    let stage = "Sprout";
    if (seconds > 60) stage = "Growing";
    if (seconds > 300) stage = "Blooming";
    document.getElementById('stage').innerText = stage;
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (timerInterval) return;
    document.getElementById('stage').style.animation = 'none';
    document.getElementById('stage').offsetHeight;
    document.getElementById('stage').style.animation = 'popIn 0.4s ease forwards';
    timerInterval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateDisplay();
});