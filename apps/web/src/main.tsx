import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from '@qlp/ui';
import App from './App';
import './i18n';
import './styles/globals.css';

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster position="top-right" theme={theme} />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <ThemedToaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
