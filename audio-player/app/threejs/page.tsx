"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  ChevronLeft,
  ChevronRight,
  Share2,
  Menu,
  Repeat,
  Volume2,
  Glasses,
} from "lucide-react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function AudioPlayerUI() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1826);
  const [duration] = useState(2506);
  const [markerA, setMarkerA] = useState(742);
  const [markerB, setMarkerB] = useState(1492);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);
  const [speedValue, setSpeedValue] = useState(1.2);
  const [volumeValue, setVolumeValue] = useState(71);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatShortTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMarkerDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    marker: "A" | "B"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!progressRef.current) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      const newTime = Math.round((x / rect.width) * duration);

      if (marker === "A") {
        setMarkerA(Math.min(newTime, markerB - 1));
      } else {
        setMarkerB(Math.max(newTime, markerA + 1));
      }
    };

    const handleMouseUp = () => {
      if (marker === "A") setIsDraggingA(false);
      else setIsDraggingB(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (marker === "A") setIsDraggingA(true);
    else setIsDraggingB(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleVolumeDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = volumeRef.current;
    if (!container) return;

    const updateVolume = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      const y = clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      setVolumeValue(Math.round(percentage));
    };

    updateVolume(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateVolume(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSpeedDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startValue = speedValue;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newValue = startValue + deltaX * 0.01;
      setSpeedValue(Math.max(0.5, Math.min(3.0, newValue)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="w-[400px] bg-gradient-to-b from-sky-500 to-sky-600 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Share2 size={20} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Menu size={24} />
        </button>
      </div>

      {/* Title and Time Display */}
      <div className="text-center text-white px-6 pb-4">
        <h1 className="text-base font-normal mb-3 opacity-90">
          Hackers TOEFL Chapter 1
        </h1>
        <div className="text-5xl font-light tracking-wider">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="px-6 pb-4">
        <div className="relative pb-6">
          <div className="relative" ref={progressRef}>
            {/* A Marker */}
            <div
              className={`absolute z-30 select-none ${
                isDraggingA ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                left: `${(markerA / duration) * 100}%`,
                top: "-2px",
                transform: "translateX(-50%)",
              }}
              onMouseDown={(e) => handleMarkerDrag(e, "A")}
            >
              <div className="flex flex-col items-center">
                <div className="text-xs text-white font-medium mb-1">
                  {formatShortTime(markerA)}
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-teal-400"></div>
                <div className="text-[11px] text-teal-400 font-bold -mt-0.5">A</div>
              </div>
            </div>

            {/* B Marker */}
            <div
              className={`absolute z-30 select-none ${
                isDraggingB ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                left: `${(markerB / duration) * 100}%`,
                top: "-2px",
                transform: "translateX(-50%)",
              }}
              onMouseDown={(e) => handleMarkerDrag(e, "B")}
            >
              <div className="flex flex-col items-center">
                <div className="text-xs text-white font-medium mb-1">
                  {formatShortTime(markerB)}
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-teal-400"></div>
                <div className="text-[11px] text-teal-400 font-bold -mt-0.5">B</div>
              </div>
            </div>

            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-2 bg-teal-600 rounded-lg appearance-none cursor-pointer slider relative z-10 mt-8"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
                  (currentTime / duration) * 100
                }%, #0d9488 ${(currentTime / duration) * 100}%, #0d9488 100%)`,
              }}
            />
          </div>

          {/* Time Labels Below Progress Bar */}
          <div className="flex justify-between text-[11px] text-white/80 mt-2 px-0.5">
            <span>{formatShortTime(currentTime)}</span>
            <span>-{formatShortTime(duration - currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Main Control Buttons */}
      <div className="grid grid-cols-5 gap-2.5 px-4 pb-3">
        <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
          <ChevronLeft size={24} />
        </button>
        <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
          <Rewind size={24} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition"
        >
          {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
        </button>
        <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
          <FastForward size={24} />
        </button>
        <button className="bg-teal-600/80 hover:bg-teal-600 text-white p-3.5 rounded-xl flex items-center justify-center transition">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Control Grid */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-5 gap-2.5" style={{ gridTemplateRows: "auto auto" }}>
          {/* Volume */}
          <div
            ref={volumeRef}
            onMouseDown={handleVolumeDrag}
            className="relative overflow-hidden text-white rounded-xl flex flex-col items-center justify-end pb-2 select-none cursor-ns-resize row-span-2"
            style={{
              background: `linear-gradient(to top, #14b8a6 ${volumeValue}%, #475569 ${volumeValue}%)`,
              gridRow: "1 / 3",
            }}
          >
            <Volume2 size={18} className="z-10 mb-1" />
            <span className="text-xs font-semibold z-10">{volumeValue}</span>
          </div>

          {/* Speed */}
          <div
            onMouseDown={handleSpeedDrag}
            className="bg-slate-600/80 hover:bg-slate-600 text-white rounded-xl flex flex-col items-center justify-end pb-2 select-none cursor-ew-resize row-span-2"
            style={{ gridRow: "1 / 3" }}
          >
            <Glasses size={18} className="mb-1" />
            <span className="text-xs font-semibold">{speedValue.toFixed(1)}x</span>
          </div>

          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition">
            <Repeat size={20} />
          </button>
          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-xs font-semibold">
            x5
          </button>
          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex flex-col items-center justify-center transition text-[10px] font-semibold">
            <span>x10</span>
            <span className="text-[8px]">inf</span>
          </button>

          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
            ALL
          </button>
          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
            A
          </button>
          <button className="bg-slate-500/60 hover:bg-slate-500 text-white rounded-xl h-12 flex items-center justify-center transition text-sm font-bold">
            B
          </button>
        </div>
      </div>

      {/* Number Buttons */}
      <div className="grid grid-cols-5 gap-2.5 px-4 pb-5">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className="bg-rose-300/80 hover:bg-rose-300 text-slate-700 p-3.5 rounded-xl text-lg font-bold transition"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom Display Area */}
      <div className="bg-slate-200 px-4 pt-3 pb-4">
        <div className="text-slate-800">
          <div className="text-base font-bold">&apos;불리&apos; Best of Best 향수</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-rose-500 font-semibold">LIVE쇼핑</span>
            <span>역대급 ~25% 할인 &gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreeJSPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !uiContainerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
    camera.position.set(0, 0, 800);

    // WebGL Renderer (for 3D background)
    const glRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    glRenderer.setSize(width, height);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setClearColor(0xe0f2fe, 1); // sky-100
    containerRef.current.appendChild(glRenderer.domElement);

    // CSS3D Renderer (for HTML UI)
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.top = "0";
    cssRenderer.domElement.style.pointerEvents = "auto";
    containerRef.current.appendChild(cssRenderer.domElement);

    // Create CSS3D Object from UI
    const cssObject = new CSS3DObject(uiContainerRef.current);
    cssObject.position.set(0, 0, 0);
    scene.add(cssObject);

    // Add particles background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2000;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add floating cubes
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < 15; i++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(
        (Math.random() - 0.5) * 1500,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 800 - 200
      );
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(cube);
      cubes.push(cube);
    }

    // OrbitControls
    const controls = new OrbitControls(camera, cssRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 400;
    controls.maxDistance = 1500;
    controls.enablePan = false;

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      // Rotate cubes
      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.005 + i * 0.001;
        cube.rotation.y += 0.005 + i * 0.001;
      });

      controls.update();
      glRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      glRenderer.setSize(w, h);
      cssRenderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      glRenderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      containerRef.current?.removeChild(glRenderer.domElement);
      containerRef.current?.removeChild(cssRenderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hidden UI container that will be used by CSS3DRenderer */}
      <div ref={uiContainerRef} style={{ display: "inline-block" }}>
        <AudioPlayerUI />
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "14px",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      >
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
