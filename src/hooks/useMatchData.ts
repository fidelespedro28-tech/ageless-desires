import { useState, useCallback } from "react";

export interface MatchData {
  leadName: string;
  leadEmail: string;
  pixKey: string;
  matchedProfile: {
    name: string;
    age: number;
    image: string;
  };
  matchTimestamp: string;
  matchId: string;
}

interface UseMatchDataReturn {
  matches: MatchData[];
  saveMatch: (profileData: { name: string; age: number; image: string }) => void;
  getLeadData: () => { name: string; email: string; pixKey: string } | null;
  setLeadData: (data: { name: string; email: string; pixKey: string }) => void;
  clearMatches: () => void;
}

const MATCHES_KEY = "matchedLeadData";
const LEAD_DATA_KEY = "leadUserData";

export const useMatchData = (): UseMatchDataReturn => {
  const [matches, setMatches] = useState<MatchData[]>(() => {
    try {
      const stored = localStorage.getItem(MATCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getLeadData = useCallback(() => {
    try {
      const stored = localStorage.getItem(LEAD_DATA_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const setLeadData = useCallback((data: { name: string; email: string; pixKey: string }) => {
    localStorage.setItem(LEAD_DATA_KEY, JSON.stringify(data));
  }, []);

  const saveMatch = useCallback((profileData: { name: string; age: number; image: string }) => {
    const leadData = getLeadData();
    
    const newMatch: MatchData = {
      leadName: leadData?.name || "Usuário",
      leadEmail: leadData?.email || "",
      pixKey: leadData?.pixKey || "",
      matchedProfile: profileData,
      matchTimestamp: new Date().toISOString(),
      matchId: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(updatedMatches));
    
    return newMatch;
  }, [matches, getLeadData]);

  const clearMatches = useCallback(() => {
    setMatches([]);
    localStorage.removeItem(MATCHES_KEY);
  }, []);

  return {
    matches,
    saveMatch,
    getLeadData,
    setLeadData,
    clearMatches,
  };
};
