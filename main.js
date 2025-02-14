// Main simulation class
class QuantumTunnelingSimulation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true
        });
        
        this.init();
        this.setupControls();
        this.animate();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);

        // Setup camera
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);

        // Create potential barrier
        this.barrier = this.createBarrier();
        this.scene.add(this.barrier);

        // Setup wave function visualization
        this.waveFunction = this.createWaveFunction();
        this.scene.add(this.waveFunction);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(ambientLight, pointLight);

        // Initialize simulation parameters
        this.params = {
            particleEnergy: 50,
            barrierHeight: 70,
            barrierWidth: 20,
            isAnimating: true,
            time: 0
        };
    }

    createBarrier() {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5
        });
        return new THREE.Mesh(geometry, material);
    }

    createWaveFunction() {
        const geometry = new THREE.PlaneGeometry(10, 2, 100, 1);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) },
                amplitude: { value: 1.0 }
            },
            transparent: true,
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(geometry, material);
    }

    setupControls() {
        // Energy slider
        const energySlider = document.getElementById('particleEnergy');
        energySlider.addEventListener('input', (e) => {
            this.params.particleEnergy = parseFloat(e.target.value);
            document.getElementById('energyValue').textContent = e.target.value;
            this.updateSimulation();
        });

        // Barrier height slider
        const heightSlider = document.getElementById('barrierHeight');
        heightSlider.addEventListener('input', (e) => {
            this.params.barrierHeight = parseFloat(e.target.value);
            document.getElementById('heightValue').textContent = e.target.value;
            this.updateBarrier();
        });

        // Barrier width slider
        const widthSlider = document.getElementById('barrierWidth');
        widthSlider.addEventListener('input', (e) => {
            this.params.barrierWidth = parseFloat(e.target.value);
            document.getElementById('widthValue').textContent = e.target.value;
            this.updateBarrier();
        });

        // Launch button
        document.getElementById('launchParticle').addEventListener('click', () => {
            this.launchParticle();
        });

        // Animation toggle
        document.getElementById('toggleAnimation').addEventListener('click', () => {
            this.params.isAnimating = !this.params.isAnimating;
        });
    }

    updateSimulation() {
        // Update wave function parameters based on particle energy
        const amplitude = this.params.particleEnergy / 100;
        this.waveFunction.material.uniforms.amplitude.value = amplitude;
    }

    updateBarrier() {
        // Update barrier dimensions
        this.barrier.scale.set(
            this.params.barrierWidth / 20,
            this.params.barrierHeight / 35,
            1
        );
    }

    calculateTunnelingProbability() {
        // Simple tunneling probability calculation
        const E = this.params.particleEnergy;
        const V = this.params.barrierHeight;
        const width = this.params.barrierWidth;
        
        if (E >= V) return 1.0;
        
        // Simplified WKB approximation
        const kappa = Math.sqrt(2 * (V - E)) / 10;
        return Math.exp(-2 * kappa * width);
    }

    launchParticle() {
        const probability = this.calculateTunnelingProbability();
        
        // Visualize tunneling attempt
        this.waveFunction.material.uniforms.color.value.setHSL(
            probability,
            1.0,
            0.5
        );
        
        // Reset wave function position
        this.waveFunction.position.x = -5;
        
        // Animate tunneling attempt
        this.params.time = 0;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.params.isAnimating) {
            this.params.time += 0.016;
            this.waveFunction.material.uniforms.time.value = this.params.time;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize simulation when page loads
window.addEventListener('load', () => {
    const simulation = new QuantumTunnelingSimulation();
});

// Handle window resizing
window.addEventListener('resize', () => {
    const camera = simulation.camera;
    const renderer = simulation.renderer;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
