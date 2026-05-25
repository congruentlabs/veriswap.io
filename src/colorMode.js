import { createContext, useContext } from 'react';

export const ColorModeContext = createContext({ mode: 'dark', toggle: () => {} });
export const useColorMode = () => useContext(ColorModeContext);
