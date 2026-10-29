// ============================================================================
// PROJECT PSYCO: MOMO & LIAN (DHAKA RETRO DATE EDITION)
// Reverse Engineered: BD Tesla Slapper + Baper Rasta + Dhaka Unlimited
// Route: Mirpur 10 to Mohammadpur (8.8 KM) via Bike, Rickshaw, or Bus
// ============================================================================

// Global Game State
var GLOBAL_TIMER = 300; // 5:00 minutes total
var CURRENT_KM = 0.0;
var GLOBAL_SCORE = 0;
var SELECTED_RIDE = 'bike'; // 'bike' (Tesla Slapper) | 'rickshaw' (Baper Rasta) | 'bus' (Dhaka Unlimited)
var STATS_SLAPS = 0;
var STATS_BELLS = 0;
var STATS_PASSENGERS = 0;
var FLOWERS_COLLECTED = 0;
var GAME_INSTANCE = null;

// Unified Input State
window.gameInputs = {
    left: false,
    right: false,
    up: false,
    down: false,
    actionA: false,
    actionB: false
};

// ==========================================
// PART 1: EVALUATION PROTOCOL QUIZ
// ==========================================
const quizData = [
    { q: "You see a child trip. Do you laugh?", a: ["A. Yes, loudly", "B. Internal chuckle", "C. No, I help them"] },
    { q: "Is chaos a ladder or a headache?", a: ["A. Ladder", "B. Headache"] },
    { q: "Do you manipulate situations for fun?", a: ["A. Often", "B. Sometimes", "C. Never"] },
    { q: "If you kill a bug, do you feel sad?", a: ["A. No", "B. Maybe a little"] },
    { q: "Are emotions inefficient?", a: ["A. Yes", "B. Depends on the emotion"] },
    { q: "Do you get bored of 'nice' people?", a: ["A. Yes, they are boring", "B. No, they are safe"] },
    { q: "Is revenge a dish best served cold?", a: ["A. Yes", "B. Frozen solid"] },
    { q: "Can you lie without blinking?", a: ["A. Easy", "B. Try me"] },
    { q: "Do you plan conversations in advance?", a: ["A. Always", "B. No, I wing it"] },
    { q: "Are you the 'Psychopath' in this relationship?", a: ["A. Yes", "B. 100%"] },
    { q: "WAIT. Recalibrating... Are you the Boyfriend?", a: ["A. No", "B. I am the MAN"] },
    { q: "Who screams when they see a cockroach?", a: ["A. Me", "B. Him (High pitched scream)"] },
    { q: "If he gets a simple cold, what happens?", a: ["A. Takes meds", "B. Writes his Last Will & Testament"] },
    { q: "Who actually carries the heavy grocery bags?", a: ["A. Me, obviously", "B. His back hurts"] },
    { q: "When getting ready to go out, who takes longer?", a: ["A. Me", "B. Him (Fixing his hair for 40 mins)"] },
    { q: "Who is the 'Little Spoon' when cuddling?", a: ["A. Me", "B. Him (He needs to be held tenderly)"] },
    { q: "When he gets hungry, does he become...", a: ["A. A normal human", "B. An absolute Drama Queen"] },
    { q: "Who checks the scary noise at night?", a: ["A. Me with a cricket bat", "B. He hides under blanket"] },
    { q: "How much attention does he require daily?", a: ["A. Standard amount", "B. Needy Toddler Level"] },
    { q: "Does he secretly steal your skincare products?", a: ["A. No", "B. Yes, and denies it with glowing skin"] },
    { q: "If you are both tired, who complains more?", a: ["A. Me", "B. Him (Dramatic sighs & whining)"] },
    { q: "Who is more dramatic about minor injuries?", a: ["A. Me", "B. Him (Papercut = Emergency Surgery)"] },
    { q: "Does he require a specific pillow to sleep?", a: ["A. No", "B. Yes, he is very delicate"] },
    { q: "FINAL DIAGNOSIS: Is your boyfriend a PRINCESS?", a: ["A. Yes", "B. 1000% Yes"] },
    { q: "CALCULATING FINAL RESULT...", a: ["[ VIEW TRUTH ]"] }
];

let qIndex = 0;
const ui = document.getElementById('quiz-ui');
const qBox = document.getElementById('question-display');
const oBox = document.getElementById('options-display');
const qTrack = document.getElementById('question-tracker');
const pFill = document.getElementById('progress-fill');

function loadQuestion() {
    if (qIndex >= quizData.length) {
        endQuiz();
        return;
    }
    const data = quizData[qIndex];
    if (qTrack) qTrack.innerText = `EVALUATION ${qIndex + 1} / ${quizData.length}`;
    if (pFill) pFill.style.width = `${((qIndex + 1) / quizData.length) * 100}%`;
    qBox.innerText = data.q;
    oBox.innerHTML = "";

    data.a.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerText = ans;
        btn.onclick = () => {
            if (window.soundEngine) window.soundEngine.playSelect();
            qIndex++;
            loadQuestion();
        };
        oBox.appendChild(btn);
    });
}

function endQuiz() {
    qBox.innerText = "CALCULATING PATERNAL INSTINCTS...";
    oBox.innerHTML = "";
    if (window.soundEngine) window.soundEngine.playSelect();

    setTimeout(() => {
        qBox.innerHTML = "RESULT: <br><span style='font-size:26px; color:#ffffff; text-shadow:0 0 10px #00ff41;'>YOU ARE A GOOD DAD.</span>";
        setTimeout(() => {
            document.body.classList.add('glitch');
            if (window.soundEngine) window.soundEngine.playHit();
            setTimeout(() => {
                document.body.classList.remove('glitch');
                forceStartGame();
            }, 1200);
        }, 2500);
    }, 1500);
}

function forceStartGame() {
    if (ui) ui.style.display = 'none';
    const gw = document.getElementById('game-wrapper');
    if (gw) gw.style.display = 'block';
    const vc = document.getElementById('virtual-controls');
    if (vc) vc.style.display = 'block';

    if (window.soundEngine) {
        window.soundEngine.init();
        window.soundEngine.startBgm();
    }
    initPhaserGame();
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'o') {
        if (ui && ui.style.display !== 'none') forceStartGame();
    }
});

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
            e.preventDefault();
            window.gameInputs[inputKey] = val;
            if (val) {
                el.classList.add('active');
                if (navigator.vibrate) navigator.vibrate(15);
            } else {
                el.classList.remove('active');
            }
        };
        el.addEventListener('pointerdown', (e) => setVal(true, e));
        el.addEventListener('pointerup', (e) => setVal(false, e));
        el.addEventListener('pointercancel', (e) => setVal(false, e));
        el.addEventListener('pointerleave', (e) => setVal(false, e));
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
// PART 2: PHASER ARCHITECTURE & RETRO SPRITES
// ==========================================
function initPhaserGame() {
    if (GAME_INSTANCE) return;

    const config = {
        type: Phaser.AUTO,
        parent: 'game-wrapper',
        width: 960,
        height: 540,
        pixelArt: true,
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
            IntroScene,
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
// 1. BOOT SCENE: Assets & Procedural Retro Vehicles
// ----------------------------------------------------
class BootScene extends Phaser.Scene {
    constructor() { super("Boot"); }

    preload() {
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
        // Generate Procedural Textures for Dhaka Vehicles & Slap VFX
        this.createProceduralTextures();

        // Animations
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'l1' }, { key: 'l2' }, { key: 'l3' }, { key: 'l4' }, { key: 'l5' },
                { key: 'l6' }, { key: 'l7' }, { key: 'l8' }, { key: 'l9' }, { key: 'l10' }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'baba_walk',
            frames: [{ key: 'baba_w1' }, { key: 'baba_w2' }, { key: 'baba_w3' }],
            frameRate: 6,
            repeat: -1
        });

        this.scene.launch("UIScene");
        this.scene.start("IntroScene");
    }

    createProceduralTextures() {
        // 1. "BD Tesla" (Erratic Battery Auto-Rickshaw)
        if (!this.textures.exists('bd_tesla')) {
            const canvas = this.textures.createCanvas('bd_tesla', 52, 90);
            const ctx = canvas.context;
            // Roof / Chassis
            ctx.fillStyle = '#00bb55'; // Vibrant Dhaka Green
            ctx.fillRect(6, 12, 40, 68);
            // Yellow front hood
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(10, 2, 32, 14);
            // Black windshield
            ctx.fillStyle = '#111111';
            ctx.fillRect(12, 16, 28, 14);
            // Battery Box / Solar roof decal
            ctx.fillStyle = '#005522';
            ctx.fillRect(14, 34, 24, 36);
            // Headlights
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(10, 0, 8, 4);
            ctx.fillRect(34, 0, 8, 4);
            canvas.refresh();
        }

        // 2. "Baper Rasta" Traditional Dhaka Rickshaw
        if (!this.textures.exists('dhaka_rickshaw')) {
            const canvas = this.textures.createCanvas('dhaka_rickshaw', 54, 96);
            const ctx = canvas.context;
            // Passenger Hood (Rickshaw Hood Yellow & Red)
            ctx.fillStyle = '#ffcc00'; // Yellow Hood
            ctx.fillRect(8, 40, 38, 46);
            ctx.fillStyle = '#ee2233'; // Red Seat & Fringe
            ctx.fillRect(12, 46, 30, 30);
            // Driver Frame & Handlebar
            ctx.fillStyle = '#333333';
            ctx.fillRect(24, 18, 6, 24);
            ctx.fillRect(14, 22, 26, 4);
            // Front Wheel
            ctx.fillStyle = '#111111';
            ctx.fillRect(25, 4, 4, 16);
            // Two Rear Wheels
            ctx.fillRect(4, 55, 4, 26);
            ctx.fillRect(46, 55, 4, 26);
            // Driver Head / T-Shirt
            ctx.fillStyle = '#2277bb';
            ctx.beginPath();
            ctx.arc(27, 28, 7, 0, Math.PI * 2);
            ctx.fill();
            canvas.refresh();
        }

        // 3. Comic Slap Hand Sprite
        if (!this.textures.exists('slap_hand')) {
            const canvas = this.textures.createCanvas('slap_hand', 48, 48);
            const ctx = canvas.context;
            ctx.fillStyle = '#ffcc88';
            ctx.beginPath();
            ctx.arc(24, 26, 14, 0, Math.PI * 2);
            ctx.fill();
            // Fingers
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(13 + i * 6, 6, 5, 16);
            }
            // Thumb
            ctx.fillRect(36, 20, 8, 6);
            // Outline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            canvas.refresh();
        }
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
// 3. INTRO SCENE: 3:00 AM Crisis (Mohammadpur Date)
// ----------------------------------------------------
class IntroScene extends Phaser.Scene {
    constructor() { super("IntroScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.cameras.main.setBackgroundColor('#020603');

        this.add.text(w / 2, 120, "3:00 AM — MIRPUR 10, DHAKA", {
            fontFamily: 'Courier New, monospace',
            fontSize: '26px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(1200, () => {
            if (window.soundEngine) window.soundEngine.playTone(880, 'sine', 0.1);
            this.add.text(w / 2, 200, "📩 EMERGENCY MESSAGE FROM MOMO", {
                fontFamily: 'Courier New, monospace',
                fontSize: '19px',
                color: '#ffcc00',
                backgroundColor: '#051808',
                padding: { x: 10, y: 6 }
            }).setOrigin(0.5);
        });

        this.time.delayedCall(2400, () => {
            if (window.soundEngine) window.soundEngine.playHit();
            this.add.text(w / 2, 280, "\"TUMI EKHONO MOHAMMADPUR ASHONI?! I HATE YOU!\"", {
                fontFamily: 'Courier New, monospace',
                fontSize: '23px',
                color: '#ff3333',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });

        this.time.delayedCall(3800, () => {
            this.add.text(w / 2, 360, "LIAN: \"Our date at Town Hall! I must sneak out and get to Mohammadpur right now!\"", {
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                color: '#00ff41',
                align: 'center'
            }).setOrigin(0.5);
        });

        const startBtn = this.add.text(w / 2, 450, "[ TAP OR PRESS ENTER TO SNEAK OUT OF HOME ]", {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#000000',
            backgroundColor: '#00ff41',
            fontStyle: 'bold',
            padding: { x: 18, y: 10 }
        }).setOrigin(0.5).setInteractive();

        const proceed = () => {
            if (window.soundEngine) window.soundEngine.playSelect();
            this.scene.start("LevelSneak");
        };

        startBtn.on('pointerdown', proceed);
        this.input.keyboard.on('keydown-ENTER', proceed);
        this.input.keyboard.on('keydown-SPACE', proceed);
    }
}

// ----------------------------------------------------
// 4. LEVEL 1: SNEAK OUT OF HOME (Mirpur 10, 0.0 KM)
// ----------------------------------------------------
class LevelSneak extends Phaser.Scene {
    constructor() { super("LevelSneak"); }

    create() {
        CURRENT_KM = 0.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Mirpur 10 (Home)", "ON FOOT");
        this.gpsHUD.showLandmarkToast("Mirpur 10", "Sneak past Baba to unlock the front door!");

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

        this.baba = this.physics.add.sprite(620, 200, 'baba_idle').setScale(0.6).play('baba_walk');
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
                this.gpsHUD.showLandmarkToast("Door Key Collected", "Now head to front door to pick your ride!");
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

        const left = this.cursors.left.isDown || this.wasd.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || window.gameInputs.right;
        const up = this.cursors.up.isDown || this.wasd.up.isDown || window.gameInputs.up;
        const down = this.cursors.down.isDown || this.wasd.down.isDown || window.gameInputs.down;

        this.player.setVelocity(0);
        const speed = 210;

        if (left) {
            this.player.setVelocityX(-speed);
            this.player.flipX = true;
            this.player.anims.play('run', true);
        } else if (right) {
            this.player.setVelocityX(speed);
            this.player.flipX = false;
            this.player.anims.play('run', true);
        }

        if (up) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('run', true);
        } else if (down) {
            this.player.setVelocityY(speed);
            this.player.anims.play('run', true);
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
// ----------------------------------------------------
class RideSelectScene extends Phaser.Scene {
    constructor() { super("RideSelectScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
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
            170, 270, "🏍️ BIKE RUSH", "BD Tesla Slapper Mode",
            "Fast & agile! Slap erratic battery Teslas (+10/+50 pts)!\n[A/Space]: SLAP | [B/Down]: Nitro Boost",
            0x00e5ff, 'bike', 'hunda_top', 0.5
        );

        // Card 2: 🛺 RICKSHAW: Baper Rasta
        this.createRideCard(
            480, 270, "🛺 RICKSHAW", "Baper Rasta Mode",
            "Drive like it's your father's road! Ring the bell!\n[A/Space]: TRING BELL | [B/Down]: Turbo Pedal",
            0xffcc00, 'rickshaw', 'dhaka_rickshaw', 1.0
        );

        // Card 3: 🚌 BUS: Dhaka Unlimited
        this.createRideCard(
            790, 270, "🚌 LOCAL BUS", "Dhaka Unlimited Mode",
            "Heavy transport! Blare pneumatic air horn to clear traffic!\n[A/Space]: AIR HORN | [B/Down]: Turbo Diesel",
            0xff3366, 'bus', 'bus_top', 0.55
        );

        this.add.text(w / 2, 495, "💡 Every mode takes you to Momo's Date Spot in Mohammadpur!", {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#888888'
        }).setOrigin(0.5);
    }

    createRideCard(x, y, title, subtitle, desc, strokeColor, modeKey, spriteKey, scale) {
        const card = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 270, 360, 0x051408, 0.95)
            .setStrokeStyle(2, strokeColor)
            .setInteractive();

        const t1 = this.add.text(0, -145, title, {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
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

        const selectThis = () => {
            SELECTED_RIDE = modeKey;
            if (window.soundEngine) {
                if (modeKey === 'bike') window.soundEngine.playSlap();
                else if (modeKey === 'rickshaw') window.soundEngine.playBell();
                else window.soundEngine.playAirHorn();
            }
            this.scene.start("LevelRoadRush");
        };

        bg.on('pointerdown', selectThis);
        btn.setInteractive().on('pointerdown', selectThis);

        bg.on('pointerover', () => { bg.setFillStyle(0x0a2810); card.setScale(1.03); });
        bg.on('pointerout', () => { bg.setFillStyle(0x051408); card.setScale(1.0); });
    }
}

// ----------------------------------------------------
// 6. LEVEL: DHAKA ROAD RUSH (Mirpur 10 -> Mohammadpur, 8.8 KM)
// Incorporating BD Tesla Slapper / Baper Rasta / Dhaka Unlimited
// ----------------------------------------------------
class LevelRoadRush extends Phaser.Scene {
    constructor() { super("LevelRoadRush"); }

    create() {
        CURRENT_KM = 0.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        const modeTitle = SELECTED_RIDE === 'bike' ? 'BD TESLA SLAPPER' : SELECTED_RIDE === 'rickshaw' ? 'BAPER RASTA' : 'DHAKA UNLIMITED';
        this.gpsHUD.create(CURRENT_KM, "Mirpur 10 Circle", modeTitle);
        this.gpsHUD.showLandmarkToast("Starting Date Rush", `Mode: ${modeTitle} | Destination: Mohammadpur Town Hall!`);

        // Road Parallax TileSprite
        this.road = this.add.tileSprite(480, 270, 960, 540, 'road');

        // Vehicle Setup based on selection
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

        // Slap hand sprite for Bike Mode
        this.slapSprite = this.add.sprite(0, 0, 'slap_hand').setVisible(false).setDepth(200);

        // Groups: Teslas, Traffic Vehicles, Gifts (Flowers/Chocos)
        this.teslas = this.physics.add.group();
        this.traffic = this.physics.add.group();
        this.gifts = this.physics.add.group();

        // Mode Specific Score Display
        this.scoreBox = this.add.container(18, 55).setScrollFactor(0).setDepth(9000);
        const sBg = this.add.rectangle(80, 0, 160, 28, 0x000000, 0.85).setStrokeStyle(1, 0x00ff41);
        this.scoreLabel = this.add.text(80, 0, this.getScoreText(), {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#ffcc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.scoreBox.add([sBg, this.scoreLabel]);

        // Spawners
        this.spawner = this.time.addEvent({
            delay: SELECTED_RIDE === 'bike' ? 850 : 1000,
            callback: this.spawnRoadObstacles,
            callbackScope: this,
            loop: true
        });

        // Gift Spawner (Flowers & Chocos along Shyamoli / Asad Gate for Momo)
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

        // Overlaps
        this.physics.add.overlap(this.player, this.gifts, (p, g) => {
            g.destroy();
            FLOWERS_COLLECTED++;
            if (window.soundEngine) window.soundEngine.playCollect();
            this.gpsHUD.showLandmarkToast("Date Gift Collected!", `Picked up roses & chocolates (${FLOWERS_COLLECTED} collected)!`);
        });

        this.physics.add.overlap(this.player, this.traffic, (p, t) => {
            t.destroy();
            if (window.soundEngine) window.soundEngine.playHit();
            this.cameras.main.shake(160, 0.015);
            GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 4);
        });

        this.physics.add.overlap(this.player, this.teslas, (p, t) => {
            // Collision with Tesla
            t.destroy();
            if (window.soundEngine) window.soundEngine.playHit();
            this.cameras.main.shake(180, 0.02);
            GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 6);
            this.gpsHUD.showLandmarkToast("CRASH!", "Erratic Tesla bumped into you! -6s");
        });

        // Distance & Landmark Progression to Mohammadpur (8.8 KM)
        this.distCovered = 0.0;
        this.kmTimer = this.time.addEvent({
            delay: 350,
            loop: true,
            callback: () => {
                const step = SELECTED_RIDE === 'bike' ? 0.08 : SELECTED_RIDE === 'rickshaw' ? 0.05 : 0.07;
                this.distCovered += step;
                CURRENT_KM = parseFloat(this.distCovered.toFixed(1));

                // Checkpoint Triggers
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
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
            // Spawn erratic Battery Tesla
            const isWrongWay = Math.random() > 0.55;
            const speed = isWrongWay ? 460 : 320;
            const tesla = this.teslas.create(x, -90, 'bd_tesla').setScale(0.85).setVelocityY(speed);
            tesla.isWrongWay = isWrongWay;
            if (isWrongWay) tesla.setTint(0xff5555); // Red glow for wrong side!
            tesla.body.setSize(44, 80);
        } else {
            // Regular Traffic (Bus or Car)
            const bus = this.traffic.create(x, -110, 'bus_top').setScale(0.5).setVelocityY(380);
            bus.body.setSize(50, 120);
        }
    }

    handleAction() {
        if (SELECTED_RIDE === 'bike') {
            // 💥 BD TESLA SLAPPER ACTION: Slap nearby Teslas!
            if (window.soundEngine) window.soundEngine.playSlap();

            // Find closest Tesla within slap range
            let slapped = false;
            this.teslas.children.iterate((t) => {
                if (t && t.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y) < 130) {
                    slapped = true;
                    const pts = t.isWrongWay ? 50 : 10;
                    STATS_SLAPS++;
                    GLOBAL_SCORE += pts;
                    this.scoreLabel.setText(this.getScoreText());

                    // Visual Slap Animation
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

                    // Floating Slap Text
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

                    // Tesla spins out from the slap!
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
                // Slapped the air
                this.slapSprite.setPosition(this.player.x + 35, this.player.y - 20).setVisible(true).setScale(1);
                this.time.delayedCall(150, () => this.slapSprite.setVisible(false));
            }

        } else if (SELECTED_RIDE === 'rickshaw') {
            // 🛺 BAPER RASTA ACTION: Ring the Bell ("Tring Tring!")
            if (window.soundEngine) window.soundEngine.playBell();
            STATS_BELLS++;
            this.scoreLabel.setText(this.getScoreText());

            // Scare away road obstacles
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

            // Scatters nearby traffic away
            this.traffic.children.iterate((tr) => {
                if (tr && tr.active && Math.abs(tr.y - this.player.y) < 180) {
                    tr.setVelocityX(tr.x > this.player.x ? 160 : -160);
                }
            });

        } else {
            // 🚌 DHAKA UNLIMITED ACTION: Pneumatic Air Horn ("PAWWWWN!")
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

            // Blaring horn clears lane ahead
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
            `You made it across 8.8 KM from Mirpur to Mohammadpur Town Hall via <b>${SELECTED_RIDE.toUpperCase()}</b>!<br><br>Gifts collected for Momo: <b>${FLOWERS_COLLECTED} Roses & Chocolates</b>.<br><br>Momo is waiting outside her apartment... looking furious!`,
            ["CONFRONT MOMO & FIX THE DATE"],
            () => {
                this.scene.start("LevelBoss");
            }
        );
    }

    update() {
        const boost = this.cursors.space.isDown || window.gameInputs.actionB;
        const baseSpeed = SELECTED_RIDE === 'bike' ? 14 : SELECTED_RIDE === 'rickshaw' ? 9 : 12;
        const scrollSpeed = boost ? baseSpeed * 1.5 : baseSpeed;
        this.road.tilePositionY -= scrollSpeed;

        const left = this.cursors.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || window.gameInputs.right;
        const action = Phaser.Input.Keyboard.JustDown(this.spaceKey) || window.gameInputs.actionA;

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
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        const left = this.cursors.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || window.gameInputs.right;
        const shoot = Phaser.Input.Keyboard.JustDown(this.spaceKey) || window.gameInputs.actionA;

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

window.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});
