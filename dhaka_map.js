// ============================================================================
// REAL-WORLD DHAKA MAP ROUTE: MIRPUR TO MOHAMMADPUR (8.8 KM DATE RUSH)
// Authentic Geography, Real Checkpoints, Landmark Navigation
// ============================================================================

const DHAKA_ROUTE = [
    {
        id: "mirpur10",
        name: "Lian's House (Mirpur 10)",
        bengali: "মিরপুর ১০",
        landmark: "Mirpur Stadium & Benarasi Palli",
        km: 0.0,
        desc: "3:00 AM. Momo's text: 'Tumi ekhono Mohammadpur ashoni?!'",
        lat: 23.8070,
        lng: 90.3686
    },
    {
        id: "mirpur1",
        name: "Mirpur 1 & Sony Square",
        bengali: "মিরপুর ১ সনি স্কয়ার",
        landmark: "Sony Cinema & Mazar Road Crossing",
        km: 2.2,
        desc: "Pick your transport! Slap erratic Teslas, pedal rickshaw, or commandeer bus!",
        lat: 23.7950,
        lng: 90.3530
    },
    {
        id: "kallyanpur",
        name: "Technical Mor & Kallyanpur",
        bengali: "টেকনিক্যাল মোড় ও কল্যাণপুর",
        landmark: "Kallyanpur Bus Terminal",
        km: 4.1,
        desc: "Dhaka highway crossroads! Watch out for trucks and crazy U-turns.",
        lat: 23.7810,
        lng: 90.3610
    },
    {
        id: "shyamoli",
        name: "Shyamoli Square & Shishu Mela",
        bengali: "শ্যামলী স্কয়ার ও শিশু মেলা",
        landmark: "Shyamoli Foot-Overbridge",
        km: 5.8,
        desc: "Pick 10 fresh roses & chocolates for the date with Momo!",
        lat: 23.7715,
        lng: 90.3665
    },
    {
        id: "asadgate",
        name: "Asad Gate & St. Joseph",
        bengali: "আসাদ গেট",
        landmark: "Historic Asad Gate & Manik Mia Ave Turn",
        km: 7.2,
        desc: "Entering Mohammadpur! The final stretch to her place.",
        lat: 23.7595,
        lng: 90.3725
    },
    {
        id: "mohammadpur",
        name: "Mohammadpur Town Hall & Salimullah Rd",
        bengali: "মোহাম্মদপুর টাউন হল",
        landmark: "Town Hall Market & Bihari Camp Kebab Stalls",
        km: 8.8,
        desc: "DATE DESTINATION: Face Momo's anger, deliver flowers & propose!",
        lat: 23.7620,
        lng: 90.3620
    }
];

class DhakaGPSHUD {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.totalKm = 8.8;
    }

    create(currentKm = 0.0, landmarkName = "Mirpur 10", modeName = "BIKE") {
        const s = this.scene;
        const w = s.scale.width;

        this.container = s.add.container(0, 0).setScrollFactor(0).setDepth(8000);

        // Top GPS Header Bar
        const barBg = s.add.rectangle(w / 2, 22, w, 44, 0x050d08, 0.90)
            .setStrokeStyle(2, 0x00ff41);
        this.container.add(barBg);

        // Landmark Banner
        this.landmarkText = s.add.text(18, 12, `📍 ${landmarkName.toUpperCase()}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#00ff41',
            fontStyle: 'bold'
        });
        this.container.add(this.landmarkText);

        // Mode Badge
        this.modeBadge = s.add.text(w / 2 - 190, 12, `[${modeName}]`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#00e5ff',
            fontStyle: 'bold'
        });
        this.container.add(this.modeBadge);

        // Distance Remaining
        const remKm = Math.max(0, (this.totalKm - currentKm)).toFixed(1);
        this.distText = s.add.text(w - 235, 12, `MOHAMMADPUR: ${remKm} KM`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#ffcc00',
            fontStyle: 'bold'
        });
        this.container.add(this.distText);

        // Mini Route Progress Bar
        const barX = w / 2 - 100;
        const barY = 34;
        const bgRoute = s.add.rectangle(barX + 100, barY, 200, 5, 0x222222);
        this.fillRoute = s.add.rectangle(barX, barY, 0, 5, 0x00ff41).setOrigin(0, 0.5);
        this.container.add(bgRoute);
        this.container.add(this.fillRoute);

        // Route Landmark Dots
        DHAKA_ROUTE.forEach((pt) => {
            const frac = pt.km / this.totalKm;
            const dotX = barX + frac * 200;
            const dot = s.add.circle(dotX, barY, 3, pt.km <= currentKm ? 0x00ff41 : 0x555555);
            this.container.add(dot);
        });

        this.updateDistance(currentKm, landmarkName);
    }

    updateDistance(currentKm, landmarkName) {
        if (!this.container) return;
        const rem = Math.max(0, (this.totalKm - currentKm)).toFixed(1);
        this.distText.setText(`MOHAMMADPUR: ${rem} KM`);
        if (landmarkName) {
            this.landmarkText.setText(`📍 ${landmarkName.toUpperCase()}`);
        }
        const frac = Math.min(1, Math.max(0, currentKm / this.totalKm));
        this.fillRoute.width = frac * 200;
    }

    showLandmarkToast(title, desc) {
        const s = this.scene;
        const w = s.scale.width;
        
        const toast = s.add.container(w / 2, 75).setScrollFactor(0).setDepth(9999);
        const bg = s.add.rectangle(0, 0, 500, 48, 0x000000, 0.94)
            .setStrokeStyle(2, 0xffcc00);
        const t1 = s.add.text(0, -9, `🚩 ${title.toUpperCase()}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            color: '#ffcc00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        const t2 = s.add.text(0, 10, desc, {
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            color: '#ffffff'
        }).setOrigin(0.5);

        toast.add([bg, t1, t2]);
        toast.setScale(0);

        s.tweens.add({
            targets: toast,
            scaleX: 1,
            scaleY: 1,
            duration: 220,
            ease: 'Back.easeOut',
            onComplete: () => {
                s.time.delayedCall(2000, () => {
                    s.tweens.add({
                        targets: toast,
                        alpha: 0,
                        y: 55,
                        duration: 280,
                        onComplete: () => toast.destroy()
                    });
                });
            }
        });
    }
}

window.DHAKA_ROUTE = DHAKA_ROUTE;
window.DhakaGPSHUD = DhakaGPSHUD;
