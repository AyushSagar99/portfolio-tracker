"use client";
import { createContext, useContext, useState } from "react";

type ChainContextType = {
  selectedChain: number;
  setSelectedChain: (chainId: number) => void;
};

const ChainContext = createContext<ChainContextType>({
  selectedChain: 1,
  setSelectedChain: () => {},
});

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [selectedChain, setSelectedChain] = useState(1);
  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}
