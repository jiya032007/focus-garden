// Focus Garden project
let seconds = 0;
let timerInterval = null;
let startTime = null;
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

function checkUnlocks() {
    const totalMinutes = getTotalMinutes();
    if (totalMinutes >= 1 && !localStorage.getItem('notepadUnlocked')) {
        document.getElementById('notepadUnlock').style.display = 'block';
        showUnlockBanner("🎉 Notepad unlocked!");
        localStorage.setItem('notepadUnlocked', 'true');
    }
}

function updateUnlockProgress() {
    const totalMinutes = getTotalMinutes();
    if (!localStorage.getItem('notepadUnlocked')) {
        const remaining = 1 - totalMinutes;
        document.getElementById('unlockProgress').innerText = remaining > 0 ? remaining.toFixed(1) + " min to unlock a surprise" : "Almost there!";
    } else {
        document.getElementById('unlockProgress').innerText = "";
    }
}function updateLiveProgress(liveTotalMinutes) {
    if (!localStorage.getItem('notepadUnlocked')) {
        const remainingSeconds = (1 - liveTotalMinutes) * 60;

        if (remainingSeconds <= 30 && remainingSeconds > 0 && !localStorage.getItem('suspenseShown')) {
            showUnlockBanner("✨ Something's coming soon...");
            localStorage.setItem('suspenseShown', 'true');
        }

        if (remainingSeconds <= 0) {
            checkUnlocks();
        }

        document.getElementById('unlockProgress').innerText = 
            remainingSeconds > 0 ? formatTime(remainingSeconds) + " until surprise" : "Unlocked!";
    }
}

function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return (hrs > 0 ? hrs + ":" : "") + mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
}

function updateLiveProgress(liveTotalMinutes) {
    if (!localStorage.getItem('notepadUnlocked')) {
        const remainingSeconds = (1 - liveTotalMinutes) * 60;

        if (remainingSeconds <= 30 && remainingSeconds > 0 && !localStorage.getItem('suspenseShown')) {
            showUnlockBanner("✨ Something's coming soon...");
            localStorage.setItem('suspenseShown', 'true');
        }

        if (remainingSeconds <= 0) {
            checkUnlocks();
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
    checkUnlocks();
    updateUnlockProgress();
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (timerInterval) return;
    recordTodayUsage();
    startTime = Date.now() - (seconds * 1000);
    document.getElementById('stage').style.animation = 'none';
    document.getElementById('stage').offsetHeight;
    document.getElementById('stage').style.animation = 'popIn 0.4s ease forwards';
    timerInterval = setInterval(() => {
        seconds = Math.floor((Date.now() - startTime) / 1000);
        updateDisplay();

        const currentSessionMinutes = seconds / 60;
        const previousMinutes = getTotalMinutes();
        const liveTotal = previousMinutes + currentSessionMinutes;

        updateLiveProgress(liveTotal);
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

checkUnlocks();
updateTodayTotal();
updateUnlockProgress(); 