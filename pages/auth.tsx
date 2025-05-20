import { useState } from 'react'
import { useRouter } from 'next/router'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const supabase = createPagesBrowserClient()

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setErrorMessage(error.message)
    } else {
      router.push('/')
    }
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setErrorMessage(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <img
        src="/LocalEcho Logo.png"
        alt="LocalEcho Logo"
        style={{ width: '120px', marginBottom: '1rem' }}
      />
      <h2>Sign In / Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        style={{ display: 'block', margin: '0.5rem auto', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        style={{ display: 'block', margin: '0.5rem auto', padding: '0.5rem', width: '100%' }}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSignIn} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
          Sign In
        </button>
        <button onClick={handleSignUp} style={{ padding: '0.5rem 1rem' }}>
          Sign Up
        </button>
      </div>
    </div>
  )
}
