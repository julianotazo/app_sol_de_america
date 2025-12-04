import { useEffect, useState } from 'react';
import { registerRequest } from '../../services/auth';
import { getBranches, getRoles } from '../../services/catalogsService';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    dni: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone: '',
    address: '',
    branch_id: '',
    role_id: ''
  });

  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  // Carga de sedes y roles al montar el componente
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [branchesData, rolesData] = await Promise.all([
          getBranches(),
          getRoles()
        ]);

        setBranches(branchesData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error cargando catálogos:', error);
        setErr(
          'No se pudieron cargar las sedes y roles. Intenta recargar la página.'
        );
      } finally {
        setLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErr('');

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

      await registerRequest(payload);

      setMsg('Registro exitoso 🎉 Ahora podés iniciar sesión.');
      setForm({
        email: '',
        password: '',
        dni: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        phone: '',
        address: '',
        branch_id: '',
        role_id: ''
      });
    } catch (error) {
      setErr(
        error?.response?.data?.error || error?.message || 'Error inesperado 😢'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Crear una cuenta
        </h2>

        {/* EMAIL */}
        <label className="block mb-3">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </label>

        {/* PASSWORD */}
        <label className="block mb-3">
          <span className="text-gray-700">Contraseña</span>
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </label>

        {/* DNI */}
        <label className="block mb-3">
          <span className="text-gray-700">DNI</span>
          <input
            value={form.dni}
            onChange={handleChange('dni')}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </label>

        {/* NOMBRE */}
        <label className="block mb-3">
          <span className="text-gray-700">Nombre</span>
          <input
            value={form.first_name}
            onChange={handleChange('first_name')}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </label>

        {/* APELLIDO */}
        <label className="block mb-3">
          <span className="text-gray-700">Apellido</span>
          <input
            value={form.last_name}
            onChange={handleChange('last_name')}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </label>

        {/* FECHA NACIMIENTO */}
        <label className="block mb-3">
          <span className="text-gray-700">Fecha de nacimiento</span>
          <input
            type="date"
            value={form.birth_date}
            onChange={handleChange('birth_date')}
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        {/* TELEFONO */}
        <label className="block mb-3">
          <span className="text-gray-700">Teléfono</span>
          <input
            value={form.phone}
            onChange={handleChange('phone')}
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        {/* DIRECCION */}
        <label className="block mb-3">
          <span className="text-gray-700">Dirección</span>
          <input
            value={form.address}
            onChange={handleChange('address')}
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        {/* SEDE DEL CLUB */}
        <label className="block mb-3">
          <span className="text-gray-700">Sede del club (opcional)</span>
          <select
            value={form.branch_id}
            onChange={handleChange('branch_id')}
            className="mt-1 p-2 w-full border rounded bg-white"
            disabled={loadingCatalogs}
          >
            <option value="">Seleccionar sede...</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        {/* ROL DE USUARIO */}
        <label className="block mb-6">
          <span className="text-gray-700">Rol de usuario (opcional)</span>
          <select
            value={form.role_id}
            onChange={handleChange('role_id')}
            className="mt-1 p-2 w-full border rounded bg-white"
            disabled={loadingCatalogs}
          >
            <option value="">Seleccionar rol...</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>

        {/* BOTON */}
        <button
          type="submit"
          disabled={loading || loadingCatalogs}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-60"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        {loadingCatalogs && (
          <p className="mt-2 text-sm text-gray-500">
            Cargando sedes y roles...
          </p>
        )}

        {msg && <p className="mt-4 text-green-600">{msg}</p>}
        {err && <p className="mt-4 text-red-600">{err}</p>}
      </form>
    </div>
  );
}
