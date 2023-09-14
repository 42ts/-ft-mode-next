# `mode-next` - Theme mode manager wrapper for Next

Next wrapper of dark/light theme mode manager for web

## Usage

- Generate `/public/mode.js` using `@-ft/mode-codegen` package.

```json
{
  "variableName": "__theme_mode",
  "persist": {
    "type": "cookie",
    "key": "THEME_MODE",
  }
}
```

- Load `/mode.js` in `src/app/layout.tsx`, and suppress hydration warning

```tsx
import { ModeContextProvider } from '@-ft/mode-next';

export default function RootLayout({ children }: PropsWithChildren) {
  const mode = cookies().get('THEME_MODE');
  return (
    <html lang="en" className={mode?.value} suppressHydrationWarning>
      <head>
        <script src="/mode.js" />
      </head>
      <body>
        <ModeContextProvider variableName="__theme_mode">
          {children}
        </ModeContextProvider>
      </body>
    </html>
  );
}
```

- Then you can use `ModeContext` in your app.

```jsx
'use client';

import { ModeContext } from '@-ft/mode-next';

function ModeBar() {
  const { mode, setMode } = useContext(ModeContext);

  return (
    <Bar>
      Current theme mode is {mode}.
      <Select
        onChange={useCallback((mode) => setMode(mode), [setMode])}
      >
        {['system', 'light', 'dark']}
      </Select>
    </Bar>
  )
}

```
