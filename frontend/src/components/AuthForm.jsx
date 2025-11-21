import { useState } from 'react';
import Input from './Input';

export default function AuthForm({ title, onSubmit, submitText = 'Enviar' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);
    try {
      await onSubmit({ email, password });
      setMsg('Operación exitosa ✅');
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 16 }}>{title}</h2>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '10px 14px', borderRadius: 8 }}
      >
        {loading ? 'Procesando…' : submitText}
      </button>
      {msg && <p style={{ color: 'green', marginTop: 12 }}>{msg}</p>}
      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
    </form>
  );
}
