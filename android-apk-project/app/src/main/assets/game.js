// ============================================================================
// PROJECT PSYCO: MOMO & LIAN (DHAKA RETRO DATE EDITION)
// Dual Platform: Phone Touch & PC (WASD / Arrows / Space / Enter)
// Zero Black-Screen Guarantee with Procedural Fallback Engine
// ============================================================================

var GLOBAL_TIMER = 300;
var CURRENT_KM = 0.0;
var GLOBAL_SCORE = 0;
var SELECTED_RIDE = 'bike'; // 'bike' | 'rickshaw' | 'bus'
var STATS_SLAPS = 0;
var STATS_BELLS = 0;
var STATS_PASSENGERS = 0;
var FLOWERS_COLLECTED = 0;
var GAME_INSTANCE = null;

// Unified Mobile & Desktop Input State
window.gameInputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    actionA: false,
    actionB: false
};

// ==========================================
// IN-GAME RETRO MODAL HELPER
// ==========================================
function showRetroModal(title, text, options, onSelect) {
    const modal = document.getElementById('retro-modal');
    const mTitle = document.getElementById('modal-title');
    const mBody = document.getElementById('modal-body');
    const mOptions = document.getElementById('modal-options');

    if (!modal) return;
    mTitle.innerText = title;
    mBody.innerHTML = text;
    mOptions.innerHTML = '';

    options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'modal-btn';
        btn.innerText = opt.label || opt;
        btn.onclick = () => {
            if (window.soundEngine) window.soundEngine.playSelect();
            modal.style.display = 'none';
            if (onSelect) onSelect(idx);
        };
        mOptions.appendChild(btn);
    });

    modal.style.display = 'flex';
}

// ==========================================
// TOUCH VIRTUAL GAMEPAD SETUP
// ==========================================
function setupTouchControls() {
    const bindTouch = (elemId, inputKey) => {
        const el = document.getElementById(elemId);
        if (!el) return;
        const setVal = (val, e) => {
            if (e.cancelable) e.preventDefault();
            window.gameInputs[inputKey] = val;
            if (val) {
                el.classList.add('active');
                if (navigator.vibrate) navigator.vibrate(15);
            } else {
                el.classList.remove('active');
            }
        };
        el.addEventListener('pointerdown', (e) => setVal(true, e), { passive: false });
        el.addEventListener('pointerup', (e) => setVal(false, e), { passive: false });
        el.addEventListener('pointercancel', (e) => setVal(false, e), { passive: false });
        el.addEventListener('pointerleave', (e) => setVal(false, e), { passive: false });
    };

    bindTouch('btn-left', 'left');
    bindTouch('btn-right', 'right');
    bindTouch('btn-up', 'up');
    bindTouch('btn-down', 'down');
    bindTouch('btn-a', 'actionA');
    bindTouch('btn-b', 'actionB');
}

// ==========================================
// MOMO DATE TRAP QUESTIONS
// ==========================================
const trapQuestions = [
    { q: "Momo: 'You are late! Do I look fat in this date dress?'", a: ["No, you look gorgeous!", "Maybe a tiny bit...", "I like curves anyway"], c: 0 },
    { q: "Momo: 'Who took longer to get ready today?'", a: ["Me, sorry wifey!", "You, obviously", "Same same"], c: 0 },
    { q: "Momo: 'I said It's fine 5 minutes ago. What did that mean?'", a: ["It means it's fine", "It's NOT FINE (IMMEDIATE APOLOGY)", "You were happy"], c: 1 },
    { q: "Momo: 'Do you remember the exact date of our first date?'", a: ["Of course! Best day of my life", "Uhhhh... was it Ramadan?", "Last year?"], c: 0 },
    { q: "Momo: 'If I was a tiny earthworm, would you still date me at Mohammadpur?'", a: ["Yes, I'd bring you fresh salad daily", "Ew no, worms are gross", "Idk"], c: 0 }
];

// ==========================================
// PHASER GAME ENGINE INITIALIZATION
// ==========================================
function initPhaserGame() {
    if (GAME_INSTANCE) return;

    const config = {
        type: Phaser.AUTO,
        parent: 'game-wrapper',
        width: 960,
        height: 540,
        pixelArt: true,
        backgroundColor: '#020603',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [
            BootScene,
            UIScene,
            TitleScene,
            LevelSneak,
            RideSelectScene,
            LevelRoadRush,
            LevelBoss,
            WinScene
        ]
    };

    GAME_INSTANCE = new Phaser.Game(config);
    setupTouchControls();
}

// ----------------------------------------------------
// 1. BOOT SCENE: Fast Preload & Procedural Fallbacks
// ----------------------------------------------------
class BootScene extends Phaser.Scene {
    constructor() { super("Boot"); }

    preload() {
        const w = this.scale.width;
        const h = this.scale.height;

        // Visual Retro Loading Bar
        const loadText = this.add.text(w / 2, h / 2 - 30, "PREPARING DHAKA STREETS...", {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        progressBox.lineStyle(2, 0x00ff41, 1);
        progressBox.strokeRect(w / 2 - 160, h / 2, 320, 20);

        const progressBar = this.add.graphics();
        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff41, 1);
            progressBar.fillRect(w / 2 - 156, h / 2 + 4, 312 * val, 12);
        });

        // Fail-safe: Prevent any load error from halting boot
        this.load.on('loaderror', (file) => {
            console.warn('[AssetLoader] Fallback will be used for:', file.key);
        });

        this.load.path = 'assets/sprites/';

        this.load.image('home', 'home.jpg');
        this.load.image('city', 'evening city.png');
        this.load.image('road', 'vangarasta.png');
        this.load.image('baba_idle', 'baba.png');
        this.load.image('baba_w1', 'walkbaba.png');
        this.load.image('baba_w2', 'walkbaba1.png');
        this.load.image('baba_w3', 'walkbaba2.png');
        this.load.image('bus_top', 'bus-topdown.png');
        this.load.image('bus_side', 'poristhanside.png');
        this.load.image('hunda_top', 'top_bike.png');
        this.load.image('momo_angry', 'momo-boss.png');
        this.load.image('momo_happy', 'momo-happy.png');
        this.load.image('golla', 'golla.png');
        this.load.image('heart', 'heart.png');
        this.load.image('choco', 'choco.png');
        this.load.image('flower', 'flower.png');
        this.load.image('keys', 'keys.png');
        this.load.image('win', 'win.png');

        for (let i = 1; i <= 10; i++) {
            this.load.image(`l${i}`, `l${i}.png`);
        }
        this.load.image('jump_pose', 'l9.png');
    }

    create() {
        this.createProceduralFallbacks();

        // Animations
        if (this.textures.exists('l1')) {
            this.anims.create({
                key: 'run',
                frames: [
                    { key: 'l1' }, { key: 'l2' }, { key: 'l3' }, { key: 'l4' }, { key: 'l5' },
                    { key: 'l6' }, { key: 'l7' }, { key: 'l8' }, { key: 'l9' }, { key: 'l10' }
                ],
                frameRate: 15,
                repeat: -1
            });
        }

        if (this.textures.exists('baba_w1')) {
            this.anims.create({
                key: 'baba_walk',
                frames: [{ key: 'baba_w1' }, { key: 'baba_w2' }, { key: 'baba_w3' }],
                frameRate: 6,
                repeat: -1
            });
        }

        this.scene.launch("UIScene");
        this.scene.start("TitleScene");
    }

    createProceduralFallbacks() {
        // Fallback generator helper
        const makeTexture = (key, w, h, drawFn) => {
            if (!this.textures.exists(key)) {
                const canvas = this.textures.createCanvas(key, w, h);
                drawFn(canvas.context, w, h);
                canvas.refresh();
            }
        };

        // 1. "BD Tesla" Battery Auto-Rickshaw
        makeTexture('bd_tesla', 52, 90, (ctx) => {
            ctx.fillStyle = '#00bb55';
            ctx.fillRect(6, 12, 40, 68);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(10, 2, 32, 14);
            ctx.fillStyle = '#111111';
            ctx.fillRect(12, 16, 28, 14);
            ctx.fillStyle = '#005522';
            ctx.fillRect(14, 34, 24, 36);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(10, 0, 8, 4);
            ctx.fillRect(34, 0, 8, 4);
        });

        // 2. "Baper Rasta" Traditional Dhaka Rickshaw
        makeTexture('dhaka_rickshaw', 54, 96, (ctx) => {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(8, 40, 38, 46);
            ctx.fillStyle = '#ee2233';
            ctx.fillRect(12, 46, 30, 30);
            ctx.fillStyle = '#333333';
            ctx.fillRect(24, 18, 6, 24);
            ctx.fillRect(14, 22, 26, 4);
            ctx.fillStyle = '#111111';
            ctx.fillRect(25, 4, 4, 16);
            ctx.fillRect(4, 55, 4, 26);
            ctx.fillRect(46, 55, 4, 26);
            ctx.fillStyle = '#2277bb';
            ctx.beginPath();
            ctx.arc(27, 28, 7, 0, Math.PI * 2);
            ctx.fill();
        });

        // 3. Comic Slap Hand
        makeTexture('slap_hand', 48, 48, (ctx) => {
            ctx.fillStyle = '#ffcc88';
            ctx.beginPath();
            ctx.arc(24, 26, 14, 0, Math.PI * 2);
            ctx.fill();
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(13 + i * 6, 6, 5, 16);
            }
            ctx.fillRect(36, 20, 8, 6);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // 4. City Background Fallback
        makeTexture('city', 960, 540, (ctx, w, h) => {
            ctx.fillStyle = '#0a1612';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#143022';
            for (let x = 0; x < w; x += 40) {
                const bH = 120 + Math.sin(x) * 60;
                ctx.fillRect(x, h - bH - 60, 36, bH);
            }
        });

        // 5. Road Background Fallback
        makeTexture('road', 720, 1080, (ctx, w, h) => {
            ctx.fillStyle = '#1e2420';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#ffcc00';
            for (let y = 0; y < h; y += 80) {
                ctx.fillRect(w / 2 - 5, y, 10, 40);
            }
        });

        // 6. Home Background Fallback
        makeTexture('home', 960, 540, (ctx, w, h) => {
            ctx.fillStyle = '#102016';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#1a3625';
            ctx.fillRect(40, 40, w - 80, h - 80);
        });
    }
}

// ----------------------------------------------------
// 2. UI SCENE: Countdown Timer & Real GPS Progress
// ----------------------------------------------------
class UIScene extends Phaser.Scene {
    constructor() { super("UIScene"); }

    create() {
        const w = this.scale.width;
        this.timerBox = this.add.container(w - 170, 18).setScrollFactor(0).setDepth(10000);
        const bg = this.add.rectangle(0, 0, 150, 32, 0x000000, 0.90).setStrokeStyle(1.5, 0x00ff41);
        this.timerText = this.add.text(0, 0, 'TIME: 5:00', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.timerBox.add([bg, this.timerText]);

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (GLOBAL_TIMER > 0) {
                    GLOBAL_TIMER--;
                    const min = Math.floor(GLOBAL_TIMER / 60);
                    const sec = GLOBAL_TIMER % 60;
                    this.timerText.setText(`TIME: ${min}:${sec < 10 ? '0' + sec : sec}`);
                    if (GLOBAL_TIMER <= 30) {
                        this.timerText.setColor('#ff3333');
                    }
                } else {
                    showRetroModal("TIME EXPIRED!", "Momo blocked you everywhere and went offline.<br>You missed the date in Mohammadpur!", ["RETRY JOURNEY"], () => {
                        GLOBAL_TIMER = 300;
                        location.reload();
                    });
                }
            }
        });
    }

    flashPenalty() {
        this.timerText.setColor('#ff0000');
        this.cameras.main.shake(150, 0.015);
        this.time.delayedCall(800, () => {
            this.timerText.setColor('#00ff41');
        });
    }
}

// ----------------------------------------------------
// 3. TITLE & INTRO SCENE: Atmospheric, Zero-Blackscreen
// Responsive to: Screen Tap, Enter, Space, WASD, Arrows
// ----------------------------------------------------
class TitleScene extends Phaser.Scene {
    constructor() { super("TitleScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.add.image(w / 2, h / 2, 'city').setDisplaySize(w, h).setAlpha(0.4);

        // Retro Glowing Title
        const title = this.add.text(w / 2, 75, "💖 PROJECT PSYCO: MOMO & LIAN 💖", {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#ff66aa',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scaleX: 1.04,
            scaleY: 1.04,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(w / 2, 115, "A 3:00 AM DHAKA DATE ADVENTURE (MIRPUR ➔ MOHAMMADPUR)", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Story Dialogue Card
        const cardBg = this.add.rectangle(w / 2, 240, 720, 175, 0x041007, 0.92)
            .setStrokeStyle(2, 0x00ff41);

        const msg1 = this.add.text(w / 2, 190, "📱 MOMO (3:00 AM): \"TUMI EKHONO MOHAMMADPUR ASHONI?!\"", {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ff3333',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const msg2 = this.add.text(w / 2, 230, "\"I have been waiting at Town Hall! Don't call me. Goodbye!\"", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffcc00'
        }).setOrigin(0.5);

        const msg3 = this.add.text(w / 2, 280, "LIAN: \"5 minutes to sneak out & race 8.8 km to Mohammadpur!\"", {
            fontFamily: 'Courier New, monospace',
            fontSize: '15px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Big Pulsing Interactive Start Banner
        this.startBtn = this.add.text(w / 2, 395, "[ 🎮 TAP SCREEN OR PRESS ENTER / SPACE / WASD TO START! ]", {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#000000',
            backgroundColor: '#00ff41',
            fontStyle: 'bold',
            padding: { x: 22, y: 12 }
        }).setOrigin(0.5).setInteractive();

        this.tweens.add({
            targets: this.startBtn,
            alpha: 0.85,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Controls Helper Footer
        this.add.text(w / 2, 475, "⌨️ PC: WASD / Arrow Keys + Space/Enter | 📱 PHONE: Left D-Pad + Right A/B Buttons", {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: '#888888'
        }).setOrigin(0.5);

        // Start Handlers (Supports all input methods)
        let started = false;
        const startGame = () => {
            if (started) return;
            started = true;
            if (window.soundEngine) {
                window.soundEngine.init();
                window.soundEngine.playSelect();
                window.soundEngine.startBgm();
            }
            this.scene.start("LevelSneak");
        };

        // Pointer / Touch on Button or Anywhere on Canvas
        this.startBtn.on('pointerdown', startGame);
        this.input.on('pointerdown', startGame);

        // Keyboard: Enter, Space, WASD, Arrow keys
        const keys = [
            Phaser.Input.Keyboard.KeyCodes.ENTER,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        ];

        keys.forEach(k => {
            this.input.keyboard.on(`keydown-${k}`, startGame);
        });
    }

    update() {
        // Also support virtual touch inputs on mobile
        if (window.gameInputs.actionA || window.gameInputs.actionB || window.gameInputs.up || window.gameInputs.down) {
            if (window.soundEngine) {
                window.soundEngine.init();
                window.soundEngine.playSelect();
                window.soundEngine.startBgm();
            }
            this.scene.start("LevelSneak");
        }
    }
}

// ----------------------------------------------------
// 4. LEVEL 1: SNEAK OUT OF HOME (Mirpur 10, 0.0 KM)
// Dual Controls: WASD + Arrows + Virtual Touch Gamepad
// ----------------------------------------------------
class LevelSneak extends Phaser.Scene {
    constructor() { super("LevelSneak"); }

    create() {
        CURRENT_KM = 0.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Mirpur 10 (Home)", "ON FOOT");
        this.gpsHUD.showLandmarkToast("Mirpur 10", "Sneak past Baba to grab front door keys!");

        this.add.image(480, 270, 'home').setDisplaySize(960, 540);

        this.walls = this.physics.add.staticGroup();
        this.walls.add(this.add.rectangle(480, 50, 960, 30));
        this.walls.add(this.add.rectangle(480, 530, 960, 30));
        this.walls.add(this.add.rectangle(10, 270, 30, 540));
        this.walls.add(this.add.rectangle(950, 270, 30, 540));
        this.walls.add(this.add.rectangle(480, 180, 24, 240));
        this.walls.add(this.add.rectangle(480, 430, 24, 140));
        this.walls.children.iterate(w => w.setVisible(false));

        this.hasKeys = false;
        this.keySprite = this.physics.add.sprite(340, 220, 'keys').setScale(0.08);
        this.keyText = this.add.text(340, 195, "DOOR KEYS", { fontSize: '11px', backgroundColor: '#000' }).setOrigin(0.5);

        this.player = this.physics.add.sprite(120, 180, 'l1').setScale(0.5);
        this.player.body.setSize(40, 40).setOffset(20, 80);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.walls);

        this.baba = this.physics.add.sprite(620, 200, 'baba_idle').setScale(0.6);
        if (this.anims.exists('baba_walk')) this.baba.play('baba_walk');
        this.baba.body.setSize(45, 45).setOffset(20, 80);

        this.alertText = this.add.text(this.baba.x, this.baba.y - 60, '', {
            fontSize: '22px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.patrolPoints = [
            { x: 580, y: 340 },
            { x: 780, y: 340 },
            { x: 780, y: 160 },
            { x: 580, y: 160 }
        ];
        this.patrolIdx = 0;
        this.moveBaba();

        this.exitDoor = this.add.rectangle(910, 480, 60, 90, 0x00ff41, 0.25).setStrokeStyle(2, 0x00ff41);
        this.physics.add.existing(this.exitDoor, true);

        this.doorLabel = this.add.text(910, 480, "LOCKED\nNEED KEY", {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: '#ff3333',
            align: 'center'
        }).setOrigin(0.5);

        this.physics.add.overlap(this.player, this.keySprite, () => {
            if (!this.hasKeys) {
                this.hasKeys = true;
                if (window.soundEngine) window.soundEngine.playCollect();
                this.keySprite.destroy();
                this.keyText.destroy();
                this.doorLabel.setText("EXIT\nOPEN!").setColor('#00ff41');
                this.gpsHUD.showLandmarkToast("Key Collected!", "Now sneak to the front door!");
            }
        });

        this.physics.add.overlap(this.player, this.exitDoor, () => {
            if (this.hasKeys) {
                if (window.soundEngine) window.soundEngine.playWin();
                this.scene.start("RideSelectScene");
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    moveBaba() {
        const pt = this.patrolPoints[this.patrolIdx];
        this.physics.moveTo(this.baba, pt.x, pt.y, 110);
    }

    update() {
        const pt = this.patrolPoints[this.patrolIdx];
        if (Phaser.Math.Distance.Between(this.baba.x, this.baba.y, pt.x, pt.y) < 15) {
            this.patrolIdx = (this.patrolIdx + 1) % this.patrolPoints.length;
            this.time.delayedCall(400, () => this.moveBaba());
        }

        // Dual Keyboard (WASD + Arrows) & Touch Inputs
        const left = this.cursors.left.isDown || this.wasd.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || window.gameInputs.right;
        const up = this.cursors.up.isDown || this.wasd.up.isDown || window.gameInputs.up;
        const down = this.cursors.down.isDown || this.wasd.down.isDown || window.gameInputs.down;

        this.player.setVelocity(0);
        const speed = 210;

        if (left) {
            this.player.setVelocityX(-speed);
            this.player.flipX = true;
            if (this.anims.exists('run')) this.player.anims.play('run', true);
        } else if (right) {
            this.player.setVelocityX(speed);
            this.player.flipX = false;
            if (this.anims.exists('run')) this.player.anims.play('run', true);
        }

        if (up) {
            this.player.setVelocityY(-speed);
            if (this.anims.exists('run')) this.player.anims.play('run', true);
        } else if (down) {
            this.player.setVelocityY(speed);
            if (this.anims.exists('run')) this.player.anims.play('run', true);
        }

        if (!left && !right && !up && !down) {
            this.player.anims.stop();
        }

        this.player.setDepth(this.player.y);
        this.baba.setDepth(this.baba.y);
        this.alertText.setPosition(this.baba.x, this.baba.y - 65);

        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.baba.x, this.baba.y);
        if (dist < 110) {
            this.alertText.setText("❗ 'KIRE? KOI JASH ETO RAATE?!'");
            if (dist < 55) {
                if (window.soundEngine) window.soundEngine.playHit();
                this.cameras.main.shake(250, 0.015);
                this.player.setPosition(120, 180);
                this.alertText.setText("CAUGHT! SENT BACK TO BED!");
                this.time.delayedCall(1200, () => this.alertText.setText(''));
            }
        } else {
            this.alertText.setText('');
        }
    }
}

// ----------------------------------------------------
// 5. RIDE SELECT SCENE: 3 Dhaka Modes to Mohammadpur
// Keyboard: 1 / 2 / 3 or Click/Tap
// ----------------------------------------------------
class RideSelectScene extends Phaser.Scene {
    constructor() { super("RideSelectScene"); }

    create() {
        const w = this.scale.width;
        this.cameras.main.setBackgroundColor('#020904');

        this.add.text(w / 2, 35, "🚕 CHOOSE YOUR RIDE TO MOHAMMADPUR DATE 🚕", {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 65, "Route: Mirpur 10 ➔ Mirpur 1 ➔ Kallyanpur ➔ Shyamoli ➔ Asad Gate ➔ Mohammadpur (8.8 KM)", {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: '#ffcc00'
        }).setOrigin(0.5);

        // Card 1: 🏍️ BIKE: BD Tesla Slapper
        this.createRideCard(
            170, 270, "1. 🏍️ BIKE RUSH", "BD Tesla Slapper Mode",
            "Slap erratic battery Teslas (+10/+50 pts)!\n[A/Space/Enter]: SLAP | [B/S/Down]: Boost",
            0x00e5ff, 'bike', 'hunda_top', 0.5
        );

        // Card 2: 🛺 RICKSHAW: Baper Rasta
        this.createRideCard(
            480, 270, "2. 🛺 RICKSHAW", "Baper Rasta Mode",
            "Drive like it's your father's road! Ring bell!\n[A/Space/Enter]: BELL | [B/S/Down]: Turbo",
            0xffcc00, 'rickshaw', 'dhaka_rickshaw', 1.0
        );

        // Card 3: 🚌 BUS: Dhaka Unlimited
        this.createRideCard(
            790, 270, "3. 🚌 LOCAL BUS", "Dhaka Unlimited Mode",
            "Heavy transport! Blare pneumatic horn at cars!\n[A/Space/Enter]: AIR HORN | [B/S/Down]: Throttle",
            0xff3366, 'bus', 'bus_top', 0.55
        );

        this.add.text(w / 2, 495, "💡 Every ride takes you to Momo's Date Spot in Mohammadpur!", {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#888888'
        }).setOrigin(0.5);

        // Keyboard shortcuts 1, 2, 3
        this.input.keyboard.on('keydown-ONE', () => this.selectRide('bike'));
        this.input.keyboard.on('keydown-TWO', () => this.selectRide('rickshaw'));
        this.input.keyboard.on('keydown-THREE', () => this.selectRide('bus'));
    }

    selectRide(modeKey) {
        SELECTED_RIDE = modeKey;
        if (window.soundEngine) {
            if (modeKey === 'bike') window.soundEngine.playSlap();
            else if (modeKey === 'rickshaw') window.soundEngine.playBell();
            else window.soundEngine.playAirHorn();
        }
        this.scene.start("LevelRoadRush");
    }

    createRideCard(x, y, title, subtitle, desc, strokeColor, modeKey, spriteKey, scale) {
        const card = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 270, 360, 0x051408, 0.95)
            .setStrokeStyle(2, strokeColor)
            .setInteractive();

        const t1 = this.add.text(0, -145, title, {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const t2 = this.add.text(0, -120, subtitle, {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: '#ffcc00'
        }).setOrigin(0.5);

        const icon = this.add.image(0, -35, spriteKey).setScale(scale);

        const descText = this.add.text(0, 55, desc, {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: '#cccccc',
            align: 'center',
            wordWrap: { width: 240 }
        }).setOrigin(0.5);

        const btn = this.add.text(0, 135, "[ SELECT & START ]", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#000000',
            backgroundColor: '#00ff41',
            fontStyle: 'bold',
            padding: { x: 14, y: 6 }
        }).setOrigin(0.5);

        card.add([bg, t1, t2, icon, descText, btn]);

        const selectThis = () => this.selectRide(modeKey);
        bg.on('pointerdown', selectThis);
        btn.setInteractive().on('pointerdown', selectThis);

        bg.on('pointerover', () => { bg.setFillStyle(0x0a2810); card.setScale(1.03); });
        bg.on('pointerout', () => { bg.setFillStyle(0x051408); card.setScale(1.0); });
    }
}

// ----------------------------------------------------
// 6. LEVEL: DHAKA ROAD RUSH (Mirpur 10 -> Mohammadpur, 8.8 KM)
// Dual Controls: WASD + Arrows + Virtual Touch Gamepad
// ----------------------------------------------------
class LevelRoadRush extends Phaser.Scene {
    constructor() { super("LevelRoadRush"); }

    create() {
        CURRENT_KM = 0.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        const modeTitle = SELECTED_RIDE === 'bike' ? 'BD TESLA SLAPPER' : SELECTED_RIDE === 'rickshaw' ? 'BAPER RASTA' : 'DHAKA UNLIMITED';
        this.gpsHUD.create(CURRENT_KM, "Mirpur 10 Circle", modeTitle);
        this.gpsHUD.showLandmarkToast("Starting Date Rush", `Mode: ${modeTitle} | Destination: Mohammadpur Town Hall!`);

        this.road = this.add.tileSprite(480, 270, 960, 540, 'road');

        if (SELECTED_RIDE === 'bike') {
            this.player = this.physics.add.sprite(480, 440, 'hunda_top').setScale(0.5);
            this.player.body.setSize(40, 85);
        } else if (SELECTED_RIDE === 'rickshaw') {
            this.player = this.physics.add.sprite(480, 440, 'dhaka_rickshaw').setScale(0.9);
            this.player.body.setSize(44, 85);
        } else {
            this.player = this.physics.add.sprite(480, 430, 'bus_top').setScale(0.55);
            this.player.body.setSize(55, 130);
        }

        this.slapSprite = this.add.sprite(0, 0, 'slap_hand').setVisible(false).setDepth(200);

        this.teslas = this.physics.add.group();
        this.traffic = this.physics.add.group();
        this.gifts = this.physics.add.group();

        this.scoreBox = this.add.container(18, 55).setScrollFactor(0).setDepth(9000);
        const sBg = this.add.rectangle(80, 0, 160, 28, 0x000000, 0.85).setStrokeStyle(1, 0x00ff41);
        this.scoreLabel = this.add.text(80, 0, this.getScoreText(), {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#ffcc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.scoreBox.add([sBg, this.scoreLabel]);

        this.spawner = this.time.addEvent({
            delay: SELECTED_RIDE === 'bike' ? 850 : 1000,
            callback: this.spawnRoadObstacles,
            callbackScope: this,
            loop: true
        });

        this.giftSpawner = this.time.addEvent({
            delay: 1600,
            callback: () => {
                if (CURRENT_KM >= 3.5 && CURRENT_KM <= 7.0) {
                    const x = Phaser.Math.Between(260, 700);
                    const isChoco = Math.random() > 0.5;
                    const g = this.gifts.create(x, -50, isChoco ? 'choco' : 'flower')
                        .setScale(isChoco ? 0.12 : 0.15)
                        .setVelocityY(280);
                    g.body.setAllowGravity(false);
                }
            },
            loop: true
        });

        this.physics.add.overlap(this.player, this.gifts, (p, g) => {
            g.destroy();
            FLOWERS_COLLECTED++;
            if (window.soundEngine) window.soundEngine.playCollect();
            this.gpsHUD.showLandmarkToast("Date Gift Collected!", `Picked up fresh roses & chocolates (${FLOWERS_COLLECTED} collected)!`);
        });

        this.physics.add.overlap(this.player, this.traffic, (p, t) => {
            t.destroy();
            if (window.soundEngine) window.soundEngine.playHit();
            this.cameras.main.shake(160, 0.015);
            GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 4);
        });

        this.physics.add.overlap(this.player, this.teslas, (p, t) => {
            t.destroy();
            if (window.soundEngine) window.soundEngine.playHit();
            this.cameras.main.shake(180, 0.02);
            GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 6);
            this.gpsHUD.showLandmarkToast("CRASH!", "Erratic Tesla bumped into you! -6s");
        });

        this.distCovered = 0.0;
        this.kmTimer = this.time.addEvent({
            delay: 350,
            loop: true,
            callback: () => {
                const step = SELECTED_RIDE === 'bike' ? 0.08 : SELECTED_RIDE === 'rickshaw' ? 0.05 : 0.07;
                this.distCovered += step;
                CURRENT_KM = parseFloat(this.distCovered.toFixed(1));

                let currentLandmark = "Mirpur 10 Circle";
                if (CURRENT_KM >= 7.5) currentLandmark = "Mohammadpur Town Hall";
                else if (CURRENT_KM >= 6.5) currentLandmark = "Asad Gate & St. Joseph";
                else if (CURRENT_KM >= 5.0) currentLandmark = "Shyamoli Square & Shishu Mela";
                else if (CURRENT_KM >= 3.5) currentLandmark = "Technical Mor / Kallyanpur";
                else if (CURRENT_KM >= 1.8) currentLandmark = "Mirpur 1 & Sony Cinema";

                this.gpsHUD.updateDistance(CURRENT_KM, currentLandmark);

                if (CURRENT_KM >= 8.8) {
                    this.spawner.remove();
                    this.giftSpawner.remove();
                    this.kmTimer.remove();
                    this.arriveAtMohammadpur();
                }
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    getScoreText() {
        if (SELECTED_RIDE === 'bike') return `SLAPS: ${STATS_SLAPS}`;
        if (SELECTED_RIDE === 'rickshaw') return `BELLS: ${STATS_BELLS}`;
        return `PASSENGERS: ${STATS_PASSENGERS}`;
    }

    spawnRoadObstacles() {
        const x = Phaser.Math.Between(260, 700);
        const isTesla = Math.random() > 0.45;

        if (isTesla) {
            const isWrongWay = Math.random() > 0.55;
            const speed = isWrongWay ? 460 : 320;
            const tesla = this.teslas.create(x, -90, 'bd_tesla').setScale(0.85).setVelocityY(speed);
            tesla.isWrongWay = isWrongWay;
            if (isWrongWay) tesla.setTint(0xff5555);
            tesla.body.setSize(44, 80);
        } else {
            const bus = this.traffic.create(x, -110, 'bus_top').setScale(0.5).setVelocityY(380);
            bus.body.setSize(50, 120);
        }
    }

    handleAction() {
        if (SELECTED_RIDE === 'bike') {
            if (window.soundEngine) window.soundEngine.playSlap();

            let slapped = false;
            this.teslas.children.iterate((t) => {
                if (t && t.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y) < 130) {
                    slapped = true;
                    const pts = t.isWrongWay ? 50 : 10;
                    STATS_SLAPS++;
                    GLOBAL_SCORE += pts;
                    this.scoreLabel.setText(this.getScoreText());

                    this.slapSprite.setPosition(t.x, t.y).setVisible(true).setScale(1.2);
                    this.tweens.add({
                        targets: this.slapSprite,
                        scaleX: 1.8,
                        scaleY: 1.8,
                        alpha: 0,
                        duration: 250,
                        onComplete: () => {
                            this.slapSprite.setVisible(false).setAlpha(1).setScale(1.2);
                        }
                    });

                    const txt = this.add.text(t.x, t.y - 20, t.isWrongWay ? "💥 ULTA RASTA! +50" : "👋 THASH! +10", {
                        fontFamily: 'Courier New, monospace',
                        fontSize: '16px',
                        color: t.isWrongWay ? '#ff0055' : '#ffcc00',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);
                    this.tweens.add({
                        targets: txt,
                        y: txt.y - 40,
                        alpha: 0,
                        duration: 700,
                        onComplete: () => txt.destroy()
                    });

                    this.tweens.add({
                        targets: t,
                        angle: 360,
                        x: t.x + (t.x > this.player.x ? 120 : -120),
                        duration: 350,
                        onComplete: () => t.destroy()
                    });
                }
            });

            if (!slapped) {
                this.slapSprite.setPosition(this.player.x + 35, this.player.y - 20).setVisible(true).setScale(1);
                this.time.delayedCall(150, () => this.slapSprite.setVisible(false));
            }

        } else if (SELECTED_RIDE === 'rickshaw') {
            if (window.soundEngine) window.soundEngine.playBell();
            STATS_BELLS++;
            this.scoreLabel.setText(this.getScoreText());

            const ringText = this.add.text(this.player.x, this.player.y - 45, "🔔 TRING TRING! BAPER RASTA?!", {
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                color: '#ffcc00',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.tweens.add({
                targets: ringText,
                y: ringText.y - 35,
                alpha: 0,
                duration: 650,
                onComplete: () => ringText.destroy()
            });

            this.traffic.children.iterate((tr) => {
                if (tr && tr.active && Math.abs(tr.y - this.player.y) < 180) {
                    tr.setVelocityX(tr.x > this.player.x ? 160 : -160);
                }
            });

        } else {
            if (window.soundEngine) window.soundEngine.playAirHorn();
            STATS_PASSENGERS += 2;
            this.scoreLabel.setText(this.getScoreText());

            const hornText = this.add.text(this.player.x, this.player.y - 65, "📢 PAWWWWN! MOHAMMADPUR! SIDE DEN!", {
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                color: '#ff3366',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.tweens.add({
                targets: hornText,
                y: hornText.y - 45,
                alpha: 0,
                duration: 800,
                onComplete: () => hornText.destroy()
            });

            this.traffic.children.iterate((tr) => {
                if (tr && tr.active && tr.y < this.player.y) {
                    tr.setVelocityX(tr.x > this.player.x ? 250 : -250);
                }
            });
            this.teslas.children.iterate((ts) => {
                if (ts && ts.active && ts.y < this.player.y) {
                    ts.setVelocityX(ts.x > this.player.x ? 250 : -250);
                }
            });
        }
    }

    arriveAtMohammadpur() {
        this.physics.pause();
        showRetroModal(
            "📍 ARRIVED AT MOHAMMADPUR!",
            `You made it across 8.8 KM from Mirpur to Mohammadpur Town Hall via <b>${SELECTED_RIDE.toUpperCase()}</b>!<br><br>Gifts collected for Momo: <b>${FLOWERS_COLLECTED} Roses & Chocolates</b>.<br><br>Momo is waiting outside... looking furious!`,
            ["CONFRONT MOMO & FIX THE DATE"],
            () => {
                this.scene.start("LevelBoss");
            }
        );
    }

    update() {
        const boost = this.cursors.down.isDown || this.wasd.down.isDown || window.gameInputs.actionB;
        const baseSpeed = SELECTED_RIDE === 'bike' ? 14 : SELECTED_RIDE === 'rickshaw' ? 9 : 12;
        const scrollSpeed = boost ? baseSpeed * 1.5 : baseSpeed;
        this.road.tilePositionY -= scrollSpeed;

        const left = this.cursors.left.isDown || this.wasd.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || window.gameInputs.right;
        const action = Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || window.gameInputs.actionA;

        const steerSpeed = SELECTED_RIDE === 'bike' ? 7 : SELECTED_RIDE === 'rickshaw' ? 5 : 6;
        if (left && this.player.x > 240) {
            this.player.x -= steerSpeed;
            if (SELECTED_RIDE === 'bike') this.player.setAngle(-8);
        } else if (right && this.player.x < 720) {
            this.player.x += steerSpeed;
            if (SELECTED_RIDE === 'bike') this.player.setAngle(8);
        } else {
            if (SELECTED_RIDE === 'bike') this.player.setAngle(0);
        }

        if (action && !this.actionCooldown) {
            this.actionCooldown = true;
            this.handleAction();
            this.time.delayedCall(220, () => { this.actionCooldown = false; });
        }
    }
}

// ----------------------------------------------------
// 7. LEVEL BOSS: MOMO DATE SHOWDOWN (Mohammadpur Town Hall)
// Dual Controls: WASD + Arrows + Virtual Touch Gamepad
// ----------------------------------------------------
class LevelBoss extends Phaser.Scene {
    constructor() { super("LevelBoss"); }

    create() {
        CURRENT_KM = 8.8;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Mohammadpur Town Hall", "DATE FINALE");
        this.gpsHUD.showLandmarkToast("Mohammadpur Town Hall", "Momo is furious from waiting! Shoot love hearts to calm her anger!");

        this.add.image(480, 270, 'city').setTint(0x772222);

        this.boss = this.physics.add.sprite(480, 160, 'momo_angry').setScale(0.85);
        this.tweens.add({
            targets: this.boss,
            x: 660,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.player = this.physics.add.sprite(480, 480, 'l1').setScale(0.8);

        this.bossHP = 20;
        this.playerHP = 4;

        this.hpText = this.add.text(20, 60, `Momo's Anger: ${this.bossHP}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#ff3333',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.pText = this.add.text(760, 60, `Lian HP: ${this.playerHP}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#00ff41',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.lasers = this.physics.add.group();
        this.attackTimer = this.time.addEvent({
            delay: 1300,
            loop: true,
            callback: () => {
                const pat = Phaser.Math.Between(0, 2);
                if (pat === 0) {
                    const orb = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.24);
                    this.physics.moveToObject(orb, this.player, 280);
                    if (window.soundEngine) window.soundEngine.playLaser();
                } else if (pat === 1) {
                    const beam = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.18, 0.7).setTint(0xff0000);
                    beam.setVelocityY(550);
                    if (window.soundEngine) window.soundEngine.playLaser();
                } else {
                    for (let i = -1; i <= 1; i++) {
                        const flame = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.2).setTint(0xff8800);
                        flame.setVelocity(i * 120, 360);
                    }
                }
            }
        });

        this.physics.add.overlap(this.player, this.lasers, (p, l) => {
            l.destroy();
            this.playerHP--;
            if (window.soundEngine) window.soundEngine.playHit();
            this.pText.setText(`Lian HP: ${this.playerHP}`);
            this.cameras.main.shake(120, 0.015);
            if (this.playerHP <= 0) {
                showRetroModal("MOMO STORMED OFF!", "Momo's anger was too strong!<br>Lian stood alone at Mohammadpur Town Hall.", ["TRY AGAIN WITH FULL HP"], () => {
                    this.scene.restart();
                });
            }
        });

        this.trapTimer = this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: this.triggerTrapQuestion,
            callbackScope: this
        });

        this.hearts = this.physics.add.group();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    triggerTrapQuestion() {
        this.physics.pause();
        const q = trapQuestions[Phaser.Math.Between(0, trapQuestions.length - 1)];

        showRetroModal("💥 MOMO DEMANDS AN ANSWER!", `<b>${q.q}</b>`, q.a, (selectedIdx) => {
            this.physics.resume();
            if (selectedIdx === q.c) {
                if (window.soundEngine) window.soundEngine.playHeart();
                this.bossHP = Math.max(0, this.bossHP - 4);
                this.hpText.setText(`Momo's Anger: ${this.bossHP}`);
                this.gpsHUD.showLandmarkToast("Great Answer!", "Momo softened noticeably (-4 Anger)!");
                if (this.bossHP <= 0) this.winGame();
            } else {
                if (window.soundEngine) window.soundEngine.playHit();
                this.playerHP = Math.max(1, this.playerHP - 1);
                this.pText.setText(`Lian HP: ${this.playerHP}`);
                this.gpsHUD.showLandmarkToast("Wrong Answer!", "Momo's fury intensified!");
            }
        });
    }

    shootHeart() {
        const heart = this.hearts.create(this.player.x, this.player.y - 25, 'heart').setScale(0.06);
        heart.setVelocityY(-650);
        if (window.soundEngine) window.soundEngine.playHeart();

        this.physics.add.overlap(heart, this.boss, (h, b) => {
            h.destroy();
            this.bossHP--;
            this.hpText.setText(`Momo's Anger: ${this.bossHP}`);
            this.boss.setTint(0xff99bb);
            this.time.delayedCall(100, () => this.boss.clearTint());

            if (this.bossHP <= 0) this.winGame();
        });
    }

    winGame() {
        this.attackTimer.remove();
        this.trapTimer.remove();
        this.physics.pause();
        this.scene.start("WinScene");
    }

    update() {
        const left = this.cursors.left.isDown || this.wasd.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || window.gameInputs.right;
        const shoot = Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey) || this.wasd.up.isDown || window.gameInputs.actionA;

        if (left && this.player.x > 180) this.player.x -= 6;
        if (right && this.player.x < 780) this.player.x += 6;

        if (shoot && !this.shootCooldown) {
            this.shootCooldown = true;
            this.shootHeart();
            this.time.delayedCall(240, () => { this.shootCooldown = false; });
        }
    }
}

// ----------------------------------------------------
// 8. WIN SCENE: Proposal & Replay Mode Select
// ----------------------------------------------------
class WinScene extends Phaser.Scene {
    constructor() { super("WinScene"); }

    create() {
        GLOBAL_TIMER = 9999;
        if (window.soundEngine) window.soundEngine.playWin();

        const w = this.scale.width;
        this.cameras.main.setBackgroundColor('#050e06');
        this.add.image(w / 2, 220, 'momo_happy').setScale(0.95);

        this.add.text(w / 2, 55, "💖 MOMO FORGAVE YOU! 💖", {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#ff66aa',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 95, `MIRPUR ➔ MOHAMMADPUR DATE ACCOMPLISHED VIA ${SELECTED_RIDE.toUpperCase()}!`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '15px',
            color: '#00ff41'
        }).setOrigin(0.5);

        this.time.delayedCall(1200, () => {
            this.showProposal();
        });
    }

    showProposal() {
        const modal = document.getElementById('retro-modal');
        const mTitle = document.getElementById('modal-title');
        const mBody = document.getElementById('modal-body');
        const mOptions = document.getElementById('modal-options');

        mTitle.innerText = "💍 THE ULTIMATE QUESTION";
        mBody.innerHTML = `Momo accepts the ${FLOWERS_COLLECTED} fresh flowers & chocolates at Mohammadpur...<br><br><span style='font-size:22px; color:#ffffff;'><b>Will you be my forever?</b></span>`;
        mOptions.innerHTML = `
            <button class="modal-btn" style="background:#006622; color:#fff; font-size:18px; text-align:center;" onclick="winForever()">❤️ YES, ALWAYS & FOREVER</button>
            <button class="modal-btn" style="background:#006622; color:#fff; font-size:18px; text-align:center;" onclick="winForever()">🥰 1000% YES</button>
            <button id="no-dodge-btn" class="modal-btn" style="background:#661111; color:#fff; font-size:14px; text-align:center; transition:0.1s;" onmouseover="dodgeBtn(this)" ontouchstart="dodgeBtn(this)">Let me think about it...</button>
        `;
        modal.style.display = 'flex';
    }
}

window.dodgeBtn = function(btn) {
    const rx = (Math.random() - 0.5) * 220;
    const ry = (Math.random() - 0.5) * 140;
    btn.style.transform = `translate(${rx}px, ${ry}px)`;
};

window.winForever = function() {
    const modal = document.getElementById('retro-modal');
    if (modal) modal.style.display = 'none';

    if (window.soundEngine) window.soundEngine.playWin();

    document.body.innerHTML = `
        <div style="width:100vw; height:100vh; background:#000000; color:#00ff41; font-family:'Courier New', monospace; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px;">
            <h1 style="color:#ff66aa; font-size:32px; text-shadow:0 0 15px #ff66aa; margin-bottom:10px;">SHE SAID YES! ❤️</h1>
            <p style="font-size:18px; color:#ffffff; max-width:620px; line-height:1.6;">
                Sneaking out of Mirpur 10, speeding past Mirpur 1, Kallyanpur, Shyamoli, and Asad Gate on your <b>${SELECTED_RIDE.toUpperCase()}</b> to Mohammadpur Town Hall...
                <br><br>
                <b style="color:#ffcc00; font-size:22px;">LIAN & MOMO FOREVER</b>
            </p>
            <div style="margin-top:20px; display:flex; gap:16px;">
                <button onclick="location.reload()" style="background:#00ff41; color:#000; font-weight:bold; padding:12px 24px; border:none; border-radius:4px; font-family:inherit; font-size:16px; cursor:pointer;">PLAY AGAIN (TRY ANOTHER VEHICLE)</button>
            </div>
            <div style="margin-top:30px; font-size:12px; color:#666;">Project Psyco: Momo & Lian — Built with 💚 in Dhaka</div>
        </div>
    `;
};

// Auto start game on page load
window.addEventListener('DOMContentLoaded', () => {
    initPhaserGame();
});
