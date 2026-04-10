import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavermapsProvider } from 'react-naver-maps';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const naverClientId = import.meta.env.VITE_NAVER_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NavermapsProvider ncpKeyId={naverClientId}>
        <App />
      </NavermapsProvider>
    </QueryClientProvider>
  </StrictMode>
);
