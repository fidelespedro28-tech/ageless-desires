import { useState, useCallback } from "react";

interface UseLimitsOptions {
  maxLikes?: number;
  maxMessages?: number;
}

interface UseLimitsReturn {
  // State
  likesUsed: number;
  messagesUsed: number;
  likesRemaining: number;
  messagesRemaining: number;
  
  // Checks
  canLike: boolean;
  canSendMessage: boolean;
  isLikeLimitReached: boolean;
  isMessageLimitReached: boolean;
  
  // Actions
  useLike: () => boolean;
  useMessage: () => boolean;
  resetLimits: () => void;
  unlockVip: () => void;
  
  // VIP status
  isVip: boolean;
}

export const useLimits = ({
  maxLikes = 6,
  maxMessages = 4
}: UseLimitsOptions = {}): UseLimitsReturn => {
  const [likesUsed, setLikesUsed] = useState(0);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isVip, setIsVip] = useState(false);

  const likesRemaining = isVip ? 999 : Math.max(0, maxLikes - likesUsed);
  const messagesRemaining = isVip ? 999 : Math.max(0, maxMessages - messagesUsed);
  
  const canLike = isVip || likesUsed < maxLikes;
  const canSendMessage = isVip || messagesUsed < maxMessages;
  
  const isLikeLimitReached = !isVip && likesUsed >= maxLikes;
  const isMessageLimitReached = !isVip && messagesUsed >= maxMessages;

  const useLike = useCallback(() => {
    if (isVip || likesUsed < maxLikes) {
      setLikesUsed((prev) => prev + 1);
      return true;
    }
    return false;
  }, [isVip, likesUsed, maxLikes]);

  const useMessage = useCallback(() => {
    if (isVip || messagesUsed < maxMessages) {
      setMessagesUsed((prev) => prev + 1);
      return true;
    }
    return false;
  }, [isVip, messagesUsed, maxMessages]);

  const resetLimits = useCallback(() => {
    setLikesUsed(0);
    setMessagesUsed(0);
  }, []);

  const unlockVip = useCallback(() => {
    setIsVip(true);
  }, []);

  return {
    likesUsed,
    messagesUsed,
    likesRemaining,
    messagesRemaining,
    canLike,
    canSendMessage,
    isLikeLimitReached,
    isMessageLimitReached,
    useLike,
    useMessage,
    resetLimits,
    unlockVip,
    isVip
  };
};
