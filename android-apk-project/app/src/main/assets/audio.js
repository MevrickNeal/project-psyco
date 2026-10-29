// ==========================================
// RETRO 8-BIT / 16-BIT CHIPTUNE AUDIO SYNTH
// 100% Offline Web Audio API Synthesizer
// With Dhaka Vehicle SFX: Slap, Rickshaw Bell, Air Horn
// ==========================================

class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.volume = 0.35;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBgm();
        } else {
            this.startBgm();
        }
        return this.muted;
    }

    playTone(freq, type = 'square', duration = 0.1, gainVal = 0.2, decay = true) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);
            if (decay) {
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            }

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    // 💥 BD TESLA SLAPPER: Crisp Slap SFX ("THWACK!")
    playSlap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // High impact square slap crack
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
            gain.gain.setValueAtTime(0.4 * this.volume, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.13);

            // Pop harmonic
            setTimeout(() => {
                this.playTone(800, 'square', 0.05, 0.3, true);
            }, 10);
        } catch (e) {}
    }

    // 🛺 BAPER RASTA: Authentic Dual Rickshaw Bell ("Tring-Tring!")
    playBell() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const ding = (timeOffset) => {
            setTimeout(() => {
                this.playTone(1850, 'sine', 0.08, 0.35, true);
                this.playTone(2200, 'triangle', 0.12, 0.25, true);
            }, timeOffset);
        };
        ding(0);
        ding(90);
    }

    // 🚌 DHAKA UNLIMITED: Powerful Dhaka Hydraulic Air Horn ("PAWWWWN!")
    playAirHorn() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Dual tone air horn chords (F4 349Hz and A4 440Hz)
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc1.frequency.setValueAtTime(349.2, now);
            osc2.frequency.setValueAtTime(440.0, now);

            gain.gain.setValueAtTime(0.35 * this.volume, now);
            gain.gain.linearRampToValueAtTime(0.35 * this.volume, now + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.46);
            osc2.stop(now + 0.46);
        } catch (e) {}
    }

    playJump() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.2 * this.volume, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) {}
    }

    playCollect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.12, 0.25, true);
            }, idx * 55);
        });
    }

    playHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
            gain.gain.setValueAtTime(0.3 * this.volume, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.21);
        } catch (e) {}
    }

    playLaser() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
            gain.gain.setValueAtTime(0.25 * this.volume, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.13);
        } catch (e) {}
    }

    playHeart() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => {
            setTimeout(() => {
                this.playTone(f, 'sine', 0.15, 0.2, true);
            }, i * 40);
        });
    }

    playHorn() {
        this.playAirHorn();
    }

    playBark() {
        if (this.muted) return;
        this.playTone(130, 'square', 0.08, 0.3, true);
        setTimeout(() => this.playTone(110, 'square', 0.12, 0.35, true), 90);
    }

    playMotorcycle() {
        if (this.muted) return;
        this.playTone(65, 'sawtooth', 0.1, 0.15, true);
    }

    playSelect() {
        this.playTone(880, 'square', 0.05, 0.15, true);
    }

    playWin() {
        if (this.muted) return;
        const notes = [
            { f: 523.25, d: 150 },
            { f: 659.25, d: 150 },
            { f: 783.99, d: 150 },
            { f: 1046.50, d: 350 },
            { f: 783.99, d: 150 },
            { f: 1046.50, d: 500 }
        ];
        let delay = 0;
        notes.forEach(n => {
            setTimeout(() => {
                this.playTone(n.f, 'triangle', n.d / 1000, 0.35, true);
            }, delay);
            delay += n.d + 50;
        });
    }

    // Dynamic 8-bit chiptune loop
    startBgm() {
        if (this.bgmPlaying || this.muted) return;
        this.init();
        this.bgmPlaying = true;

        const bassline = [110, 110, 130.81, 146.83, 110, 110, 98, 123.47];
        const melody = [
            440, 0, 523.25, 587.33, 659.25, 587.33, 523.25, 0,
            440, 440, 659.25, 0, 587.33, 523.25, 440, 493.88
        ];
        let step = 0;

        const tick = () => {
            if (!this.bgmPlaying || this.muted) return;
            const b = bassline[step % bassline.length];
            const m = melody[step % melody.length];

            if (b > 0) {
                this.playTone(b, 'triangle', 0.12, 0.12, true);
            }
            if (m > 0) {
                this.playTone(m, 'square', 0.1, 0.09, true);
            }

            step++;
            this.bgmTimer = setTimeout(tick, 180);
        };

        tick();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.soundEngine = new RetroAudioEngine();
