import React, { createContext, useContext, useState, useEffect } from "react";
import { BRANCHES, Branch } from "@/data/branches";

type BranchContextType = {
  branch: Branch;
  setBranch: (branch: Branch) => void;
  branches: Branch[];
};

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within BranchProvider");
  return ctx;
};

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branch, setBranchState] = useState<Branch>(BRANCHES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedBranchId");
    if (saved) {
      const found = BRANCHES.find((b) => b.id === saved);
      if (found) setBranchState(found);
    }
  }, []);

  const setBranch = (b: Branch) => {
    setBranchState(b);
    localStorage.setItem("selectedBranchId", b.id);
  };

  return (
    <BranchContext.Provider value={{ branch, setBranch, branches: BRANCHES }}>
      {children}
    </BranchContext.Provider>
  );
};