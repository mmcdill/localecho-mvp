import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@/lib/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}