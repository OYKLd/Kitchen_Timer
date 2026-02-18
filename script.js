class KitchenTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        
        this.initElements();
        this.initEventListeners();
        this.updateDisplay();
    }
    
    initElements() {
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.displayMinutes = document.getElementById('displayMinutes');
        this.displaySeconds = document.getElementById('displaySeconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusText = document.getElementById('statusText');
        this.notification = document.getElementById('notification');
        this.closeNotificationBtn = document.getElementById('closeNotification');
        this.timerDisplay = document.querySelector('.timer-display');
        this.timeInputs = document.querySelector('.time-inputs');
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.closeNotificationBtn.addEventListener('click', () => this.closeNotification());
        
        this.minutesInput.addEventListener('input', () => this.validateInput(this.minutesInput));
        this.secondsInput.addEventListener('input', () => this.validateInput(this.secondsInput));
        
        this.minutesInput.addEventListener('change', () => this.updateDisplayFromInputs());
        this.secondsInput.addEventListener('change', () => this.updateDisplayFromInputs());
    }
    
    validateInput(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (isNaN(value) || value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }
    
    updateDisplayFromInputs() {
        if (!this.isRunning) {
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            this.totalSeconds = minutes * 60 + seconds;
            this.remainingSeconds = this.totalSeconds;
            this.updateDisplay();
        }
    }
    
    start() {
        if (this.isRunning && !this.isPaused) return;
        
        if (!this.isPaused) {
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            this.totalSeconds = minutes * 60 + seconds;
            
            if (this.totalSeconds === 0) {
                this.statusText.textContent = 'Veuillez définir un temps';
                return;
            }
            
            this.remainingSeconds = this.totalSeconds;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        
        this.timerDisplay.classList.add('running');
        this.statusText.textContent = 'En cours...';
        
        this.intervalId = setInterval(() => this.tick(), 1000);
    }
    
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        clearInterval(this.intervalId);
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '▶️ Reprendre';
        this.pauseBtn.disabled = true;
        
        this.timerDisplay.classList.remove('running');
        this.statusText.textContent = 'En pause';
    }
    
    reset() {
        clearInterval(this.intervalId);
        
        this.isRunning = false;
        this.isPaused = false;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '▶️ Démarrer';
        this.pauseBtn.disabled = true;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;
        
        this.timerDisplay.classList.remove('running');
        this.statusText.textContent = 'Prêt';
        
        this.updateDisplayFromInputs();
    }
    
    tick() {
        this.remainingSeconds--;
        
        if (this.remainingSeconds <= 0) {
            this.complete();
        } else {
            this.updateDisplay();
        }
    }
    
    complete() {
        clearInterval(this.intervalId);
        
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '▶️ Démarrer';
        this.pauseBtn.disabled = true;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;
        
        this.timerDisplay.classList.remove('running');
        this.statusText.textContent = 'Terminé!';
        
        this.updateDisplay();
        this.showNotification();
        this.playSound();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        
        this.displayMinutes.textContent = minutes.toString().padStart(2, '0');
        this.displaySeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    showNotification() {
        this.notification.classList.add('show');
    }
    
    closeNotification() {
        this.notification.classList.remove('show');
    }
    
    playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            
            oscillator2.frequency.value = 800;
            oscillator2.type = 'sine';
            
            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator2.start(audioContext.currentTime);
            oscillator2.stop(audioContext.currentTime + 0.5);
        }, 600);
        
        setTimeout(() => {
            const oscillator3 = audioContext.createOscillator();
            const gainNode3 = audioContext.createGain();
            
            oscillator3.connect(gainNode3);
            gainNode3.connect(audioContext.destination);
            
            oscillator3.frequency.value = 800;
            oscillator3.type = 'sine';
            
            gainNode3.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator3.start(audioContext.currentTime);
            oscillator3.stop(audioContext.currentTime + 0.5);
        }, 1200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KitchenTimer();
});