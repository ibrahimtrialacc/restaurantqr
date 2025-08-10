import React from "react";
import { useBranch } from "./BranchContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const BranchSelector: React.FC = () => {
  const { branch, setBranch, branches } = useBranch();

  return (
    <div className="mb-4 w-full max-w-md">
      <Select value={branch.id} onValueChange={(id) => {
        const found = branches.find((b) => b.id === id);
        if (found) setBranch(found);
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;