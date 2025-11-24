import { useState } from 'react';
import api from '../libs/api';
import Input from '../components/Input';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    dni: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone: '',
    address: '',
    // opcionales:
    branch_id: '',
    role_id: ''
  });

  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        dni: form.dni,
        first_name: form.first_name,
        last_name: form.last_name,
        birth_date: form.birth_date || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined
      };

      if (form.branch_id) payload.branch_id = Number(form.branch_id);
      if (form.role_id) payload.role_id = Number(form.role_id);

      await api.post('/auth/register', payload);
      setMsg('Registro exitoso ✅');
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 460, margin: '0 auto' }}>
      <h2>Crear cuenta</h2>

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={handle('email')}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={handle('password')}
        required
      />

      <Input label="DNI" value={form.dni} onChange={handle('dni')} required />
      <Input
        label="Nombre"
        value={form.first_name}
        onChange={handle('first_name')}
        required
      />
      <Input
        label="Apellido"
        value={form.last_name}
        onChange={handle('last_name')}
        required
      />

      <Input
        label="Fecha de nacimiento (YYYY-MM-DD)"
        value={form.birth_date}
        onChange={handle('birth_date')}
      />
      <Input label="Teléfono" value={form.phone} onChange={handle('phone')} />
      <Input
        label="Dirección"
        value={form.address}
        onChange={handle('address')}
      />

      {/* opcionales si querés crear club_users */}
      <Input
        label="Branch ID (opcional)"
        value={form.branch_id}
        onChange={handle('branch_id')}
      />
      <Input
        label="Role ID (opcional)"
        value={form.role_id}
        onChange={handle('role_id')}
      />

      <button
        type="submit"
        disabled={loading}
        style={{ padding: '10px 14px', borderRadius: 8 }}
      >
        {loading ? 'Registrando…' : 'Registrar'}
      </button>

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
    </form>
  );
}
