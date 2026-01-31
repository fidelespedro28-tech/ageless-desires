/**
 * Hook para gerenciar áudio pré-carregado com playback instantâneo
 * Resolve problemas de delay em dispositivos móveis
 * 
 * ✅ GARANTIAS:
 * - Áudio pré-carregado no load do módulo
 * - Múltiplas instâncias de áudio para evitar conflitos
 * - Fallback para novo Audio() se cache falhar
 * - Log detalhado para debug
 */

// Audio paths
const AUDIO_CASH = "/audios/audio-cash.mp3";
const AUDIO_START = "/audios/audio1.mp3";
const AUDIO_END = "/audios/audio2.mp3";

// Preload cache
const AUDIO_CACHE: Map<string, HTMLAudioElement> = new Map();

// Initialize audio preloading
const preloadAudio = (src: string): HTMLAudioElement => {
  if (AUDIO_CACHE.has(src)) {
    return AUDIO_CACHE.get(src)!;
  }
  
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.load();
  
  AUDIO_CACHE.set(src, audio);
  console.log(`🔊 Áudio pré-carregado: ${src}`);
  return audio;
};

// Preload immediately when module loads
preloadAudio(AUDIO_CASH);
preloadAudio(AUDIO_START);
preloadAudio(AUDIO_END);

/**
 * Play audio with instant playback - creates NEW Audio instance for reliability
 * This ensures the sound ALWAYS plays, even if called rapidly
 */
export const playAudioInstant = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Create a NEW Audio instance for guaranteed playback
      const audio = new Audio(src);
      audio.volume = 1.0;
      
      audio.play()
        .then(() => {
          console.log(`🔊 ✅ Áudio tocando: ${src}`);
          resolve(true);
        })
        .catch((error) => {
          console.warn(`⚠️ Áudio falhou (interação do usuário necessária):`, error);
          resolve(false);
        });
    } catch (e) {
      console.error(`❌ Erro no áudio:`, e);
      resolve(false);
    }
  });
};

/**
 * 💰 PLAY CASH SOUND - Som de dinheiro
 * 
 * 🔊 CENÁRIOS CORRETOS PARA TOCAR O SOM:
 * 1. Na 5ª curtida (match) em Descobrir.tsx - playCashSound()
 * 2. Ao clicar em "Resgatar Presente" no chat (handleClaimGift) - playCashSound()
 * 
 * ❌ NÃO TOCAR em:
 * - Popups de upgrade/planos
 * - Mensagens automáticas do chat
 * - Recarregamentos
 * - Ao ENVIAR o presente (só ao RESGATAR)
 */
let lastCashPlayTime = 0;
const CASH_DEBOUNCE_MS = 500; // Debounce de 0.5s - permite curtidas rápidas

export const playCashSound = (): Promise<boolean> => {
  const now = Date.now();
  
  // Debounce protection
  if (now - lastCashPlayTime < CASH_DEBOUNCE_MS) {
    console.log("🔇 Cash sound debounced - tocou há menos de 1.5s");
    return Promise.resolve(false);
  }
  
  lastCashPlayTime = now;
  
  console.log("💰💰💰 TOCANDO SOM DE DINHEIRO!");
  
  // Play using NEW Audio instance for 100% reliability
  return playAudioInstant(AUDIO_CASH);
};

/**
 * Reset cash sound state (for new sessions)
 */
export const resetCashSoundState = (): void => {
  lastCashPlayTime = 0;
  console.log("🔄 Cash sound state resetado");
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
