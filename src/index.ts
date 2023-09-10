'use client';

import { ModeContextProvider as BrowserOnlyModeContextProvider } from '@-ft/mode-react';
import dynamic from 'next/dynamic';

export const ModeContextProvider = dynamic(
  () => Promise.resolve(BrowserOnlyModeContextProvider),
  { ssr: false }
);

export { ModeContext } from '@-ft/mode-react';
