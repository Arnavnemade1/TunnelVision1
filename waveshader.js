// Vertex shader
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader
const fragmentShader = `
uniform float time;
uniform vec3 color;
uniform float amplitude;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // Wave function parameters
    float k = 2.0;
    float omega = 2.0;
    
    // Calculate wave function value
    float psi = amplitude * sin(k * vPosition.x - omega * time);
    
    // Calculate probability density (|ψ|²)
    float probability = psi * psi;
    
    // Add glow effect
    vec3 glow = color * probability * exp(-distance(vUv, vec2(0.5)) * 3.0);
    
    // Combine effects
    gl_FragColor = vec4(glow, probability);
}
`;
