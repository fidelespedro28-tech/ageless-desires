import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioMessageProps {
  audioSrc: string;
  senderImage?: string;
  senderName: string;
  timestamp: string;
  autoPlay?: boolean;
}

const AudioMessage = ({
  audioSrc,
  senderImage,
  senderName,
  timestamp,
  autoPlay = false,
}: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Auto-play if enabled
    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * audio.duration;
    
    audio.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  return (
    <div className="flex gap-2 mb-4 animate-fade-in-up">
      {/* Avatar */}
      {senderImage && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border-2 border-primary/50">
          <img src={senderImage} alt={senderName} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-[80%] sm:max-w-[75%]">
        {/* Sender name */}
        <p className="text-xs text-primary font-medium mb-1">{senderName}</p>
        
        {/* Audio bubble */}
        <div className="bg-gradient-to-r from-primary/20 to-purple-accent/20 border border-primary/30 rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                "bg-gradient-to-r from-primary to-purple-accent",
                "hover:scale-105 hover:shadow-glow",
                "active:scale-95"
              )}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="white" />
              )}
            </button>

            {/* Waveform / Progress */}
            <div className="flex-1 min-w-0">
              <div 
                className="h-8 sm:h-10 flex items-center gap-[2px] cursor-pointer"
                onClick={handleProgressClick}
              >
                {/* Simulated waveform bars */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const barProgress = (i / 20) * 100;
                  const isActive = barProgress <= progress;
                  const heights = [40, 65, 50, 80, 60, 90, 45, 75, 55, 85, 70, 95, 50, 80, 60, 70, 45, 85, 55, 75];
                  
                  return (
                    <div
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all duration-150",
                        isActive 
                          ? "bg-gradient-to-t from-primary to-purple-accent" 
                          : "bg-muted-foreground/30"
                      )}
                      style={{ height: `${heights[i]}%` }}
                    />
                  );
                })}
              </div>
              
              {/* Time display */}
              <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Hidden audio element */}
          <audio ref={audioRef} src={audioSrc} preload="metadata" />
        </div>

        {/* Timestamp */}
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 ml-1">
          🎙️ Mensagem de voz • {timestamp}
        </p>
      </div>
    </div>
  );
};

export default AudioMessage;
