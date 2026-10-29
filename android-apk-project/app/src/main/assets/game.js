// ============================================================================
// PROJECT PSYCO: MOMO & LIAN (DHAKA RETRO EDITION)
// Full Rebuild: Real Dhaka Map, Real Distances, Retro 2D Logic & Offline Engine
// ============================================================================

// Global Game State
var GLOBAL_TIMER = 300; // 5:00 minutes total
var CURRENT_KM = 0.0;
var GLOBAL_SCORE = 0;
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
// PART 1: PSYCH_EVAL_PROTOCOL QUIZ DATA
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

// Keyboard quick bypass: Press 'O' to skip directly to game
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'o') {
        if (ui && ui.style.display !== 'none') {
            forceStartGame();
        }
    }
});

// ==========================================
// IN-GAME RETRO MODAL HELPER (No alerts/prompts)
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
// ENGINEERING PENALTY & MOMO TRAP QUESTIONS
// ==========================================
const mathProblems = [
    { q: "Calculate Torque: Force = 10 N, Radius = 2 m", a: ["20 N·m", "5 N·m", "12 N·m"], c: 0 },
    { q: "What is the derivative of x²?", a: ["x", "2x", "x³"], c: 1 },
    { q: "Ohm's Law formula?", a: ["V = I × R", "V = I / R", "V = R / I"], c: 0 },
    { q: "Binary equivalent of decimal 5?", a: ["100", "110", "101"], c: 2 },
    { q: "Definite integral of 2x dx from 0 to 2?", a: ["4", "8", "2"], c: 0 }
];

const trapQuestions = [
    { q: "Do I look fat in this dress?", a: ["No, you look stunning!", "Maybe a little bit...", "I like curves anyway"], c: 0 },
    { q: "Who is prettier, me or your ex?", a: ["You, by an infinite margin!", "My ex was okay I guess", "Different styles"], c: 0 },
    { q: "Momo says: 'It's fine.' What does that mean?", a: ["It means it's fine", "It's NOT FINE (IMMEDIATE RED ALERT)", "She is happy"], c: 1 },
    { q: "Do you remember the date of our first meeting?", a: ["Of course! I never forget", "Uhhh... was it Tuesday?", "Last year?"], c: 0 },
    { q: "If I woke up as a worm tomorrow, would you still love me?", a: ["Yes, I will keep you in a luxury terrarium", "Eww, worms are gross", "Idk"], c: 0 }
];

// ==========================================
// PART 2: PHASER GAME ENGINE ARCHITECTURE
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
            MapScene,
            LevelSneak,
            LevelRun,
            LevelCollect,
            LevelBus,
            LevelBargain,
            LevelBike,
            LevelBoss,
            WinScene
        ]
    };

    GAME_INSTANCE = new Phaser.Game(config);
    setupTouchControls();
}

// ----------------------------------------------------
// 1. BOOT SCENE: Preload Assets & Build Animations
// ----------------------------------------------------
class BootScene extends Phaser.Scene {
    constructor() { super("Boot"); }

    preload() {
        this.load.path = 'assets/sprites/';

        // Backgrounds & Environments
        this.load.image('home', 'home.jpg');
        this.load.image('city', 'evening city.png');
        this.load.image('road', 'vangarasta.png');
        this.load.image('boss', 'boss-office.png');

        // Characters & Vehicles
        this.load.image('baba_idle', 'baba.png');
        this.load.image('baba_w1', 'walkbaba.png');
        this.load.image('baba_w2', 'walkbaba1.png');
        this.load.image('baba_w3', 'walkbaba2.png');
        this.load.image('pathao_single', 'bikeride.png');
        this.load.image('dog_sleep', 'kuttasleep.jpg');
        this.load.image('dog_bark', 'kuttavau.png');
        this.load.image('bus_side', 'poristhanside.png');
        this.load.image('bus_top', 'bus-topdown.png');
        this.load.image('hunda_top', 'top_bike.png');
        this.load.image('hunda_side', 'hunda.png');
        this.load.image('momo_angry', 'momo-boss.png');
        this.load.image('momo_happy', 'momo-happy.png');

        // Items & VFX
        this.load.image('files', 'files.png');
        this.load.image('golla', 'golla.png');
        this.load.image('heart', 'heart.png');
        this.load.image('choco', 'choco.png');
        this.load.image('flower', 'flower.png');
        this.load.image('keys', 'keys.png');
        this.load.image('win', 'win.png');

        // 10-Frame Lian Running Animation
        for (let i = 1; i <= 10; i++) {
            this.load.image(`l${i}`, `l${i}.png`);
        }
        this.load.image('jump_pose', 'l9.png');

        // Loading bar display
        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0x00ff41, 1);
            progress.fillRect(280, 260, 400 * value, 20);
        });
        this.load.on('complete', () => {
            progress.destroy();
        });
    }

    create() {
        // Player Run Animation
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'l1' }, { key: 'l2' }, { key: 'l3' }, { key: 'l4' }, { key: 'l5' },
                { key: 'l6' }, { key: 'l7' }, { key: 'l8' }, { key: 'l9' }, { key: 'l10' }
            ],
            frameRate: 15,
            repeat: -1
        });

        // Baba Walk Animation
        this.anims.create({
            key: 'baba_walk',
            frames: [{ key: 'baba_w1' }, { key: 'baba_w2' }, { key: 'baba_w3' }],
            frameRate: 6,
            repeat: -1
        });

        this.scene.launch("UIScene");
        this.scene.start("IntroScene");
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
        const bg = this.add.rectangle(0, 0, 150, 32, 0x000000, 0.85).setStrokeStyle(1.5, 0x00ff41);
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
                    showRetroModal("TIME EXPIRED!", "Momo blocked you everywhere and went offline.<br>You couldn't make it in time!", ["RETRY JOURNEY"], () => {
                        GLOBAL_TIMER = 300;
                        location.reload();
                    });
                }
            }
        });
    }

    flashPenalty() {
        this.timerText.setColor('#ff0000');
        this.cameras.main.shake(150, 0.01);
        this.time.delayedCall(800, () => {
            this.timerText.setColor('#00ff41');
        });
    }
}

// ----------------------------------------------------
// 3. INTRO SCENE: 3:00 AM Crisis
// ----------------------------------------------------
class IntroScene extends Phaser.Scene {
    constructor() { super("IntroScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.cameras.main.setBackgroundColor('#020603');

        const title = this.add.text(w / 2, 130, "3:00 AM — MIRPUR 10, DHAKA", {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.delayedCall(1200, () => {
            if (window.soundEngine) window.soundEngine.playTone(880, 'sine', 0.1);
            this.add.text(w / 2, 210, "📩 1 UNREAD MESSAGE FROM MOMO", {
                fontFamily: 'Courier New, monospace',
                fontSize: '20px',
                color: '#ffcc00',
                backgroundColor: '#051808',
                padding: { x: 10, y: 6 }
            }).setOrigin(0.5);
        });

        this.time.delayedCall(2400, () => {
            if (window.soundEngine) window.soundEngine.playHit();
            this.add.text(w / 2, 290, "\"I HATE YOU. DO NOT CALL ME.\"", {
                fontFamily: 'Courier New, monospace',
                fontSize: '26px',
                color: '#ff3333',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });

        this.time.delayedCall(3800, () => {
            this.add.text(w / 2, 370, "LIAN: \"Wait... SHE'S SERIOUS?! I MUST GO TO GULSHAN RIGHT NOW!\"", {
                fontFamily: 'Courier New, monospace',
                fontSize: '18px',
                color: '#00ff41'
            }).setOrigin(0.5);
        });

        const startBtn = this.add.text(w / 2, 460, "[ TAP OR PRESS ENTER TO VIEW DHAKA ROUTE MAP ]", {
            fontFamily: 'Courier New, monospace',
            fontSize: '17px',
            color: '#ffffff',
            backgroundColor: '#004411',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive();

        const proceed = () => {
            if (window.soundEngine) window.soundEngine.playSelect();
            this.scene.start("MapScene");
        };

        startBtn.on('pointerdown', proceed);
        this.input.keyboard.on('keydown-ENTER', proceed);
        this.input.keyboard.on('keydown-SPACE', proceed);
    }
}

// ----------------------------------------------------
// 4. MAP SCENE: Authentic Dhaka GPS Route Briefing
// ----------------------------------------------------
class MapScene extends Phaser.Scene {
    constructor() { super("MapScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.cameras.main.setBackgroundColor('#030804');

        this.add.text(w / 2, 38, "🗺️ DHAKA GPS ROUTE DISPATCH (14.2 KM)", {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 68, "DESTINATION: MOMO'S RESIDENCE (GULSHAN 2)", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffcc00'
        }).setOrigin(0.5);

        // Render Dhaka Road Stops
        DHAKA_ROUTE.forEach((pt, idx) => {
            const y = 115 + idx * 52;
            const marker = this.add.circle(100, y, 9, 0x00ff41).setStrokeStyle(2, 0xffffff);
            
            this.add.text(125, y - 10, `${idx + 1}. ${pt.name} (${pt.km} KM)`, {
                fontFamily: 'Courier New, monospace',
                fontSize: '15px',
                color: '#ffffff',
                fontStyle: 'bold'
            });

            this.add.text(125, y + 8, `🚩 ${pt.landmark} — ${pt.desc}`, {
                fontFamily: 'Courier New, monospace',
                fontSize: '11px',
                color: '#aaaaaa'
            });

            if (idx < DHAKA_ROUTE.length - 1) {
                this.add.line(0, 0, 100, y + 9, 100, y + 43, 0x00ff41).setOrigin(0);
            }
        });

        const goBtn = this.add.text(w / 2, 500, "[ START LEVEL 1: SNEAK OUT OF HOME (0.0 KM) ]", {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#000000',
            backgroundColor: '#00ff41',
            fontStyle: 'bold',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        const begin = () => {
            if (window.soundEngine) window.soundEngine.playSelect();
            this.scene.start("LevelSneak");
        };

        goBtn.on('pointerdown', begin);
        this.input.keyboard.on('keydown-SPACE', begin);
        this.input.keyboard.on('keydown-ENTER', begin);
    }
}

// ----------------------------------------------------
// 5. LEVEL 1: SNEAK OUT OF HOME (Mirpur 10, 0.0 KM)
// ----------------------------------------------------
class LevelSneak extends Phaser.Scene {
    constructor() { super("LevelSneak"); }

    create() {
        CURRENT_KM = 0.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Mirpur 10 (Home)");
        this.gpsHUD.showLandmarkToast("Mirpur 10", "Sneak past Baba to reach the front door!");

        // Living room background
        this.add.image(480, 270, 'home').setDisplaySize(960, 540);

        // Invisible room bounds and walls
        this.walls = this.physics.add.staticGroup();
        this.walls.add(this.add.rectangle(480, 50, 960, 30));   // Top wall
        this.walls.add(this.add.rectangle(480, 530, 960, 30));  // Bottom wall
        this.walls.add(this.add.rectangle(10, 270, 30, 540));   // Left wall
        this.walls.add(this.add.rectangle(950, 270, 30, 540));  // Right wall
        this.walls.add(this.add.rectangle(480, 180, 24, 240));  // Partition wall
        this.walls.add(this.add.rectangle(480, 430, 24, 140));  // Living divider
        this.walls.children.iterate(w => w.setVisible(false));

        // Front Door Keys
        this.hasKeys = false;
        this.keySprite = this.physics.add.sprite(340, 220, 'keys').setScale(0.08);
        this.keyText = this.add.text(340, 195, "DOOR KEYS", { fontSize: '11px', backgroundColor: '#000' }).setOrigin(0.5);

        // Player (Lian)
        this.player = this.physics.add.sprite(120, 180, 'l1').setScale(0.5);
        this.player.body.setSize(40, 40).setOffset(20, 80);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.walls);

        // Baba (Patrolling Dad)
        this.baba = this.physics.add.sprite(620, 200, 'baba_idle').setScale(0.6).play('baba_walk');
        this.baba.body.setSize(45, 45).setOffset(20, 80);

        this.alertText = this.add.text(this.baba.x, this.baba.y - 60, '', {
            fontSize: '24px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Waypoints for Baba's patrol
        this.patrolPoints = [
            { x: 580, y: 340 },
            { x: 780, y: 340 },
            { x: 780, y: 160 },
            { x: 580, y: 160 }
        ];
        this.patrolIdx = 0;
        this.moveBaba();

        // Front Exit Door (Bottom Right)
        this.exitDoor = this.add.rectangle(910, 480, 60, 90, 0x00ff41, 0.25).setStrokeStyle(2, 0x00ff41);
        this.physics.add.existing(this.exitDoor, true);

        this.doorLabel = this.add.text(910, 480, "LOCKED\nNEED KEY", {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: '#ff3333',
            align: 'center'
        }).setOrigin(0.5);

        // Pick up keys overlap
        this.physics.add.overlap(this.player, this.keySprite, () => {
            if (!this.hasKeys) {
                this.hasKeys = true;
                if (window.soundEngine) window.soundEngine.playCollect();
                this.keySprite.destroy();
                this.keyText.destroy();
                this.doorLabel.setText("EXIT\nOPEN!").setColor('#00ff41');
                this.gpsHUD.showLandmarkToast("Keys Collected", "Now sneak to the front door!");
            }
        });

        // Exit door overlap
        this.physics.add.overlap(this.player, this.exitDoor, () => {
            if (this.hasKeys) {
                if (window.soundEngine) window.soundEngine.playWin();
                this.scene.start("LevelRun");
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
        // Patrol waypoint checking
        const pt = this.patrolPoints[this.patrolIdx];
        if (Phaser.Math.Distance.Between(this.baba.x, this.baba.y, pt.x, pt.y) < 15) {
            this.patrolIdx = (this.patrolIdx + 1) % this.patrolPoints.length;
            this.time.delayedCall(400, () => this.moveBaba());
        }

        // Unified Input
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

        // Baba detection proximity
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.baba.x, this.baba.y);
        if (dist < 110) {
            this.alertText.setText("❗ 'KIRE? ETO RAATE KOI JASH?!'");
            if (dist < 55) {
                if (window.soundEngine) window.soundEngine.playHit();
                this.cameras.main.shake(250, 0.015);
                this.player.setPosition(120, 180);
                this.alertText.setText("CAUGHT! SENT BACK TO BED!");
                this.time.delayedCall(1200, () => this.alertText.setText(''));
            }
        } else if (dist < 180) {
            this.alertText.setText("❓ 'SHOBDO KISHER?'");
        } else {
            this.alertText.setText('');
        }
    }
}

// ----------------------------------------------------
// 6. LEVEL 2: CITY SPRINT (Rokeya Sarani / Agargaon, 2.5 KM)
// ----------------------------------------------------
class LevelRun extends Phaser.Scene {
    constructor() { super("LevelRun"); }

    create() {
        CURRENT_KM = 2.5;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Agargaon Metro (MRT Line 6)");
        this.gpsHUD.showLandmarkToast("Rokeya Sarani", "Avoid sleeping dogs & solve boss paperwork penalties!");

        // Parallax Dhaka City background
        this.bg = this.add.tileSprite(480, 270, 960, 540, 'city');

        // Flying Office Boss
        this.boss = this.add.image(860, 280, 'boss').setScale(0.85).setDepth(50);
        this.tweens.add({
            targets: this.boss,
            y: 330,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Player Runner
        this.player = this.physics.add.sprite(140, 420, 'l1').setScale(0.75).setDepth(100);
        this.player.setGravityY(1400);
        this.player.setCollideWorldBounds(true);

        // Ground Collider
        this.ground = this.add.rectangle(480, 510, 960, 30, 0x000000, 0);
        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground);

        // Obstacle Groups
        this.obstacles = this.physics.add.group();
        this.obstacleTimer = this.time.addEvent({
            delay: 1800,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

        // 20-second survival countdown for Agargaon segment
        this.timeLeft = 20;
        this.statusText = this.add.text(18, 55, 'Survive Boss Rush: 20s', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.timeLeft--;
                this.statusText.setText(`Survive Boss Rush: ${this.timeLeft}s`);
                if (this.timeLeft <= 0) {
                    this.obstacleTimer.remove();
                    showRetroModal("MOMO INCOMING CALL!", "📱 MOMO: 'Ekhono tmi phone deona! Etokhone to maf chaoa uchit silo!'<br><br>LIAN: 'I'm rushing as fast as I can! Getting flowers now!'", ["CONTINUE TO CRESCENT LAKE"], () => {
                        this.scene.start("LevelCollect");
                    });
                }
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.isSlowed = false;
    }

    spawnObstacle() {
        const type = Phaser.Math.Between(0, 1);
        if (type === 0) {
            // Sleeping Dhaka Street Dog
            const dog = this.obstacles.create(960, 475, 'dog_sleep').setScale(0.16);
            dog.setVelocityX(-380);
            dog.body.setAllowGravity(false);
            dog.obsType = "dog";
        } else {
            // Urgent Work Files thrown by Boss
            const file = this.obstacles.create(850, 320, 'files').setScale(0.22);
            file.setVelocityX(-460);
            file.body.setAllowGravity(false);
            file.obsType = "file";
        }
    }

    hitObstacle(player, obs) {
        if (!obs.active) return;

        if (obs.obsType === "dog") {
            obs.setTexture('dog_bark');
            obs.obsType = "barked";
            if (window.soundEngine) window.soundEngine.playBark();
            this.isSlowed = true;
            player.setTint(0xff5555);
            this.cameras.main.shake(120, 0.01);
            this.time.delayedCall(1200, () => {
                this.isSlowed = false;
                player.clearTint();
            });
            obs.destroy();
        } else if (obs.obsType === "file") {
            obs.destroy();
            this.physics.pause();
            if (window.soundEngine) window.soundEngine.playHit();

            const prob = mathProblems[Phaser.Math.Between(0, mathProblems.length - 1)];
            showRetroModal("⚠️ ENGINEERING PENALTY!", `Boss caught you with urgent engineering tasks!<br><b>${prob.q}</b>`, prob.a, (selectedIdx) => {
                this.physics.resume();
                if (selectedIdx === prob.c) {
                    this.gpsHUD.showLandmarkToast("Solved!", "Paperwork handled. No delay!");
                    if (window.soundEngine) window.soundEngine.playCollect();
                } else {
                    GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 10);
                    this.gpsHUD.showLandmarkToast("Incorrect!", "-10 Seconds Lost!");
                    const uiScene = this.scene.get("UIScene");
                    if (uiScene) uiScene.flashPenalty();
                }
            });
        }
    }

    update() {
        this.bg.tilePositionX += this.isSlowed ? 2 : 6;

        const jump = this.cursors.up.isDown || this.cursors.space.isDown || window.gameInputs.up || window.gameInputs.actionA;
        const duck = this.cursors.down.isDown || window.gameInputs.down || window.gameInputs.actionB;

        if (this.player.body.touching.down) {
            if (jump) {
                this.player.setVelocityY(-720);
                this.player.setTexture('jump_pose');
                if (window.soundEngine) window.soundEngine.playJump();
            } else if (duck) {
                this.player.body.setSize(45, 60).setOffset(10, 50);
                this.player.anims.play('run', true);
                this.player.setTint(0x888888);
            } else {
                this.player.body.setSize(45, 120).setOffset(10, 10);
                this.player.clearTint();
                if (!this.isSlowed) this.player.anims.play('run', true);
            }
        } else {
            this.player.setTexture('jump_pose');
        }
    }
}

// ----------------------------------------------------
// 7. LEVEL 3: FLOWER & CHOCOLATE COLLECT (Sangsad / Crescent Lake, 5.1 KM)
// ----------------------------------------------------
class LevelCollect extends Phaser.Scene {
    constructor() { super("LevelCollect"); }

    create() {
        CURRENT_KM = 5.1;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Jatiya Sangsad & Crescent Lake");
        this.gpsHUD.showLandmarkToast("Crescent Lake", "Collect 10 fresh roses & chocolates for Momo!");

        this.bg = this.add.tileSprite(480, 270, 960, 540, 'city');

        // Free 2D Movement
        this.player = this.physics.add.sprite(150, 360, 'l1').play('run').setScale(0.75).setDepth(100);
        this.player.setCollideWorldBounds(true);

        this.itemsGroup = this.physics.add.group();
        this.itemSpawner = this.time.addEvent({
            delay: 1100,
            callback: () => {
                const y = Phaser.Math.Between(220, 480);
                const isChoco = Math.random() > 0.5;
                const item = this.itemsGroup.create(960, y, isChoco ? 'choco' : 'flower')
                    .setScale(isChoco ? 0.12 : 0.15)
                    .setVelocityX(-220);
                item.body.setAllowGravity(false);
                item.isChoco = isChoco;
            },
            loop: true
        });

        this.count = 0;
        this.countText = this.add.text(18, 55, 'Gifts Collected: 0 / 10', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#ffcc00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.itemsGroup, (p, item) => {
            item.destroy();
            this.count++;
            if (window.soundEngine) window.soundEngine.playCollect();
            this.countText.setText(`Gifts Collected: ${this.count} / 10`);

            if (this.count >= 10 && !this.busArrived) {
                this.busArrived = true;
                this.itemSpawner.remove();
                this.spawnBusArrival();
            }
        });
    }

    spawnBusArrival() {
        this.bus = this.physics.add.sprite(960, 380, 'bus_side').setScale(0.55).setImmovable(true).setDepth(90);
        if (window.soundEngine) window.soundEngine.playHorn();

        this.tweens.add({
            targets: this.bus,
            x: 750,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                this.gpsHUD.showLandmarkToast("Poristhan Bus Arrived!", "Walk to the bus door to board!");
                this.physics.add.overlap(this.player, this.bus, () => {
                    this.scene.start("LevelBus");
                });
            }
        });
    }

    update() {
        this.bg.tilePositionX += 4;
        this.player.setVelocity(0);
        const speed = 250;

        const left = this.cursors.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || window.gameInputs.right;
        const up = this.cursors.up.isDown || window.gameInputs.up;
        const down = this.cursors.down.isDown || window.gameInputs.down;

        if (left) this.player.setVelocityX(-speed);
        if (right) this.player.setVelocityX(speed);
        if (up) this.player.setVelocityY(-speed);
        if (down) this.player.setVelocityY(speed);
    }
}

// ----------------------------------------------------
// 8. LEVEL 4: DHAKA BUS TRAFFIC RUSH (Farmgate, 7.8 KM)
// ----------------------------------------------------
class LevelBus extends Phaser.Scene {
    constructor() { super("LevelBus"); }

    create() {
        CURRENT_KM = 7.8;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Farmgate & Bijoy Sarani");
        this.gpsHUD.showLandmarkToast("Farmgate Intersection", "Steer the Poristhan Bus through Dhaka gridlock!");

        // Road Top-Down Texture
        this.road = this.add.tileSprite(480, 270, 960, 540, 'road');

        // Player's Poristhan Bus
        this.player = this.physics.add.sprite(480, 430, 'bus_top').setScale(0.55);
        this.player.body.setSize(55, 130);

        this.traffic = this.physics.add.group();
        this.trafficTimer = this.time.addEvent({
            delay: 900,
            callback: () => {
                const x = Phaser.Math.Between(260, 700);
                const vehicle = this.traffic.create(x, -100, 'bus_top').setScale(0.55).setTint(0xff5555).setVelocityY(380);
                vehicle.body.setSize(55, 130);
            },
            loop: true
        });

        this.hits = 0;
        this.physics.add.overlap(this.player, this.traffic, (p, t) => {
            if (t.active) {
                t.destroy();
                this.hits++;
                if (window.soundEngine) window.soundEngine.playHit();
                this.cameras.main.shake(180, 0.015);
                if (this.hits >= 3) {
                    this.triggerBlockEvent();
                }
            }
        });

        // 14 seconds of traffic rush before bus gets stuck in Farmgate jam
        this.time.delayedCall(14000, () => {
            this.triggerBlockEvent();
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    triggerBlockEvent() {
        if (this.isEnding) return;
        this.isEnding = true;
        this.trafficTimer.remove();

        showRetroModal("💥 FARMGATE GRIDLOCK!", "The Poristhan Bus is completely trapped in a massive traffic jam!<br><br>📱 <b>MOMO CALLED...</b><br>\"No need to see me again. Good bye.\"<br><br><span style='color:red; font-size:18px;'>YOU ARE BLOCKED ON WHATSAPP & PHONE.</span>", ["DISEMBARK AT MOHAKHALI & FIND A BIKE"], () => {
            this.scene.start("LevelBargain");
        });
    }

    update() {
        this.road.tilePositionY -= 9;

        const left = this.cursors.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || window.gameInputs.right;
        const horn = this.cursors.space.isDown || window.gameInputs.actionA;

        if (horn && !this.hornCooldown) {
            this.hornCooldown = true;
            if (window.soundEngine) window.soundEngine.playHorn();
            this.time.delayedCall(800, () => { this.hornCooldown = false; });
        }

        if (left && this.player.x > 240) this.player.x -= 6;
        if (right && this.player.x < 720) this.player.x += 6;
    }
}

// ----------------------------------------------------
// 9. LEVEL 5: PATHAO BARGAIN (Mohakhali Flyover, 9.5 KM)
// ----------------------------------------------------
class LevelBargain extends Phaser.Scene {
    constructor() { super("LevelBargain"); }

    create() {
        CURRENT_KM = 9.5;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Mohakhali Flyover");
        this.gpsHUD.showLandmarkToast("Mohakhali Amtoli", "Find a Pathao biker and negotiate a fast fare to Gulshan!");

        this.add.image(480, 270, 'city').setTint(0x555555);
        this.add.image(480, 310, 'pathao_single').setScale(1.4);

        this.time.delayedCall(600, () => {
            this.openBargainModal();
        });
    }

    openBargainModal() {
        showRetroModal(
            "🏍️ PATHAO NEGOTIATION CONSOLE",
            "Rider: \"Mama kothay jaben? Gulshan 2? 250 taka lagen!\"<br>How much will you offer?",
            [
                "Offer 100 Taka (Too Cheap)",
                "Offer 130 Taka (Dhaka Realistic Fare)",
                "Offer 200 Taka (VIP Urgent Rush)"
            ],
            (choice) => {
                if (choice === 0) {
                    showRetroModal("RIDER REFUSED!", "Rider: \"Dhur mama! Eto kom e ke jabe? Hatey hete jan!\"", ["TRY AGAIN"], () => {
                        this.openBargainModal();
                    });
                } else if (choice === 1) {
                    if (window.soundEngine) window.soundEngine.playMotorcycle();
                    showRetroModal("ACCEPTED!", "Rider: \"Thik ase mama, uthen! Helmet ta mathay nen!\"", ["LET'S GO!"], () => {
                        this.scene.start("LevelBike");
                    });
                } else {
                    if (window.soundEngine) window.soundEngine.playMotorcycle();
                    showRetroModal("VIP SPEED BOOST!", "Rider: \"Mama apni to boro lok! Roket er moton jabo!\"", ["FULL THROTTLE!"], () => {
                        this.scene.start("LevelBike");
                    });
                }
            }
        );
    }
}

// ----------------------------------------------------
// 10. LEVEL 6: HATIRJHEEL EXPRESSWAY (12.0 KM -> 14.2 KM)
// ----------------------------------------------------
class LevelBike extends Phaser.Scene {
    constructor() { super("LevelBike"); }

    create() {
        CURRENT_KM = 12.0;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Hatirjheel Expressway");
        this.gpsHUD.showLandmarkToast("Hatirjheel Night Loop", "High speed rush! Dodge CNGs, potholes and trucks!");

        this.road = this.add.tileSprite(480, 270, 960, 540, 'road');

        // Top-down Motorbike
        this.player = this.physics.add.sprite(480, 440, 'hunda_top').setScale(0.5);
        this.player.body.setSize(40, 90);

        this.traffic = this.physics.add.group();
        this.trafficTimer = this.time.addEvent({
            delay: 750,
            callback: () => {
                const x = Phaser.Math.Between(260, 700);
                const bus = this.traffic.create(x, -100, 'bus_top').setScale(0.5).setVelocityY(420);
                bus.body.setSize(50, 120);
            },
            loop: true
        });

        this.physics.add.overlap(this.player, this.traffic, (p, t) => {
            t.destroy();
            if (window.soundEngine) window.soundEngine.playHit();
            this.cameras.main.shake(160, 0.015);
            GLOBAL_TIMER = Math.max(0, GLOBAL_TIMER - 5);
        });

        // Dynamic distance countdown from 12.0 km to 14.2 km
        this.speedKmH = 85;
        this.distCovered = 12.0;

        this.kmTimer = this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                this.distCovered += 0.1;
                CURRENT_KM = parseFloat(this.distCovered.toFixed(1));
                this.gpsHUD.updateDistance(CURRENT_KM, CURRENT_KM >= 13.5 ? "Gulshan 2 Lake Park" : "Hatirjheel Bridges");

                if (CURRENT_KM >= 14.2) {
                    this.trafficTimer.remove();
                    this.kmTimer.remove();
                    this.scene.start("LevelBoss");
                }
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const boost = this.cursors.space.isDown || window.gameInputs.actionB;
        const scrollSpeed = boost ? 18 : 12;
        this.road.tilePositionY -= scrollSpeed;

        const left = this.cursors.left.isDown || window.gameInputs.left;
        const right = this.cursors.right.isDown || window.gameInputs.right;

        if (left && this.player.x > 240) {
            this.player.x -= 7;
            this.player.setAngle(-8);
        } else if (right && this.player.x < 720) {
            this.player.x += 7;
            this.player.setAngle(8);
        } else {
            this.player.setAngle(0);
        }
    }
}

// ----------------------------------------------------
// 11. LEVEL 7: MOMO BOSS BATTLE (Gulshan 2, 14.2 KM)
// ----------------------------------------------------
class LevelBoss extends Phaser.Scene {
    constructor() { super("LevelBoss"); }

    create() {
        CURRENT_KM = 14.2;
        this.gpsHUD = new DhakaGPSHUD(this);
        this.gpsHUD.create(CURRENT_KM, "Momo's Residence (Gulshan 2)");
        this.gpsHUD.showLandmarkToast("Final Destination", "Momo is furious! Neutralize her anger with love hearts!");

        this.add.image(480, 270, 'city').setTint(0x882222);

        // Angry Momo Boss
        this.boss = this.physics.add.sprite(480, 160, 'momo_angry').setScale(0.85);
        this.tweens.add({
            targets: this.boss,
            x: 650,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Player (Lian)
        this.player = this.physics.add.sprite(480, 480, 'l1').setScale(0.8);

        this.bossHP = 20;
        this.playerHP = 4;

        this.hpText = this.add.text(20, 60, `Momo's Anger: ${this.bossHP}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#ff3333',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.pText = this.add.text(760, 60, `Lian HP: ${this.playerHP}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#00ff41',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        });

        this.lasers = this.physics.add.group();

        // Boss Attack Loop
        this.attackTimer = this.time.addEvent({
            delay: 1300,
            loop: true,
            callback: () => {
                const pattern = Phaser.Math.Between(0, 2);
                if (pattern === 0) {
                    // Fireball aimed at player
                    const orb = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.25);
                    this.physics.moveToObject(orb, this.player, 280);
                    if (window.soundEngine) window.soundEngine.playLaser();
                } else if (pattern === 1) {
                    // Fast vertical laser
                    const beam = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.18, 0.7).setTint(0xff0000);
                    beam.setVelocityY(550);
                    if (window.soundEngine) window.soundEngine.playLaser();
                } else {
                    // Spread attack
                    for (let i = -1; i <= 1; i++) {
                        const flame = this.lasers.create(this.boss.x, this.boss.y, 'golla').setScale(0.2).setTint(0xff8800);
                        flame.setVelocity(i * 120, 360);
                    }
                }
            }
        });

        // Player takes hit
        this.physics.add.overlap(this.player, this.lasers, (p, l) => {
            l.destroy();
            this.playerHP--;
            if (window.soundEngine) window.soundEngine.playHit();
            this.pText.setText(`Lian HP: ${this.playerHP}`);
            this.cameras.main.shake(120, 0.01);
            if (this.playerHP <= 0) {
                showRetroModal("YOU FAINTED!", "Momo's fury overwhelmed you!<br>Lian passed out on the front steps.", ["TRY AGAIN WITH FULL HP"], () => {
                    this.scene.restart();
                });
            }
        });

        // Periodic Relationship Trap Questions
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
                this.gpsHUD.showLandmarkToast("Perfect Answer!", "Momo's anger softened substantially (-4 Anger)!");
                if (this.bossHP <= 0) this.winGame();
            } else {
                if (window.soundEngine) window.soundEngine.playHit();
                this.playerHP = Math.max(1, this.playerHP - 1);
                this.pText.setText(`Lian HP: ${this.playerHP}`);
                this.gpsHUD.showLandmarkToast("Wrong Answer!", "Momo's fury increased!");
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

            if (this.bossHP <= 0) {
                this.winGame();
            }
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
// 12. WIN SCENE: Momo Softens & Grand Proposal
// ----------------------------------------------------
class WinScene extends Phaser.Scene {
    constructor() { super("WinScene"); }

    create() {
        GLOBAL_TIMER = 9999;
        if (window.soundEngine) {
            window.soundEngine.playWin();
        }

        const w = this.scale.width;
        const h = this.scale.height;

        this.cameras.main.setBackgroundColor('#050e06');
        this.add.image(w / 2, 220, 'momo_happy').setScale(0.95);

        this.add.text(w / 2, 60, "💖 MOMO IS FINALLY HAPPY! 💖", {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#ff66aa',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 105, "14.2 KM MIRPUR ➔ GULSHAN COMPLETED IN TIME!", {
            fontFamily: 'Courier New, monospace',
            fontSize: '15px',
            color: '#00ff41'
        }).setOrigin(0.5);

        // Grand Proposal Modal
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
        mBody.innerHTML = "Momo holds the fresh flowers & chocolates...<br><br><span style='font-size:22px; color:#ffffff;'><b>Will you be my forever?</b></span>";
        mOptions.innerHTML = `
            <button class="modal-btn" style="background:#006622; color:#fff; font-size:18px; text-align:center;" onclick="winForever()">❤️ YES, ALWAYS & FOREVER</button>
            <button class="modal-btn" style="background:#006622; color:#fff; font-size:18px; text-align:center;" onclick="winForever()">🥰 1000% YES</button>
            <button id="no-dodge-btn" class="modal-btn" style="background:#661111; color:#fff; font-size:14px; text-align:center; transition:0.1s;" onmouseover="dodgeBtn(this)" ontouchstart="dodgeBtn(this)">Let me think about it...</button>
        `;
        modal.style.display = 'flex';
    }
}

// Dodger button function for "Let me think about it"
window.dodgeBtn = function(btn) {
    const rx = (Math.random() - 0.5) * 220;
    const ry = (Math.random() - 0.5) * 140;
    btn.style.transform = `translate(${rx}px, ${ry}px)`;
};

// Grand ending celebration
window.winForever = function() {
    const modal = document.getElementById('retro-modal');
    if (modal) modal.style.display = 'none';

    if (window.soundEngine) window.soundEngine.playWin();

    document.body.innerHTML = `
        <div style="width:100vw; height:100vh; background:#000000; color:#00ff41; font-family:'Courier New', monospace; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:20px;">
            <h1 style="color:#ff66aa; font-size:32px; text-shadow:0 0 15px #ff66aa; margin-bottom:10px;">SHE SAID YES! ❤️</h1>
            <p style="font-size:18px; color:#ffffff; max-width:600px; line-height:1.6;">
                From sneaking past Baba in Mirpur 10, sprinting through Agargaon, surviving the Poristhan bus, speeding through Hatirjheel on a Pathao bike, to Gulshan 2...
                <br><br>
                <b style="color:#ffcc00; font-size:22px;">LIAN & MOMO FOREVER</b>
            </p>
            <div style="margin-top:20px; display:flex; gap:16px;">
                <button onclick="location.reload()" style="background:#00ff41; color:#000; font-weight:bold; padding:12px 24px; border:none; border-radius:4px; font-family:inherit; font-size:16px; cursor:pointer;">PLAY AGAIN</button>
            </div>
            <div style="margin-top:30px; font-size:12px; color:#666;">Project Psyco: Momo & Lian — Built with 💚 in Dhaka</div>
        </div>
    `;
};

// Auto start quiz on load
window.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});
