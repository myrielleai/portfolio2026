import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  Headphones,
  Airplay,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  ListMusic,
  Quote,
  Music,
  Check
} from "lucide-react";
import { playClickSound } from "../../utils/audio";
import { musicSynth, TRACKS } from "../../utils/musicPlayer";

interface EarbudsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EarbudsModal({ isOpen, onClose }: EarbudsModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const currentTrack = TRACKS[currentTrackIdx];

  // Auto-play when opened & subscribe to music synth updates
  useEffect(() => {
    if (isOpen) {
      musicSynth.setTimeUpdateListener((time) => setCurrentTime(time));
      musicSynth.setStateChangeListener((playing) => setIsPlaying(playing));

      // Auto start music when earbuds pressed
      musicSynth.playTrack(currentTrackIdx);
    } else {
      musicSynth.pauseTrack();
    }



    return () => {
      if (isOpen) {
        musicSynth.pauseTrack();
      }
    };
  }, [isOpen, currentTrackIdx]);


  const handleTogglePlay = () => {
    playClickSound();
    if (isPlaying) {
      musicSynth.pauseTrack();
    } else {
      musicSynth.playTrack();
    }
  };

  const handleNext = () => {
    playClickSound();
    musicSynth.nextTrack();
    setCurrentTrackIdx(musicSynth.getCurrentTrackIndex());
  };

  const handlePrev = () => {
    playClickSound();
    musicSynth.prevTrack();
    setCurrentTrackIdx(musicSynth.getCurrentTrackIndex());
  };

  const handleSelectTrack = (index: number) => {
    playClickSound();
    musicSynth.playTrack(index);
    setCurrentTrackIdx(index);
    setShowQueue(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    musicSynth.setVolume(newVol);
  };

  const handleToggleMute = () => {
    playClickSound();
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.7);
      musicSynth.setVolume(prevVolume || 0.7);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
      musicSynth.setVolume(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    musicSynth.seek(newTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatRemainingTime = (secs: number, duration: number) => {
    const remaining = Math.max(0, duration - secs);
    const m = Math.floor(remaining / 60);
    const s = Math.floor(remaining % 60);
    return `-${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Determine current active lyric based on song progress ratio
  const activeLyricIndex = Math.min(
    Math.floor((currentTime / currentTrack.duration) * currentTrack.lyrics.length),
    currentTrack.lyrics.length - 1
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl cursor-pointer"
          onClick={() => {
            playClickSound();
            onClose();
          }}
        >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-zinc-950/90 text-white border border-white/15 rounded-[36px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] p-6 md:p-7 overflow-hidden font-sans select-none cursor-default"
          data-lenis-prevent
        >
          {/* Apple Music Dynamic Animated Fluid Mesh Glow Background */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out opacity-40 pointer-events-none filter blur-3xl scale-125"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${currentTrack.bgGlow}, transparent 70%)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 pointer-events-none" />

          {/* Top iOS Grab Bar Handle */}
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3 relative z-10" />

          {/* Top Apple Music Navigation Bar */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Collapse"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            {/* AirPods Audio Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
              <Headphones className="w-3.5 h-3.5 text-white/80" />
              <span className="text-[11px] font-semibold tracking-wide text-white/90">
                AirPods Pro
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <button
              onClick={() => {
                playClickSound();
                setShowQueue(!showQueue);
                setShowLyrics(false);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showQueue ? "text-white bg-white/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title="Up Next Queue"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area (Cover Art / Lyrics / Queue) */}
          <div className="relative z-10 min-h-[300px] flex flex-col justify-center">
            {showQueue ? (
              /* Up Next Queue List View */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full py-2 space-y-2 max-h-[300px] overflow-y-auto no-scrollbar"
              >
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 px-1">
                  Playing Next
                </div>
                {TRACKS.map((track, idx) => {
                  const isCurrent = idx === currentTrackIdx;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(idx)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                        isCurrent
                          ? "bg-white/15 border border-white/20 shadow-lg"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl overflow-hidden relative shrink-0 shadow-md bg-gradient-to-tr ${track.coverGradient}`}
                      >
                        {track.coverImage && (
                          <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                        )}
                        {isCurrent && isPlaying ? (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-1 bg-white rounded-full animate-bounce h-3" />
                              <span className="w-1 bg-white rounded-full animate-bounce h-4 delay-75" />
                              <span className="w-1 bg-white rounded-full animate-bounce h-2 delay-150" />
                            </div>
                          </div>
                        ) : !track.coverImage ? (
                          <Music className="w-5 h-5 text-white/80 absolute inset-0 m-auto" />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="text-sm font-semibold text-white !text-white truncate"
                          style={{ color: "#ffffff" }}
                        >
                          {track.title}
                        </div>
                        <div className="text-xs text-white/60 truncate">{track.artist}</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-white/80 shrink-0" />}
                    </div>
                  );
                })}
              </motion.div>
            ) : showLyrics ? (
              /* Apple Music Synced Lyrics Display */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-[300px] flex flex-col justify-center px-4 py-6 space-y-4 overflow-y-auto no-scrollbar"
              >
                {currentTrack.lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  return (
                    <p
                      key={idx}
                      className={`text-xl font-bold transition-all duration-500 leading-snug cursor-pointer ${
                        isActive
                          ? "text-white scale-105 opacity-100"
                          : "text-white/30 scale-95 opacity-50 hover:text-white/60"
                      }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </motion.div>
            ) : (
              /* Standard Apple Music Album Artwork */
              <div className="my-3 flex flex-col items-center justify-center">
                <motion.div
                  animate={{
                    scale: isPlaying ? 1 : 0.9,
                    y: isPlaying ? 0 : 4
                  }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`relative w-64 h-64 md:w-72 md:h-72 rounded-[28px] overflow-hidden shadow-2xl bg-gradient-to-tr ${currentTrack.coverGradient} border border-white/20`}
                  style={{
                    boxShadow: isPlaying
                      ? `0 20px 45px -10px ${currentTrack.bgGlow}, 0 10px 20px -5px rgba(0,0,0,0.5)`
                      : "0 10px 30px -10px rgba(0,0,0,0.5)"
                  }}
                >
                  {currentTrack.coverImage ? (
                    <>
                      <img
                        src={currentTrack.coverImage}
                        alt={`${currentTrack.title} - ${currentTrack.album}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />
                    </>
                  ) : (
                    <>
                      {/* Subtle Apple Music Style Gloss & Texture Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/40 pointer-events-none" />
                      
                      {/* Decorative Album Art Branding */}
                      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between text-white/90">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                            {currentTrack.album}
                          </span>
                          <Music className="w-5 h-5 text-white/80" />
                        </div>

                        {/* Artwork Center Graphic */}
                        <div className="flex flex-col items-center justify-center text-center my-auto">
                          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center mb-2 shadow-inner">
                            <motion.div
                              animate={{ rotate: isPlaying ? 360 : 0 }}
                              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                            >
                              <Headphones className="w-8 h-8 text-white drop-shadow-md" />
                            </motion.div>
                          </div>
                          <div 
                            className="text-xl font-extrabold text-white !text-white tracking-wide drop-shadow-md"
                            style={{ color: "#ffffff" }}
                          >
                            {currentTrack.title}
                          </div>
                        </div>

                        {/* Artwork Footer Note */}
                        <div className="text-center">
                          <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                            Apple Music • Stereo
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Track Info Header (Title, Artist & Apple Badges) */}
          <div className="relative z-10 mt-2 mb-4 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-3">
              <div 
                className="text-xl md:text-2xl font-bold text-white !text-white tracking-tight truncate leading-tight"
                style={{ color: "#ffffff" }}
              >
                {currentTrack.title}
              </div>
              <p className="text-sm font-medium text-white/60 truncate mt-0.5">
                {currentTrack.artist}
              </p>
              

            </div>

            {/* Favorite / Heart Button */}
            <button
              onClick={() => {
                playClickSound();
                setIsLiked(!isLiked);
              }}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${
                isLiked
                  ? "text-rose-500 bg-rose-500/15"
                  : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
              title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-rose-500" : ""}`} />
            </button>
          </div>

          {/* Apple Music Progress Scrubber */}
          <div className="relative z-10 space-y-1 mb-5">
            <input
              type="range"
              min={0}
              max={currentTrack.duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-white transition-all"
            />
            <div className="flex justify-between text-xs text-white/50 font-medium tracking-tight">
              <span>{formatTime(currentTime)}</span>
              <span>{formatRemainingTime(currentTime, currentTrack.duration)}</span>
            </div>
          </div>

          {/* Apple Music Transport Controls */}
          <div className="relative z-10 flex items-center justify-between mb-5 px-2">
            {/* Shuffle */}
            <button
              onClick={() => {
                playClickSound();
                setIsShuffle(!isShuffle);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isShuffle ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Previous */}
            <button
              onClick={handlePrev}
              className="p-2 text-white/90 hover:text-white transition-transform active:scale-90 cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-7 h-7 fill-white/90" />
            </button>

            {/* Center Play/Pause Circle */}
            <button
              onClick={handleTogglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black text-black" />
              ) : (
                <Play className="w-6 h-6 fill-black text-black ml-1" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              className="p-2 text-white/90 hover:text-white transition-transform active:scale-90 cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-7 h-7 fill-white/90" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                playClickSound();
                setIsRepeat(!isRepeat);
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isRepeat ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Apple Music Volume Slider Bar */}
          <div className="relative z-10 flex items-center gap-3 mb-4 px-1">
            <button
              onClick={handleToggleMute}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume1 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1 bg-white/20 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-white transition-all"
            />
            <Volume2 className="w-4 h-4 text-white/40" />
          </div>

          {/* Apple Music Footer Icons Bar & Connected Device Indicator */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            {/* Lyrics Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowLyrics(!showLyrics);
                setShowQueue(false);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                showLyrics ? "bg-white/20 text-white font-semibold" : "hover:text-white hover:bg-white/5"
              }`}
              title="Time-synced Lyrics"
            >
              <Quote className="w-4 h-4" />
              <span className="text-[11px]">Lyrics</span>
            </button>

            {/* AirPods Audio Route Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80">
              <Airplay className="w-3.5 h-3.5 text-white/70" />
              <span className="font-medium truncate max-w-[130px]">Myrielle's AirPods</span>
            </div>

            {/* Up Next / Queue Toggle Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowQueue(!showQueue);
                setShowLyrics(false);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                showQueue ? "bg-white/20 text-white font-semibold" : "hover:text-white hover:bg-white/5"
              }`}
              title="Playing Next"
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-[11px]">Queue</span>
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
