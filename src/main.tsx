import { initThemeMode } from "flowbite-react";
import { ThemeInit } from "../.flowbite-react/init.tsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/store/rootStore';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeInit />
      <App />
    </Provider>
  </StrictMode>
);


initThemeMode();
