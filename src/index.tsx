'use client';

import {
  sanitizeMode,
  type Mode,
  type ModeManager,
  type Theme,
} from '@-ft/mode';
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
    (mode: Mode) => modeManager?.setMode(mode),
    [modeManager]
  );

  useEffect(() => modeManager?.watchMode(setMode), [modeManager]);
  useEffect(() => modeManager?.watchTheme(setTheme), [modeManager]);

  return (
    <ModeContext.Provider
      value={useMemo(
        () => ({ mode, theme, setMode: setModeExternal }),
        [mode, theme, setModeExternal]
      )}
    >
      {children}
    </ModeContext.Provider>
  );
}

export type { Mode, ModeManager, Theme } from '@-ft/mode';
