import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import demoVideo from "../assets/VN20250419_201755.mp4";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function DemoVideo() {
  const playerRef = useRef<ReactPlayer>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Show controls on mouse move, hide after 2s
  let hideTimeout: NodeJS.Timeout;
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => setShowControls(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-yellow-500/40 bg-black aspect-video"
      onMouseMove={handleMouseMove}
      tabIndex={0}
    >
      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={demoVideo}
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        width="100%"
        height="100%"
        controls={false}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={setDuration}
        style={{ background: "#000" }}
      />

      {/* Progress Bar */}
      <div className="absolute bottom-14 left-0 w-full px-4">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={played}
          onChange={(e) => {
            const seekTo = parseFloat(e.target.value);
            setPlayed(seekTo);
            playerRef.current?.seekTo(seekTo, "fraction");
          }}
          className="w-full h-2 rounded-full bg-gray-800 accent-yellow-500 cursor-pointer"
          style={{ accentColor: "#f59e0b" }}
        />
        <div className="flex justify-between text-xs text-yellow-500 mt-1 font-mono">
          <span>{formatTime(played * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-0 w-full flex justify-center items-center gap-4"
          >
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="bg-yellow-500 hover:bg-yellow-400 transition-colors text-black p-2 rounded-full shadow-lg flex items-center justify-center focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center bg-gray-900/90 rounded-full px-3 py-1 gap-2">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="text-yellow-500 hover:text-yellow-400 focus:outline-none"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 accent-yellow-500"
                style={{ accentColor: "#f59e0b" }}
              />
            </div>

            {/* Fullscreen (optional, for demo) */}
            <button
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  playerRef.current?.getInternalPlayer()?.requestFullscreen?.();
                }
              }}
              className="text-yellow-500 hover:text-yellow-400 p-2 rounded-full focus:outline-none"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
