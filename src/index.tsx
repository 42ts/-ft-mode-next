'use client';

import {
  sanitizeMode,
  type Mode,
  type ModeManager,
  type Theme,
} from '@-ft/mode';
import dynamic from 'next/dynamic';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ModeContextType {
  mode: Mode;
  theme: Theme;
  setMode(mode: Mode): void;
}
export const ModeContext = createContext<ModeContextType>(
  {} as unknown as ModeContextType
);

export interface ModeContextProviderProps extends PropsWithChildren {
  ssrInitialMode: string;
  variableName: string;
}

interface CSROnlyInternalProps {
  variableName: string;
  setMode: (mode: Mode) => void;
  setTheme: (theme: Theme) => void;
}

const CSROnlyInternal = dynamic(
  Promise.resolve(function CSROnlyInternal({
    variableName,
    setMode,
    setTheme,
  }: CSROnlyInternalProps) {
    const modeManager: ModeManager = (window as any)[variableName];
    useEffect(
      () => modeManager && setTheme(modeManager.getTheme()),
      [modeManager]
    );
    useEffect(() => modeManager?.watchMode(setMode), [modeManager, setMode]);
    useEffect(() => modeManager?.watchTheme(setTheme), [modeManager, setTheme]);

    return null;
  }),
  { ssr: false }
);

export function ModeContextProvider({
  children,
  ssrInitialMode,
  variableName,
}: ModeContextProviderProps) {
  const modeManager: ModeManager | undefined =
    typeof window !== 'undefined' ? (window as any)[variableName] : undefined;
  const [mode, setMode] = useState(() => sanitizeMode(ssrInitialMode));
  const [theme, setTheme] = useState<Theme>('light');

  const setModeExternal = useCallback(
    (mode: Mode) => modeManager && modeManager.setMode(mode),
    [modeManager]
  );

  return (
    <ModeContext.Provider
      value={useMemo(
        () => ({ mode, theme, setMode: setModeExternal }),
        [mode, theme, setModeExternal]
      )}
    >
      <CSROnlyInternal
        variableName={variableName}
        setMode={setMode}
        setTheme={setTheme}
      />
      {children}
    </ModeContext.Provider>
  );
}

export type { Mode, ModeManager, Theme } from '@-ft/mode';
