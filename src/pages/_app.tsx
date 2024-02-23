import '@/styles/font.css';
import '@/styles/index.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

import { Portal } from '@headlessui/react';
import PageLoaderBar from '../components/common/PageLoaderBar/PageLoaderBar';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <PageLoaderBar />
      <Portal>
        <ToastContainer
          hideProgressBar
          position="bottom-left"
          closeButton={false}
          toastClassName="!bg-transparent !shadow-none !min-h-[unset] !overflow-visible !p-0 !mb-6"
          bodyClassName="!p-0 !text-base !text-content-primary !font-inter"
          icon={false}
          newestOnTop
        />
      </Portal>
    </QueryClientProvider>
  );
}
