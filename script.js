let seconds = 0;
let timerInterval = null;

document.getElementById('startBtn').addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').innerText = seconds + "s";
    }, 1000);
});