// Focus Garden project
let seconds = 0;
let timerInterval = null;

function updateDisplay() {
    document.getElementById('timer').innerText = seconds + "s";
    const size = Math.min(20 + seconds * 0.06, 200); 
    document.getElementById('plant').style.width = size + "px";
    document.getElementById('plant').style.height = size + "px";

   let stage = "Sprout";
if (seconds > 900) stage = "Growing";
if (seconds > 2700) stage = "Blooming";
document.getElementById('stage').innerText = stage;

    if (seconds > 900) {
    document.getElementById('plant').classList.add('grown');
} else {
    document.getElementById('plant').classList.remove('grown');
}
document.body.classList.remove('stage-growing', 'stage-blooming');
if (seconds > 900) document.body.classList.add('stage-growing');
if (seconds > 2700) document.body.classList.add('stage-blooming');

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