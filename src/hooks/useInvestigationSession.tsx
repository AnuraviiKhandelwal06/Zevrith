
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearCurrentResult,
  setCurrentResult,
} from "../lib/history";

import type { InvestigationResult } from "../types/investigation";

type InvestigationSessionValue = {
  result: InvestigationResult | null;
  setResultFromInvestigation: (result: InvestigationResult) => void;
  setResultFromHistory: (result: InvestigationResult) => void;
  clearResult: () => void;
};

const InvestigationSessionContext =
  createContext<InvestigationSessionValue | null>(null);

export function InvestigationSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Start with no active result when the app loads.
  const [result, setResult] = useState<InvestigationResult | null>(null);

  const setResultFromInvestigation = useCallback(
    (next: InvestigationResult) => {
      setCurrentResult(next);
      setResult(next);
    },
    [],
  );

  const setResultFromHistory = useCallback(
    (next: InvestigationResult) => {
      setCurrentResult(next);
      setResult(next);
    },
    [],
  );

  const clearResult = useCallback(() => {
    clearCurrentResult();
    setResult(null);
  }, []);

  const value = useMemo(
    () => ({
      result,
      setResultFromInvestigation,
      setResultFromHistory,
      clearResult,
    }),
    [
      result,
      setResultFromInvestigation,
      setResultFromHistory,
      clearResult,
    ],
  );

  return (
    <InvestigationSessionContext.Provider value={value}>
      {children}
    </InvestigationSessionContext.Provider>
  );
}

export function useInvestigationSession(): InvestigationSessionValue {
  const context = useContext(InvestigationSessionContext);

  if (!context) {
    throw new Error(
      "useInvestigationSession must be used within InvestigationSessionProvider.",
    );
  }

  return context;
}
