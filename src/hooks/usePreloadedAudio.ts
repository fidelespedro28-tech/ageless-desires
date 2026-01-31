/**
 * Hook para gerenciar áudio pré-carregado com playback instantâneo
 * Resolve problemas de delay em dispositivos móveis
 */

// Preload all audio files at module level for instant playback
const AUDIO_CACHE: Map<string, HTMLAudioElement> = new Map();

// Initialize audio preloading
const preloadAudio = (src: string): HTMLAudioElement => {
  if (AUDIO_CACHE.has(src)) {
    return AUDIO_CACHE.get(src)!;
  }
  
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.load(); // Force preload
  
  AUDIO_CACHE.set(src, audio);
  return audio;
};

// Preload common audio files on app start
const AUDIO_CASH = "/audios/audio-cash.mp3";
const AUDIO_START = "/audios/audio1.mp3";
const AUDIO_END = "/audios/audio2.mp3";

// Preload immediately when this module loads
preloadAudio(AUDIO_CASH);
preloadAudio(AUDIO_START);
preloadAudio(AUDIO_END);

/**
 * Play audio with debounce protection
 * Prevents multiple rapid plays and ensures instant playback
 */
export const playAudioInstant = (src: string, forceRestart = true): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const audio = preloadAudio(src);
      
      if (forceRestart) {
        audio.currentTime = 0;
      }
      
      audio.play()
        .then(() => {
          console.log(`🔊 Audio playing: ${src}`);
          resolve(true);
        })
        .catch((error) => {
          console.warn(`⚠️ Audio play failed (user interaction may be required):`, error);
          resolve(false);
        });
    } catch (e) {
      console.error(`❌ Audio error:`, e);
      resolve(false);
    }
  });
};

/**
 * Play cash sound instantly - no delay, preloaded
 * Use ONLY for:
 * - 5th like match
 * - R$40 PIX gift in chat
 */
let cashPlayed = false;
let cashPlayedTimestamp = 0;
const CASH_DEBOUNCE_MS = 2000; // Prevent duplicate plays within 2 seconds

export const playCashSound = (): Promise<boolean> => {
  const now = Date.now();
  
  // Debounce protection
  if (cashPlayed && now - cashPlayedTimestamp < CASH_DEBOUNCE_MS) {
    console.log("🔇 Cash sound debounced - already played recently");
    return Promise.resolve(false);
  }
  
  cashPlayed = true;
  cashPlayedTimestamp = now;
  
  console.log("💰 Playing cash sound INSTANTLY");
  return playAudioInstant(AUDIO_CASH);
};

/**
 * Reset cash sound state (for new sessions)
 */
export const resetCashSoundState = (): void => {
  cashPlayed = false;
  cashPlayedTimestamp = 0;
};

/**
 * Get preloaded audio element for custom controls
 */
export const getPreloadedAudio = (src: string): HTMLAudioElement => {
  return preloadAudio(src);
};

// Audio paths exported for convenience
export const AUDIO_PATHS = {
  CASH: AUDIO_CASH,
  CHAT_START: AUDIO_START,
  CHAT_END: AUDIO_END,
} as const;
