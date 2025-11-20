import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const [view, setView] = useState<'login' | 'register'>('login')

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Club Sol de América</h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('register')}>Registro</button>
      </div>
      {view === 'login' ? <Login /> : <Register />}
    </div>
  )
}
