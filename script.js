// Focus Garden project
const startSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
let seconds = 0;
let timerInterval = null;
let startTime = null;
let continuousStart = null;
let tabSwitchCount = 0;
let currentMode = 'strict';

function updateDisplay() {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const display = (hrs > 0 ? hrs + ":" : "") + mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
    document.getElementById('timer').innerText = display;

    const size = Math.min(60 + seconds * 0.06, 200);
    document.getElementById('plant-svg').style.width = size + "px";
    document.getElementById('plant-svg').style.height = size + "px";

    let stage = "Sprout";
    if (seconds > 900) stage = "Growing";
    if (seconds > 2700) stage = "Blooming";
    document.getElementById('stage').innerText = stage;

    if (seconds > 900) {
        document.getElementById('plant-wrapper').classList.add('grown');
    } else {
        document.getElementById('plant-wrapper').classList.remove('grown');
    }

    document.body.classList.remove('stage-growing', 'stage-blooming');
    if (seconds > 900) document.body.classList.add('stage-growing');
    if (seconds > 2700) document.body.classList.add('stage-blooming');

    if (seconds > 2700) {
        document.getElementById('plant-svg').style.display = 'none';
        document.getElementById('flower-svg').style.display = 'block';
    } else {
        document.getElementById('plant-svg').style.display = 'block';
        document.getElementById('flower-svg').style.display = 'none';
    }
}

function recordTodayUsage() {
    const today = new Date().toDateString();
    let usedDays = JSON.parse(localStorage.getItem('usedDays')) || [];
    if (!usedDays.includes(today)) {
        usedDays.push(today);
        localStorage.setItem('usedDays', JSON.stringify(usedDays));
    }
}

function calculateStreak() {
    let usedDays = JSON.parse(localStorage.getItem('usedDays')) || [];
    if (usedDays.length === 0) return 0;

    let dates = usedDays.map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
        let diffDays = Math.round((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function updateStreakDisplay() {
    const streak = calculateStreak();
    document.getElementById('streakDisplay').innerText = "🔥 " + streak + " day streak";
}

function getTotalMinutes() {
    let dailyMinutes = JSON.parse(localStorage.getItem('dailyMinutes')) || {};
    return Object.values(dailyMinutes).reduce((sum, mins) => sum + mins, 0);
}

function updateTodayTotal() {
    const today = new Date().toDateString();
    let dailyMinutes = JSON.parse(localStorage.getItem('dailyMinutes')) || {};
    const minutesToday = dailyMinutes[today] || 0;
    document.getElementById('todayTotal').innerText = "Today: " + minutesToday + " min";
}

function showUnlockBanner(message) {
    const banner = document.getElementById('unlockBanner');
    banner.innerText = message;
    banner.style.display = 'block';
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 3000);
}

function checkUnlocks(continuousSeconds) {
    if (!localStorage.getItem('notepadUnlocked')) {
        if (continuousSeconds >= 10) {
            document.getElementById('notepadUnlock').style.display = 'block';
            showUnlockBanner("🎉 Notepad unlocked!");
            localStorage.setItem('notepadUnlocked', 'true');
        }
    } else if (!localStorage.getItem('calculatorUnlocked')) {
        const streak = calculateStreak();
        if (streak >= 3) {
            document.getElementById('calculatorUnlock').style.display = 'block';
            showUnlockBanner("🎉 Calculator unlocked!");
            localStorage.setItem('calculatorUnlocked', 'true');
        }
    }
}

function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return (hrs > 0 ? hrs + ":" : "") + mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
}

function updateLiveProgress(continuousSeconds) {
    if (!localStorage.getItem('notepadUnlocked')) {
        const remainingSeconds = 10 - continuousSeconds;

        if (remainingSeconds <= 5 && remainingSeconds > 0 && !localStorage.getItem('suspenseShown')) {
            showUnlockBanner("✨ Something's coming soon...");
            localStorage.setItem('suspenseShown', 'true');
        }

        if (remainingSeconds <= 0) {
            checkUnlocks(continuousSeconds);
        }

        document.getElementById('unlockProgress').innerText = 
            remainingSeconds > 0 ? formatTime(remainingSeconds) + " until surprise" : "Unlocked!";
    }
}

function saveSessionMinutes(minutesToAdd) {
    const today = new Date().toDateString();
    let dailyMinutes = JSON.parse(localStorage.getItem('dailyMinutes')) || {};
    dailyMinutes[today] = (dailyMinutes[today] || 0) + minutesToAdd;
    localStorage.setItem('dailyMinutes', JSON.stringify(dailyMinutes));
    updateTodayTotal();
}

function calcInput(value) {
    document.getElementById('calcDisplay').value += value;
}

function calcClear() {
    document.getElementById('calcDisplay').value = '';
}

function calcEquals() {
    try {
        document.getElementById('calcDisplay').value = eval(document.getElementById('calcDisplay').value);
    } catch {
        document.getElementById('calcDisplay').value = 'Error';
    }
}

function calcSqrt() {
    try {
        const current = parseFloat(document.getElementById('calcDisplay').value);
        document.getElementById('calcDisplay').value = Math.sqrt(current);
    } catch {
        document.getElementById('calcDisplay').value = 'Error';
    }
}

document.getElementById('startBtn').addEventListener('click', () => {
    startSound.play();
    if (timerInterval) return;
    recordTodayUsage();
    updateStreakDisplay();
    startTime = Date.now() - (seconds * 1000);
    continuousStart = Date.now();
    document.getElementById('stage').style.animation = 'none';
    document.getElementById('stage').offsetHeight;
    document.getElementById('stage').style.animation = 'popIn 0.4s ease forwards';
    timerInterval = setInterval(() => {
        seconds = Math.floor((Date.now() - startTime) / 1000);
        updateDisplay();
        const continuousSeconds = Math.floor((Date.now() - continuousStart) / 1000);
        updateLiveProgress(continuousSeconds);
    }, 1000);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const minutesThisSession = seconds / 60;
    saveSessionMinutes(minutesThisSession);
    seconds = 0;
    tabSwitchCount = 0;
    document.getElementById('switchCount').innerText = "Tab switches: 0";
    updateDisplay();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && timerInterval) {
        if (currentMode === 'strict') {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("You left the tab! Timer paused (Strict Mode).");
        } else {
            tabSwitchCount++;
            document.getElementById('switchCount').innerText = "Tab switches: " + tabSwitchCount;
        }
    }
});

document.getElementById('strictModeBtn').addEventListener('click', () => {
    currentMode = 'strict';
    document.getElementById('strictModeBtn').classList.add('active');
    document.getElementById('flexibleModeBtn').classList.remove('active');
    document.getElementById('switchCount').style.display = 'none';
});

document.getElementById('flexibleModeBtn').addEventListener('click', () => {
    currentMode = 'flexible';
    document.getElementById('flexibleModeBtn').classList.add('active');
    document.getElementById('strictModeBtn').classList.remove('active');
    document.getElementById('switchCount').style.display = 'block';
});

document.getElementById('devResetBtn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

document.getElementById('devStreakBtn').addEventListener('click', () => {
    let fakeDays = [];
    for (let i = 0; i < 10; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        fakeDays.push(date.toDateString());
    }
    localStorage.setItem('usedDays', JSON.stringify(fakeDays));
    updateStreakDisplay();
    checkUnlocks(0);
});

updateTodayTotal();
updateStreakDisplay();
checkUnlocks(0);