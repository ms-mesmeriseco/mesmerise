"use client";

import { useRef, useState } from "react";

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 2L11 7L3 12V2Z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="8" y="2" width="4" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L7.5 2.5V11.5L4.5 9H2V5Z" fill="currentColor" />
      <line
        x1="10"
        y1="5"
        x2="13"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="5"
        x2="10"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconUnmuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5H4.5L7.5 2.5V11.5L4.5 9H2V5Z" fill="currentColor" />
      <path
        d="M9.5 4.5C10.5 5.2 11 6 11 7C11 8 10.5 8.8 9.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 2.5C12.2 3.7 13 5.2 13 7C13 8.8 12.2 10.3 10.5 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ControlButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent)] hover:bg-[var(--accent)]/40 backdrop-blur-sm border border-[var(--foreground)]/20 text-[var(--foreground)] transition-all duration-200"
    >
      {children}
    </button>
  );
}

export default function VideoCard({ videoUrl, caption }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto block"
      />

      {/* Controls */}
      <div
        className={`absolute bottom-3 right-3 flex gap-1.5 transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ControlButton onClick={toggleMute}>
          {muted ? <IconMuted /> : <IconUnmuted />}
        </ControlButton>
        <ControlButton onClick={togglePlay}>
          {playing ? <IconPause /> : <IconPlay />}
        </ControlButton>
      </div>

      {caption && (
        <p className="text-[var(--foreground)]/60 text-xs px-3 py-2">
          {caption}
        </p>
      )}
    </div>
  );
}
