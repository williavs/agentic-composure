// Fixes for missing types in three/examples and dat.gui
// If you want to add types, install @types/dat.gui or add a custom .d.ts file

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Type definitions for Three.js postprocessing modules that don't have proper types
interface PostProcessingModule {
  new (...args: unknown[]): unknown;
}

let EffectComposer: PostProcessingModule, 
    RenderPass: PostProcessingModule, 
    UnrealBloomPass: PostProcessingModule, 
    OutputPass: PostProcessingModule;

const vertexShader = `
uniform float u_time;

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}
vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep);
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
uniform float u_frequency;
void main() {
    float noise = 3.0 * pnoise(position + u_time, vec3(10.0));
    float displacement = (u_frequency / 30.) * (noise / 10.);
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform float u_red;
uniform float u_blue;
uniform float u_green;
void main() {
    gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1. );
}
`;

export const VisualizerCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let animationId: number;
    let bloomComposer: { render: () => void; addPass: (pass: unknown) => void; setSize: (width: number, height: number) => void };
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let uniforms: { [uniform: string]: { value: number } };
    let analyser: AnalyserNode;
    let audioContext: AudioContext;
    let microphone: MediaStreamAudioSourceNode;
    let mesh: THREE.Mesh;
    let bloomPass: { threshold: number; strength: number; radius: number };
    const cleanupFns: Array<() => void> = [];
    let resizeObserver: ResizeObserver;
    let isAudioStarted = false;

    if (!mountRef.current) return;

    const container = mountRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Initialize microphone audio capture
    const initializeAudio = async () => {
      try {
        // Create audio context
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          } 
        });
        
        // Create audio source from microphone
        microphone = audioContext.createMediaStreamSource(stream);
        
        // Create analyser for frequency analysis
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Higher resolution for better frequency analysis
        analyser.smoothingTimeConstant = 0.8;
        
        // Connect microphone to analyser
        microphone.connect(analyser);
        
        console.log("🎤 Microphone audio capture initialized - place near speakers to capture Sonic Pi audio");
        
        cleanupFns.push(() => {
          if (microphone) microphone.disconnect();
          if (audioContext) audioContext.close();
          stream.getTracks().forEach(track => track.stop());
        });
        
      } catch (error) {
        console.warn("⚠️ Microphone access denied or unavailable:", error);
        console.log("📻 Falling back to time-based animation");
        // @ts-expect-error - Mock analyser for fallback
        analyser = {
          getByteFrequencyData: () => {},
          frequencyBinCount: 32
        };
      }
    };

    // Start audio on user interaction (required by browsers)
    const handleUserInteraction = () => {
      if (!isAudioStarted) {
        isAudioStarted = true;
        initializeAudio();
        container.removeEventListener('click', handleUserInteraction);
      }
    };

    // Dynamically import modules with missing types
    Promise.all([
      // @ts-expect-error - Three.js postprocessing modules don't have proper types
      import('three/examples/jsm/postprocessing/EffectComposer').then(mod => { EffectComposer = mod.EffectComposer; }),
      // @ts-expect-error - Three.js postprocessing modules don't have proper types
      import('three/examples/jsm/postprocessing/RenderPass').then(mod => { RenderPass = mod.RenderPass; }),
      // @ts-expect-error - Three.js postprocessing modules don't have proper types
      import('three/examples/jsm/postprocessing/UnrealBloomPass').then(mod => { UnrealBloomPass = mod.UnrealBloomPass; }),
      // @ts-expect-error - Three.js postprocessing modules don't have proper types
      import('three/examples/jsm/postprocessing/OutputPass').then(mod => { OutputPass = mod.OutputPass; })
    ]).then(() => {
      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerWidth, containerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000);
      camera.position.set(0, -2, 14);
      camera.lookAt(0, 0, 0);

      // Uniforms
      uniforms = {
        u_time: { value: 0.0 },
        u_frequency: { value: 0.0 },
        u_red: { value: 1.0 },
        u_green: { value: 1.0 },
        u_blue: { value: 1.0 },
      };

      // Material & Geometry
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });
      const geo = new THREE.IcosahedronGeometry(4, 30);
      mesh = new THREE.Mesh(geo, mat);
      // @ts-expect-error - wireframe property exists on ShaderMaterial
      mesh.material.wireframe = true;
      scene.add(mesh);

      // Postprocessing
      const renderScene = new RenderPass(scene, camera);
      bloomPass = new UnrealBloomPass(new THREE.Vector2(containerWidth, containerHeight)) as { threshold: number; strength: number; radius: number };
      bloomPass.threshold = 0.5;
      bloomPass.strength = 0.5;
      bloomPass.radius = 0.8;
      bloomComposer = new EffectComposer(renderer) as { render: () => void; addPass: (pass: unknown) => void; setSize: (width: number, height: number) => void };
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);
      bloomComposer.addPass(new OutputPass());

      // Add click handler to start audio (required by browsers)
      container.addEventListener('click', handleUserInteraction);
      cleanupFns.push(() => container.removeEventListener('click', handleUserInteraction));

      // Mouse interaction (relative to container)
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const containerHalfX = rect.width / 2;
        const containerHalfY = rect.height / 2;
        mouseX = ((e.clientX - rect.left) - containerHalfX) / 100;
        mouseY = ((e.clientY - rect.top) - containerHalfY) / 100;
      };
      container.addEventListener("mousemove", onMouseMove);
      cleanupFns.push(() => container.removeEventListener("mousemove", onMouseMove));

      // Animation with real-time audio analysis
      const clock = new THREE.Clock();
      const dataArray = new Uint8Array(32); // For frequency data
      
      const animate = () => {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.5;
        camera.lookAt(scene.position);
        uniforms.u_time.value = clock.getElapsedTime();
        
        // Get real-time frequency data from microphone
        if (analyser && analyser.getByteFrequencyData) {
          analyser.getByteFrequencyData(dataArray);
          // Split into bands
          const bass = dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;
          const mid = dataArray.slice(8, 20).reduce((a, b) => a + b, 0) / 12 / 255;
          const treble = dataArray.slice(20).reduce((a, b) => a + b, 0) / 12 / 255;
          // Color uniforms
          uniforms.u_red.value = 0.5 + bass * 0.5;
          uniforms.u_green.value = 0.5 + mid * 0.5;
          uniforms.u_blue.value = 0.5 + treble * 0.5;
          // Displacement/pulse effect
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          uniforms.u_frequency.value = average + bass * 100;
          // Optional: mesh scale pulse
          const pulse = 1 + bass * 0.15;
          mesh.scale.set(pulse, pulse, pulse);
        } else {
          // Fallback: time-based animation if no audio
          uniforms.u_frequency.value = Math.sin(uniforms.u_time.value * 2) * 50 + 50;
          uniforms.u_red.value = 0.7 + 0.3 * Math.sin(uniforms.u_time.value);
          uniforms.u_green.value = 0.7 + 0.3 * Math.sin(uniforms.u_time.value + 2);
          uniforms.u_blue.value = 0.7 + 0.3 * Math.sin(uniforms.u_time.value + 4);
          mesh.scale.set(1, 1, 1);
        }
        
        bloomComposer.render();
        animationId = requestAnimationFrame(animate);
      };
      animate();
      cleanupFns.push(() => cancelAnimationFrame(animationId));

      // Resize observer for container size changes
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (camera && renderer && bloomComposer) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            bloomComposer.setSize(width, height);
          }
        }
      });
      resizeObserver.observe(container);
      cleanupFns.push(() => resizeObserver.disconnect());
    });

    // Cleanup
    return () => {
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }}>
      {/* Optional: Add a subtle instruction overlay */}
      <div style={{ 
        position: 'absolute', 
        bottom: 8, 
        right: 8, 
        fontSize: '10px', 
        color: 'rgba(255,255,255,0.6)', 
        pointerEvents: 'none' 
      }}>
        Click to enable audio capture
      </div>
    </div>
  );
}; 