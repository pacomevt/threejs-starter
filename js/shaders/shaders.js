export const vertex = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
export const fragment = `
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;

float PI = 3.14159265359;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uTexture, vUv);
    gl_FragColor = texture;     
}
`;