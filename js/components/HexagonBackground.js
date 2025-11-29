export class HexagonBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.hexagons = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initHexagons();
    }

    initHexagons() {
        this.hexagons = [];
        const size = 50; // Hexagon radius
        const w = Math.sqrt(3) * size;
        const h = 2 * size;
        
        // Create a grid of hexagons
        for (let y = -h; y < this.canvas.height + h; y += h * 0.75) {
            for (let x = -w; x < this.canvas.width + w; x += w) {
                // Offset every other row
                let xOffset = (Math.floor(y / (h * 0.75)) % 2 === 0) ? 0 : w / 2;
                
                // Randomly decide to draw a hexagon or not for a sparse look
                if (Math.random() > 0.85) {
                    this.hexagons.push({
                        x: x + xOffset,
                        y: y,
                        size: size,
                        opacity: Math.random() * 0.1 + 0.02, // Very subtle
                        pulseSpeed: Math.random() * 0.005 + 0.002,
                        pulseDir: 1
                    });
                }
            }
        }
    }

    drawHexagon(x, y, size, opacity) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i - 30;
            const angle_rad = Math.PI / 180 * angle_deg;
            const px = x + size * Math.cos(angle_rad);
            const py = y + size * Math.sin(angle_rad);
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = `rgba(159, 238, 28, ${opacity})`; // Brand color
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.hexagons.forEach(hex => {
            // Pulse effect
            hex.opacity += hex.pulseSpeed * hex.pulseDir;
            if (hex.opacity > 0.15 || hex.opacity < 0.02) {
                hex.pulseDir *= -1;
            }
            
            this.drawHexagon(hex.x, hex.y, hex.size, hex.opacity);
        });

        requestAnimationFrame(() => this.animate());
    }
}