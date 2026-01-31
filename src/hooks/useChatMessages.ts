import { useState, useCallback, useEffect, useRef } from "react";

// Mensagens de abertura únicas por perfil (nunca repetir)
const OPENING_MESSAGES = [
  "Oi gato... adorei que você me curtiu 😘 já fiquei curiosa pra saber mais sobre você...",
  "Hmm... você tem um charme diferente 💕 O que te chamou atenção em mim?",
  "Oi amor! Vi que você deu match comigo... adorei seu perfil 😊 Me conta mais sobre você?",
  "Olá gatinho! Gostei do que vi... você parece ser bem interessante 💋",
  "Oi! Que bom que você apareceu... já estava querendo conhecer alguém como você 😏",
  "Ei você! Gostei muito do seu perfil... parece que a gente pode se dar muito bem 💖",
  "Oi amor, tudo bem? Adorei sua curtida... me fez querer saber mais sobre você...",
  "Olá! Você parece ter um jeitinho diferente que eu gosto 😊 Vamos conversar?",
];

// Respostas para a 1ª mensagem do lead (tom envolvente)
const RESPONSE_SET_1 = [
  "Hmm... você tem um jeito que me deixa curiosa 😏",
  "Adorei seu estilo, viu? Você sabe conversar 👀",
  "Me conta mais... tô adorando isso que você disse",
  "Você é diferente, gosto disso 😘",
  "Já fiquei imaginando a gente juntinhos...",
  "Nossa, gostei muito do seu jeito de falar... 💕",
  "Você me pegou de surpresa... de um jeito bom 😊",
  "Mmm interessante... continue, tô prestando atenção...",
];

// Respostas para a 2ª mensagem do lead (mais íntimo)
const RESPONSE_SET_2 = [
  "Conversar assim é bem mais interessante do que eu esperava... 💋",
  "Gosto quando a conversa flui naturalmente assim... 💕",
  "Você tem um jeito especial de se expressar... me atrai muito",
  "Cada vez gosto mais de conversar com você 😏",
  "Você é diferente dos outros que falam comigo aqui... e eu gosto disso",
  "Hmm... essa conversa tá me deixando curiosa pra te conhecer melhor...",
  "Você sabe como prender a atenção de uma mulher, né? 😘",
  "Tô aqui sorrindo por causa das suas mensagens... 💖",
];

// Respostas para a 3ª mensagem do lead (antes do áudio final - criar tensão)
const RESPONSE_SET_3 = [
  "Nossa, estou gostando muito dessa conversa... você é especial 💋",
  "Você sabe como fazer uma mulher madura se interessar de verdade...",
  "Queria poder te conhecer melhor, sabe? De perto... 😏",
  "Você me faz querer continuar conversando por horas...",
  "Estou aqui sorrindo com suas mensagens... você me conquistou 😊",
  "Mmm... adorando cada palavra sua... continua me contando mais 💕",
  "Você tem um efeito em mim que eu não esperava... gostei disso",
  "A gente tem muita química, você não acha? 🔥",
];

// Respostas para a 4ª mensagem do lead (final - criar desejo de continuar)
const RESPONSE_SET_4 = [
  "Adorei nosso papo! Não quero que acabe por aqui... 💕",
  "Foi tão bom conversar com você! Quero muito mais disso...",
  "Você me conquistou completamente com essa conversa... 💋",
  "Não quero parar de falar com você... preciso de mais...",
  "Essa conversa foi especial pra mim... quero continuar...",
  "Você é incrível, sabia? Quero te conhecer ainda mais... 😘",
  "Hmm... tô com vontade de te contar mais coisas... pessoalmente 😏",
  "Gostei tanto de você que não quero que isso acabe... 💖",
];

interface ChatState {
  usedOpeningIndex: number;
  usedResponses: { [key: number]: number[] };
  audioIntroSent: boolean;
  audioFinalSent: boolean;
  giftSent: boolean; // Flag para presente PIX enviado apenas uma vez
  messagesCount: number;
  savedMessages: Array<{
    id: number;
    content: string;
    isUser: boolean;
    timestamp: string;
    isAudio?: boolean;
    audioSrc?: string;
  }>;
  introAudioTriggered: boolean;
}

const CHAT_STATE_KEY = "chatConversationState";

const getInitialState = (): ChatState => ({
  usedOpeningIndex: -1,
  usedResponses: { 1: [], 2: [], 3: [], 4: [] },
  audioIntroSent: false,
  audioFinalSent: false,
  giftSent: false,
  messagesCount: 0,
  savedMessages: [],
  introAudioTriggered: false,
});

export const useChatMessages = (profileName: string) => {
  const [state, setState] = useState<ChatState>(() => {
    const saved = localStorage.getItem(CHAT_STATE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...getInitialState(),
          ...parsed,
        };
      } catch {
        return getInitialState();
      }
    }
    return getInitialState();
  });

  // Ref para evitar múltiplos disparos de áudio
  const audioIntroRef = useRef(state.audioIntroSent);
  const audioFinalRef = useRef(state.audioFinalSent);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
    audioIntroRef.current = state.audioIntroSent;
    audioFinalRef.current = state.audioFinalSent;
  }, [state]);

  // Salvar mensagens da conversa (persistência)
  const saveMessages = useCallback((messages: ChatState['savedMessages']) => {
    setState((prev) => ({
      ...prev,
      savedMessages: messages,
    }));
  }, []);

  // Recuperar mensagens salvas
  const getSavedMessages = useCallback(() => {
    return state.savedMessages;
  }, [state.savedMessages]);

  // Verificar se já tem conversa salva
  const hasSavedConversation = useCallback(() => {
    return state.savedMessages.length > 0;
  }, [state.savedMessages]);

  // Obter mensagem de abertura única
  const getOpeningMessage = useCallback((): string => {
    if (state.usedOpeningIndex >= 0 && state.usedOpeningIndex < OPENING_MESSAGES.length) {
      return OPENING_MESSAGES[state.usedOpeningIndex].replace("{name}", profileName);
    }

    const availableIndexes = OPENING_MESSAGES.map((_, i) => i).filter(
      (i) => i !== state.usedOpeningIndex
    );
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    setState((prev) => ({ ...prev, usedOpeningIndex: randomIndex }));

    return OPENING_MESSAGES[randomIndex].replace("{name}", profileName);
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

  // Marcar áudio de introdução como enviado (com proteção contra duplicatas)
  const markIntroAudioSent = useCallback(() => {
    if (!audioIntroRef.current) {
      audioIntroRef.current = true;
      setState((prev) => ({ 
        ...prev, 
        audioIntroSent: true,
        introAudioTriggered: true,
      }));
      console.log("🎵 Áudio intro marcado como enviado");
    }
  }, []);

  // Marcar áudio final como enviado (com proteção contra duplicatas)
  const markFinalAudioSent = useCallback(() => {
    if (!audioFinalRef.current) {
      audioFinalRef.current = true;
      setState((prev) => ({ ...prev, audioFinalSent: true }));
      console.log("🎵 Áudio final marcado como enviado");
    }
  }, []);

  // Verificar se deve enviar áudio de introdução (apenas uma vez por conversa)
  const shouldSendIntroAudio = useCallback((): boolean => {
    // Verificar tanto o state quanto o ref para garantir
    const shouldSend = !state.audioIntroSent && !audioIntroRef.current && !state.introAudioTriggered;
    console.log("🔍 shouldSendIntroAudio:", shouldSend, {
      audioIntroSent: state.audioIntroSent,
      audioIntroRef: audioIntroRef.current,
      introAudioTriggered: state.introAudioTriggered,
    });
    return shouldSend;
  }, [state.audioIntroSent, state.introAudioTriggered]);

  // Verificar se deve enviar áudio final (APÓS a 3ª mensagem, ANTES da 4ª)
  const shouldSendFinalAudio = useCallback((currentMessageCount: number): boolean => {
    const shouldSend = currentMessageCount === 3 && !state.audioFinalSent && !audioFinalRef.current;
    console.log("🔍 shouldSendFinalAudio:", shouldSend, { currentMessageCount, audioFinalSent: state.audioFinalSent });
    return shouldSend;
  }, [state.audioFinalSent]);

  // Verificar se conversa está finalizada (para bloqueio por device)
  const isConversationFinalized = useCallback((): boolean => {
    return state.messagesCount >= 4;
  }, [state.messagesCount]);

  // Resetar conversa (para novo chat ou debugging)
  const resetConversation = useCallback(() => {
    localStorage.removeItem(CHAT_STATE_KEY);
    audioIntroRef.current = false;
    audioFinalRef.current = false;
    setState(getInitialState());
  }, []);

  // Verificar se deve enviar presente (após 2ª mensagem)
  const shouldSendGift = useCallback((currentMessageCount: number): boolean => {
    return currentMessageCount === 2 && !state.giftSent;
  }, [state.giftSent]);

  // Marcar presente como enviado
  const markGiftSent = useCallback(() => {
    setState((prev) => ({ ...prev, giftSent: true }));
    console.log("🎁 Presente PIX marcado como enviado");
  }, []);

  return {
    getOpeningMessage,
    getResponseForMessage,
    markIntroAudioSent,
    markFinalAudioSent,
    shouldSendIntroAudio,
    shouldSendFinalAudio,
    shouldSendGift,
    markGiftSent,
    isConversationFinalized,
    resetConversation,
    saveMessages,
    getSavedMessages,
    hasSavedConversation,
    messagesCount: state.messagesCount,
    audioIntroSent: state.audioIntroSent,
    audioFinalSent: state.audioFinalSent,
    giftSent: state.giftSent,
  };
};
