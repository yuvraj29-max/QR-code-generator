let currentInput = "";
let timerInterval = null;
const VALIDITY_DURATION = 3 * 60; // 3 minutes in seconds
let timeRemaining = VALIDITY_DURATION;

document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    currentInput = document.getElementById('textInput').value.trim();
    if (currentInput === '') return;

    // Unhide layout elements on initial generate
    document.getElementById('timerDisplay').classList.remove('hidden');
    document.getElementById('qrCodeImage').classList.remove('hidden');

    generateTimedQR();
    startCountdown();
});
function generateTimedQR() {
    const qrCodeImage = document.getElementById('qrCodeImage');
    const timeBlockToken = Math.floor(Date.now() / (VALIDITY_DURATION * 1000));
    const securePayload = `${currentInput}?t_block=${timeBlockToken}`;
    
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(securePayload)}`;
    
    qrCodeImage.src = apiUrl;
}

function startCountdown() {
    clearInterval(timerInterval);
    
    timeRemaining = VALIDITY_DURATION;
    updateTimerUI();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerUI();

        if (timeRemaining <= 0) {
            generateTimedQR();
            timeRemaining = VALIDITY_DURATION;
        }
    }, 1000);
}

function updateTimerUI() {
    const countdownSpan = document.getElementById('countdown');
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    // Pads numbers so it formats consistently as 02:05 instead of 2:5
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    countdownSpan.textContent = `${formattedMinutes}:${formattedSeconds}`;
}