let seconds = 0;
let timerInterval = null;

function updateDisplay() {
    document.getElementById('timer').innerText = seconds + "s";
    const size = 20 + seconds; 
    document.getElementById('plant').style.width = size + "px";
    document.getElementById('plant').style.height = size + "px";
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (timerInterval) return;
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