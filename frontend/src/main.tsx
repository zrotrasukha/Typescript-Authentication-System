import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClientOptions from './config/queryClient'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClientOptions}>
      <BrowserRouter>
        <Toaster/>
        <App />
        <ReactQueryDevtools initialIsOpen={false} position='bottom' />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
