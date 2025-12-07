import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    if (!user) return 'Usuario';
    if (user.first_name) return user.first_name;
    if (user.name) return user.name.split(' ')[0];
    return 'Usuario';
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return 'US';
    const first = user.first_name?.[0] || user.name?.split(' ')[0]?.[0];
    const last = user.last_name?.[0] || user.name?.split(' ')[1]?.[0];
    const joined = `${first ?? ''}${last ?? ''}`;
    return joined || 'US';
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToProfile = () => {
    setOpen(false);
    navigate('/perfil');
  };
  return (
    <header className="relative h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-sol-blue">Panel del Club</h1>

      <div className="flex items-center gap-3">
        <span className="font-medium text-sol-blue">{displayName}</span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="h-10 w-10 rounded-full border-2 border-sol-blue bg-sol-blue text-white font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sol-blue"
            aria-haspopup="true"
            aria-expanded={open}
            aria-label="Abrir menú de usuario"
          >
            {initials}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              <button
                type="button"
                onClick={goToProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                Ver perfil
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
