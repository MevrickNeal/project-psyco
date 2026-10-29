// ==========================================
// REAL-WORLD DHAKA MAP & LANDMARK ROUTE DATA
// Authentic Geography, Real Distances (14.2 KM)
// ==========================================

const DHAKA_ROUTE = [
    {
        id: "mirpur",
        name: "Lian's House (Mirpur 10)",
        bengali: "মিরপুর ১০",
        landmark: "Benarasi Palli & Stadium",
        km: 0.0,
        desc: "3:00 AM. Momo's angry text arrived. Sneak past Baba's patrol!",
        lat: 23.8070,
        lng: 90.3686
    },
    {
        id: "agargaon",
        name: "Agargaon Metro Station",
        bengali: "আগারগাঁও মেট্রো",
        landmark: "MRT Line 6 Viaduct",
        km: 2.5,
        desc: "Sprint under the metrorail pillars! Dodge sleepy street dogs and urgent boss files.",
        lat: 23.7785,
        lng: 90.3795
    },
    {
        id: "sangsad",
        name: "Jatiya Sangsad & Crescent Lake",
        bengali: "জাতীয় সংসদ ও চন্দ্রিমা উদ্যান",
        landmark: "National Parliament Building",
        km: 5.1,
        desc: "Buy 10 fresh flowers & chocolates for Momo by Crescent Lake!",
        lat: 23.7625,
        lng: 90.3780
    },
    {
        id: "farmgate",
        name: "Farmgate & Bijoy Sarani",
        bengali: "ফার্মগেট ও বিজয় সরণি",
        landmark: "Ananda Cinema & Foot-Overbridge",
        km: 7.8,
        desc: "Catch the legendary Poristhan Bus. Dhaka traffic chaos awaits!",
        lat: 23.7570,
        lng: 90.3895
    },
    {
        id: "mohakhali",
        name: "Mohakhali Flyover",
        bengali: "মহাখালী ফ্লাইওভার",
        landmark: "Amtoli & ICMRB Intersection",
        km: 9.5,
        desc: "Bus stalled! Negotiate with a Pathao bike rider immediately.",
        lat: 23.7778,
        lng: 90.4035
    },
    {
        id: "hatirjheel",
        name: "Hatirjheel Expressway",
        bengali: "হাতিরঝিল এক্সপ্রেসওয়ে",
        landmark: "Police Plaza & Illuminated Bridges",
        km: 12.0,
        desc: "High-speed night rush! Dodge CNGs, potholes, and wind.",
        lat: 23.7745,
        lng: 90.4165
    },
    {
        id: "gulshan",
        name: "Momo's Residence (Gulshan 2)",
        bengali: "গুলশান ২ লেক পার্ক",
        landmark: "Gulshan Lake & Diplomatic Enclave",
        km: 14.2,
        desc: "Final Destination: Face Momo's wrath and win her back forever!",
        lat: 23.7925,
        lng: 90.4150
    }
];

class DhakaGPSHUD {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.totalKm = 14.2;
    }

    create(currentKm = 0.0, landmarkName = "Mirpur 10") {
        const s = this.scene;
        const w = s.scale.width;

        this.container = s.add.container(0, 0).setScrollFactor(0).setDepth(8000);

        // Top GPS Header Bar
        const barBg = s.add.rectangle(w / 2, 22, w, 44, 0x050d08, 0.88)
            .setStrokeStyle(2, 0x00ff41);
        this.container.add(barBg);

        // Landmark Banner
        this.landmarkText = s.add.text(18, 12, `📍 ${landmarkName.toUpperCase()}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '15px',
            color: '#00ff41',
            fontStyle: 'bold'
        });
        this.container.add(this.landmarkText);

        // Distance Remaining
        const remKm = Math.max(0, (this.totalKm - currentKm)).toFixed(1);
        this.distText = s.add.text(w - 230, 12, `DIST: ${remKm} KM REMAINING`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffcc00',
            fontStyle: 'bold'
        });
        this.container.add(this.distText);

        // Mini Route Progress Bar
        const barX = w / 2 - 120;
        const barY = 34;
        const bgRoute = s.add.rectangle(barX + 120, barY, 240, 6, 0x222222);
        this.fillRoute = s.add.rectangle(barX, barY, 0, 6, 0x00ff41).setOrigin(0, 0.5);
        this.container.add(bgRoute);
        this.container.add(this.fillRoute);

        // Route Landmark Dots
        DHAKA_ROUTE.forEach((pt) => {
            const frac = pt.km / this.totalKm;
            const dotX = barX + frac * 240;
            const dot = s.add.circle(dotX, barY, 3, pt.km <= currentKm ? 0x00ff41 : 0x666666);
            this.container.add(dot);
        });

        this.updateDistance(currentKm, landmarkName);
    }

    updateDistance(currentKm, landmarkName) {
        if (!this.container) return;
        const rem = Math.max(0, (this.totalKm - currentKm)).toFixed(1);
        this.distText.setText(`DIST: ${rem} KM TO MOMO`);
        if (landmarkName) {
            this.landmarkText.setText(`📍 ${landmarkName.toUpperCase()}`);
        }
        const frac = Math.min(1, Math.max(0, currentKm / this.totalKm));
        this.fillRoute.width = frac * 240;
    }

    showLandmarkToast(title, desc) {
        const s = this.scene;
        const w = s.scale.width;
        
        const toast = s.add.container(w / 2, 80).setScrollFactor(0).setDepth(9999);
        const bg = s.add.rectangle(0, 0, 480, 50, 0x000000, 0.92)
            .setStrokeStyle(2, 0xffcc00);
        const t1 = s.add.text(0, -10, `🚩 CHECKPOINT: ${title}`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
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
            duration: 250,
            ease: 'Back.easeOut',
            onComplete: () => {
                s.time.delayedCall(2200, () => {
                    s.tweens.add({
                        targets: toast,
                        alpha: 0,
                        y: 60,
                        duration: 300,
                        onComplete: () => toast.destroy()
                    });
                });
            }
        });
    }
}

window.DHAKA_ROUTE = DHAKA_ROUTE;
window.DhakaGPSHUD = DhakaGPSHUD;
