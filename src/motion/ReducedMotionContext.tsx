import { createContext, useContext, useState, type ReactNode } from "react";

interface ReducedMotionOverride {
  override: boolean | null;
  setOverride: (value: boolean | null) => void;
}

const ReducedMotionContext = createContext<ReducedMotionOverride | null>(null);

export function ReducedMotionProvider({
  children,
  forceValue,
}: {
  children: ReactNode;
  forceValue?: boolean | null;
}) {
  const [override, setOverride] = useState<boolean | null>(null);
  // forceValue prop always wins when provided
  const value = forceValue != null ? forceValue : override;

  return (
    <ReducedMotionContext.Provider value={{ override: value, setOverride }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionOverride() {
  const ctx = useContext(ReducedMotionContext);
  if (!ctx)
    throw new Error(
      "useReducedMotionOverride must be used within ReducedMotionProvider",
    );
  return ctx;
}

export function useReducedMotionContext(): boolean | null {
  const ctx = useContext(ReducedMotionContext);
  return ctx?.override ?? null;
}
