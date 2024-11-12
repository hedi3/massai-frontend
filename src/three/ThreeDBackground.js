// src/components/ThreeDBackground.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Smoother background color
    const color1 = new THREE.Color(0x1e1e1e);
    const color2 = new THREE.Color(0x2c3e50);
    const gradient = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
    const gradientMesh = new THREE.Mesh(gradient, gradientMaterial);
    scene.add(gradientMesh);

    // Load crypto coin models
    const loader = new GLTFLoader();
    const coinModels = [
      'path/to/bitcoin.glb',
      'path/to/ethereum.glb',
      // Add paths to other coin models here
    ];

    const coins = [];
    coinModels.forEach((modelPath, index) => {
      loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
        model.position.set(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        );
        coins.push(model);
        scene.add(model);
      });
    });

    camera.position.z = 100;

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate all coins
      coins.forEach(coin => {
        coin.rotation.x += 0.01;
        coin.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default ThreeDBackground;
