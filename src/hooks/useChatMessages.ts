import { useState, useCallback, useRef, useEffect } from "react";

// Mensagens de abertura (nunca repetir)
const OPENING_MESSAGES = [
  "Oi, gostei que você visitou meu perfil 😊 achei interessante seu jeito.",
  "Olá! Vi que você curtiu meu perfil... fiquei feliz com isso 💕",
  "Oi, amor! Que bom te conhecer por aqui 💋",
  "Ei, você! Gostei do seu perfil... me conta mais sobre você?",
  "Oi gatinho! Vi que deu match comigo... adorei 😊",
];

// Respostas para a 1ª mensagem do lead
const RESPONSE_SET_1 = [
  "Gostei do que você disse, me conta mais 😊",
  "Você parece ter uma energia muito boa...",
  "Hmm, interessante! Continue, estou curiosa.",
  "Adorei sua mensagem! Você sabe conversar bem.",
  "Você me deixou curiosa agora... 💭",
];

// Respostas para a 2ª mensagem do lead
const RESPONSE_SET_2 = [
  "Conversar assim é bem mais interessante do que eu esperava...",
  "Gosto quando a conversa flui naturalmente assim 💕",
  "Você tem um jeito especial de se expressar...",
  "Cada vez gosto mais de conversar com você 😏",
  "Você é diferente dos outros que falam comigo aqui...",
];

// Respostas para a 3ª mensagem do lead (antes do áudio final)
const RESPONSE_SET_3 = [
  "Nossa, estou gostando muito dessa conversa...",
  "Você sabe como prender a atenção de uma mulher 💋",
  "Queria poder te conhecer melhor, sabe?",
  "Você me faz querer continuar conversando por horas...",
  "Estou aqui sorrindo com suas mensagens 😊",
];

// Respostas para a 4ª mensagem do lead (final)
const RESPONSE_SET_4 = [
  "Adorei nosso papo! Espero que a gente continue...",
  "Foi tão bom conversar com você! Quero mais 💕",
  "Você me conquistou com essa conversa...",
  "Não quero parar de falar com você... 💋",
  "Essa conversa foi especial pra mim...",
];

interface ChatState {
  usedOpeningIndex: number;
  usedResponses: { [key: number]: number[] };
  audioIntroSent: boolean;
  audioFinalSent: boolean;
  messagesCount: number;
}

const CHAT_STATE_KEY = "chatConversationState";

export const useChatMessages = (profileName: string) => {
  const [state, setState] = useState<ChatState>(() => {
    const saved = localStorage.getItem(CHAT_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          usedOpeningIndex: -1,
          usedResponses: { 1: [], 2: [], 3: [], 4: [] },
          audioIntroSent: false,
          audioFinalSent: false,
          messagesCount: 0,
        };
      }
    }
    return {
      usedOpeningIndex: -1,
      usedResponses: { 1: [], 2: [], 3: [], 4: [] },
      audioIntroSent: false,
      audioFinalSent: false,
      messagesCount: 0,
    };
  });

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Obter mensagem de abertura única
  const getOpeningMessage = useCallback((): string => {
    if (state.usedOpeningIndex >= 0) {
      // Já enviou abertura, retornar a mesma
      return OPENING_MESSAGES[state.usedOpeningIndex].replace("meu perfil", `meu perfil... Sou a ${profileName}`);
    }

    // Escolher nova mensagem de abertura
    const availableIndexes = OPENING_MESSAGES.map((_, i) => i).filter(
      (i) => i !== state.usedOpeningIndex
    );
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    setState((prev) => ({ ...prev, usedOpeningIndex: randomIndex }));

    return OPENING_MESSAGES[randomIndex].replace("meu perfil", `meu perfil... Sou a ${profileName}`);
  }, [state.usedOpeningIndex, profileName]);

  // Obter resposta baseada no número da mensagem do lead
  const getResponseForMessage = useCallback((messageNumber: number): string => {
    let responseSet: string[];
    
    switch (messageNumber) {
      case 1:
        responseSet = RESPONSE_SET_1;
        break;
      case 2:
        responseSet = RESPONSE_SET_2;
        break;
      case 3:
        responseSet = RESPONSE_SET_3;
        break;
      case 4:
      default:
        responseSet = RESPONSE_SET_4;
        break;
    }

    const usedIndexes = state.usedResponses[messageNumber] || [];
    const availableIndexes = responseSet.map((_, i) => i).filter(
      (i) => !usedIndexes.includes(i)
    );

    // Se todas foram usadas, resetar
    const indexPool = availableIndexes.length > 0 ? availableIndexes : responseSet.map((_, i) => i);
    const randomIndex = indexPool[Math.floor(Math.random() * indexPool.length)];

    setState((prev) => ({
      ...prev,
      usedResponses: {
        ...prev.usedResponses,
        [messageNumber]: [...(prev.usedResponses[messageNumber] || []), randomIndex],
      },
      messagesCount: messageNumber,
    }));

    return responseSet[randomIndex];
  }, [state.usedResponses]);

  // Marcar áudio de introdução como enviado
  const markIntroAudioSent = useCallback(() => {
    setState((prev) => ({ ...prev, audioIntroSent: true }));
  }, []);

  // Marcar áudio final como enviado
  const markFinalAudioSent = useCallback(() => {
    setState((prev) => ({ ...prev, audioFinalSent: true }));
  }, []);

  // Verificar se deve enviar áudio de introdução
  const shouldSendIntroAudio = useCallback((): boolean => {
    return !state.audioIntroSent;
  }, [state.audioIntroSent]);

  // Verificar se deve enviar áudio final (antes da 4ª mensagem, após a 3ª)
  const shouldSendFinalAudio = useCallback((currentMessageCount: number): boolean => {
    return currentMessageCount === 3 && !state.audioFinalSent;
  }, [state.audioFinalSent]);

  // Resetar conversa (para novo chat)
  const resetConversation = useCallback(() => {
    localStorage.removeItem(CHAT_STATE_KEY);
    setState({
      usedOpeningIndex: -1,
      usedResponses: { 1: [], 2: [], 3: [], 4: [] },
      audioIntroSent: false,
      audioFinalSent: false,
      messagesCount: 0,
    });
  }, []);

  return {
    getOpeningMessage,
    getResponseForMessage,
    markIntroAudioSent,
    markFinalAudioSent,
    shouldSendIntroAudio,
    shouldSendFinalAudio,
    resetConversation,
    messagesCount: state.messagesCount,
    audioIntroSent: state.audioIntroSent,
    audioFinalSent: state.audioFinalSent,
  };
};
